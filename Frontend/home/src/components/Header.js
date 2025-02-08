import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="header">
    <h1 className="header-title">Whistle Counter</h1>
    <nav>
      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        {/* <li><Link to="/counter">Counter</Link></li> */}
      </ul>
    </nav>
  </header>
);

export default Header;
