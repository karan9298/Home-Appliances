import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartCooking = () => {
    navigate('/counter');
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Let's Start Cooking</h1>
      <p className="home-subtitle">Click on the Counter tab to start counting whistles.</p>
      <button className="start-cooking-btn" onClick={handleStartCooking}>Start Cooking</button>
    </div>
  );
};

export default Home;
