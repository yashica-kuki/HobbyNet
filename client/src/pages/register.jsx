import React, { useState } from "react";
import api from "../api/axios";
import "./register.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email is required";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
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

      setMessage("✅ Registration successful!");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

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
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
