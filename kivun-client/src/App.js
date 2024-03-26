// App.js
import React from 'react';
import { BrowserRouter , Routes, Route, Switch } from 'react-router-dom';
import Upload from './components/upload'; // This is your existing Upload component
import Present from './components/present';
import HomePage from './components/homePage';

const App = () => {
  return (
    <Routes>

      {/* <Switch> */}
        <Route path="/"  element={<HomePage/>} />
        <Route path="/upload" element={<Upload/>} />
        <Route path="/present" element={<Present/>} />
      {/* </Switch> */}

    </Routes>
  );
};

export default App;