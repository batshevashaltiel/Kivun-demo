// App.js
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Upload from './components/upload'; // This is your existing Upload component
import Present from './components/present';
import HomePage from './components/homePage';

const App = () => {
  return (
    <Routes>

        <Route path="/"  element={<HomePage/>} />
        <Route path="/upload" element={<Upload/>} />
        <Route path="/present" element={<Present/>} />

    </Routes>
  );
};

export default App;