import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import RegisterPage from './pages/register';
import Dashboard from './pages/dashboard'; 
import Profile from "./pages/profile";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App
