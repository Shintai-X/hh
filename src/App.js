import * as React from 'react';
import TableCrud from './TableCrud';


function App() {
  const [selectedView, setSelectedView] = React.useState('REST');

  const handleButtonClick = (view) => {
    setSelectedView(view);
  };

  return (
    <div>
    

      {selectedView === 'REST' ? <TableCrud /> : null}
    </div>
  );
}

export default App;
