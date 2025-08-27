import React, { useState, useEffect } from "react";
import axios from "axios";
import './login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            alert("Form submitted");
            const response = await axios.post('http://localhost:8000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            setError("Server not found: " + error.message);
        }
    };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 19 || hour < 6) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, []);

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <div className="submit-btn">
                    <button type="submit">Submit</button>
                </div>
                {error && <p className="error-msg">{error}</p>}
            </form>
        </div>    
    );
};

export default Login;
