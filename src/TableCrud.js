import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const Actions = ({ onEdit, onDelete }) => (
  <td>
    <a href="#" className="edit" title="Edit" data-toggle="tooltip" onClick={onEdit}>
      <EditIcon style={{ fontSize: 20, color: "#10ab80" }} />
    </a>
    <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{ color: "red" }} onClick={onDelete}>
      <DeleteIcon style={{ fontSize: 20 }} />
    </a>
  </td>
);

function TableCrud() {
  const [show, setShow] = useState(false);
  const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    price: 0,
    quantity: '',
  });
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = () => {
    setShow(false);
    setConfirmDeleteShow(false);
    setSelectedProductIndex(null);
    setNewProduct({
      id: null,
      name: '',
      price: 0,
      quantity: '',
    });
  };

  const handleShow = () => setShow(true);
  const handleConfirmDeleteShow = () => setConfirmDeleteShow(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        const filteredProducts = response.data.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.quantity.toLowerCase().includes(searchQuery.toLowerCase()) 
        );
        setProducts(filteredProducts);
      })
      .catch(error => console.error('Erreur lors du chargement des produits', error));
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const apiUrl = 'http://localhost:8080/api/products';

    if (selectedProductIndex === null) {
      axios.post(apiUrl, newProduct)
        .then(response => {
          setProducts([...products, response.data]);
          handleClose();
        })
        .catch(error => console.error('Erreur lors de l\'ajout du produit', error));
    } else {
      const updatedProducts = [...products];
      updatedProducts[selectedProductIndex] = newProduct;

      axios.put(`${apiUrl}/${newProduct.id}`, newProduct)
        .then(() => {
          setProducts(updatedProducts);
          handleClose();
        })
        .catch(error => console.error('Erreur lors de la modification du produit', error));
    }
  };

  const handleEditProduct = (index) => {
    const selectedProduct = products[index];
    setNewProduct({ ...selectedProduct });
    setSelectedProductIndex(index);
    handleShow();
  };

  const handleDeleteProduct = () => {
    const apiUrl = 'http://localhost:8080/api/products';
    const productToDelete = products[selectedProductIndex];

    axios.delete(`${apiUrl}/${productToDelete.id}`)
      .then(() => {
        const updatedProducts = [...products];
        updatedProducts.splice(selectedProductIndex, 1);
        setProducts(updatedProducts);
        handleClose();
      })
      .catch(error => console.error('Erreur lors de la suppression du produit', error));
  };

  return (
    <div className="container">
      <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
        <div className="row">
          <div className="col-sm-3 mt-5 mb-4 text-gred">
            <div className="search">
              <form className="form-inline">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search Product"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
          <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: "green" }}><h2><b>Product Details</b></h2></div>
          <div className="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
            <Button variant="primary" onClick={handleShow}>
              Add New Product
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <Actions
                      onEdit={() => handleEditProduct(index)}
                      onDelete={() => {
                        setSelectedProductIndex(index);
                        handleConfirmDeleteShow();
                      }}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="model_box">
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{selectedProductIndex !== null ? 'Edit Product' : 'Add Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <input type="text" className="form-control" name="name" placeholder="Enter Product Name" value={newProduct.name} onChange={handleInputChange} />
                </div>
                <div className="form-group mt-3">
                  <input type="text" className="form-control" name="price" placeholder="Enter Product price" value={newProduct.price} onChange={handleInputChange} />
                </div>
                <div className="form-group mt-3">
                  <input type="text" className="form-control" name="quantity" placeholder="Enter Product quantity" value={newProduct.quantity} onChange={handleInputChange} />
                </div>
      
                <button type="submit" className="btn btn-success mt-4">{selectedProductIndex !== null ? 'Save Changes' : 'Add Product'}</button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <Modal show={confirmDeleteShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this product?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default TableCrud;
