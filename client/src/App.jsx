import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import RegisterPage from './pages/register';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App
