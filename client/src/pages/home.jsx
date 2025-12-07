// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './home.css';

// const Home = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     if (darkMode) {
//       document.body.classList.add('dark-mode');
//     } else {
//       document.body.classList.remove('dark-mode');
//     }
//   }, [darkMode]);

//   const toggleDark = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <div className={`home-container ${darkMode ? 'dark' : ''}`}>
//       {/* Header */}
//       <header className="home-header">
//         <div className="logo">Hobbynet</div>

//         <nav className="nav-links">
//           <Link to="/">Home</Link>
//           <Link to="/community">Community</Link>
//           <Link to="/explore">Explore</Link>
//           <Link to="/about">About</Link>
//         </nav>

//         <div className="header-buttons">
//           <Link to="/login" className="login-btn">Login</Link>
//           <Link to="/register" className="register-btn">Register</Link>
//           <button onClick={toggleDark} className="dark-toggle">
//             {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//           </button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="hero">
//         <h1 className="main-title">HOBBYNET</h1>
//         <p className="sub-text">Find your tribe, follow your passion</p>
//         <div className="search-bar">
//           <input type="text" placeholder="Search your passion..." />
//           <button>Search</button>
//         </div>
//       </section>

//       {/* Categories */}
//       <section className="categories">
//         <h3>Popular Hobby Categories</h3>
//         <div className="category-grid">
//           <div className="category-card">🎨 Art & Drawing</div>
//           <div className="category-card">💻 Programming</div>
//           <div className="category-card">📷 Photography</div>
//           <div className="category-card">🎮 Gaming</div>
//           <div className="category-card">🎸 Music</div>
//           <div className="category-card">🌱 Gardening</div>
//         </div>
//       </section>

//       {/* Users */}
//       <section className="user-preview">
//         <h3>Meet Fellow Hobbyists</h3>
//         <div className="user-grid">
//           <div className="user-card">
//             <img src="https://i.pravatar.cc/100?img=5" alt="User" />
//             <p>Aryan • Painter</p>
//           </div>
//           <div className="user-card">
//             <img src="https://i.pravatar.cc/100?img=20" alt="User" />
//             <p>Meera • Coder</p>
//           </div>
//           <div className="user-card">
//             <img src="https://i.pravatar.cc/100?img=12" alt="User" />
//             <p>Vikram • Musician</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  Heart, 
  Zap, 
  Palette, 
  Code, 
  Camera, 
  Gamepad2, 
  Music, 
  Sprout, 
  Sun, 
  Moon 
} from "lucide-react";
import './home.css'; 

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Dark Mode Logic
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

  const categories = [
    { name: "Art & Drawing", icon: Palette, colorClass: "icon-pink" },
    { name: "Programming", icon: Code, colorClass: "icon-violet" },
    { name: "Photography", icon: Camera, colorClass: "icon-rose" },
    { name: "Gaming", icon: Gamepad2, colorClass: "icon-orange" },
    { name: "Music", icon: Music, colorClass: "icon-blue" },
    { name: "Gardening", icon: Sprout, colorClass: "icon-green" },
  ];

  const users = [
    { name: "Aryan", role: "Painter", img: "https://i.pravatar.cc/100?img=5" },
    { name: "Meera", role: "Coder", img: "https://i.pravatar.cc/100?img=20" },
    { name: "Vikram", role: "Musician", img: "https://i.pravatar.cc/100?img=12" },
    { name: "Sarah", role: "Gamer", img: "https://i.pravatar.cc/100?img=32" },
  ];

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      
      {/* HEADER */}
      <header className="main-header">
        <div className="container header-content">
          <div className="logo-section">
            <Sparkles className="icon-logo" />
            <span className="logo-text">Hobbynet</span>
          </div>

          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/community">Community</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/about">About</Link>
          </nav>

          <div className="header-actions">
            <button onClick={toggleDark} className="theme-toggle">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register">
              <button className="register-btn">Register</button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          
          <div className="container hero-content">
            <div className="badge">
              <Star size={16} /> Join fellow hobbyists worldwide
            </div>
            
            <h1 className="hero-title">
              Find your tribe, <br />
              <span className="gradient-text">follow your passion</span>
            </h1>
            
            <div className="search-wrapper">
                <input 
                  type="text" 
                  placeholder="Search your passion..." 
                  className="hero-search"
                />
                <button className="search-btn">Search</button>
            </div>

            <div className="hero-cta">
              <Link to="/register">
                <button className="cta-btn">
                  Get Started <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section categories-section">
          <div className="container">
            <div className="section-header">
              <h2>Popular Hobby Categories</h2>
              <p>Dive into communities built around what you love.</p>
            </div>
            
            <div className="grid-container">
              {categories.map((cat) => (
                <div key={cat.name} className="card category-card">
                  <div className={`icon-box ${cat.colorClass}`}>
                    <cat.icon size={28} />
                  </div>
                  <h3>{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USERS */}
        <section className="section user-section">
          <div className="container">
            <div className="section-header">
              <h2>Meet Fellow Hobbyists</h2>
              <p>Connect with creators and enthusiasts just like you.</p>
            </div>

            <div className="grid-container user-grid">
              {users.map((user) => (
                <div key={user.name} className="card user-card">
                  <div className="user-avatar-wrapper">
                    <img src={user.img} alt={user.name} />
                    <div className="online-dot"></div>
                  </div>
                  <h3>{user.name}</h3>
                  <div className="user-role">
                    <Heart size={12} /> {user.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA CARD */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-card-gradient">
              <Zap size={64} className="cta-icon" />
              <h2>Ready to start your journey?</h2>
              <p>Join thousands of hobbyists sharing their passions every day on Hobbynet.</p>
              <Link to="/register">
                <button className="white-btn">Create Free Account</button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="container footer-content">
          <div className="logo-section">
            <Sparkles className="icon-logo" size={20} />
            <span>Hobbynet</span>
          </div>
          <p>© 2024 Hobbynet. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;