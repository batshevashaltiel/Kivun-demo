// LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate('/upload')}>Upload CSV</button>
      <button onClick={() => navigate('/present')}>Present CSV Files</button>
    </div>
  );
};

export default HomePage;
