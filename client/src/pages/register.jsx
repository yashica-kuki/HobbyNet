import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "./register.css";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    hobbyName: "", // Added hobby
  });

  const [existingHobbies, setExistingHobbies] = useState([]); // Store list from DB
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch existing hobbies when page loads
  useEffect(() => {
    const fetchHobbies = async () => {
        try {
            const res = await api.get("/users/hobbies");
            setExistingHobbies(res.data);
        } catch (err) {
            console.error("Could not load hobbies", err);
        }
    };
    fetchHobbies();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email is required";
    if (form.password.length < 6) newErrors.password = "Password min 6 chars";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.hobbyName.trim()) newErrors.hobbyName = "Please add a hobby";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await api.post("/users/register", form);
      setMessage("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.error) {
         setMessage("❌ " + err.response.data.error);
      } else {
         setMessage("❌ Registration failed.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Join the Community</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          {/* HOBBY INPUT WITH AUTOCOMPLETE */}
          <div className="form-group">
            <label>Primary Hobby</label>
            <input
              list="hobby-options" 
              type="text"
              placeholder="e.g. Photography, Gaming, Hiking..."
              value={form.hobbyName}
              onChange={(e) => setForm({ ...form, hobbyName: e.target.value })}
            />
            {/* The Datalist: Shows options but allows custom typing */}
            <datalist id="hobby-options">
                {existingHobbies.map((h, index) => (
                    <option key={index} value={h.name} />
                ))}
            </datalist>
            {errors.hobbyName && <p className="error">{errors.hobbyName}</p>}
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Password Inputs */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-submit">Register</button>
        </form>
      </div>
    </div>
  );
}