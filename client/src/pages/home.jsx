import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDark = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`home-container ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="home-header">
        <div className="logo">Hobbynet</div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/community">Community</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="header-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Register</Link>
          <button onClick={toggleDark} className="dark-toggle">
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="main-title">HOBBYNET</h1>
        <p className="sub-text">Find your tribe, follow your passion</p>
        <div className="search-bar">
          <input type="text" placeholder="Search your passion..." />
          <button>Search</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h3>Popular Hobby Categories</h3>
        <div className="category-grid">
          <div className="category-card">🎨 Art & Drawing</div>
          <div className="category-card">💻 Programming</div>
          <div className="category-card">📷 Photography</div>
          <div className="category-card">🎮 Gaming</div>
          <div className="category-card">🎸 Music</div>
          <div className="category-card">🌱 Gardening</div>
        </div>
      </section>

      {/* Users */}
      <section className="user-preview">
        <h3>Meet Fellow Hobbyists</h3>
        <div className="user-grid">
          <div className="user-card">
            <img src="https://i.pravatar.cc/100?img=5" alt="User" />
            <p>Aryan • Painter</p>
          </div>
          <div className="user-card">
            <img src="https://i.pravatar.cc/100?img=20" alt="User" />
            <p>Meera • Coder</p>
          </div>
          <div className="user-card">
            <img src="https://i.pravatar.cc/100?img=12" alt="User" />
            <p>Vikram • Musician</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

