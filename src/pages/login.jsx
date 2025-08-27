import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/home");
    } catch (err) {
      alert(err.message || "Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Login to continue</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="username">Username</label>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <label style={styles.label} htmlFor="username">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Log In
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "linear-gradient(135deg, #f7f9fc 0%, #80b895ff 50%, #e9eef5 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid #eef0f3",
  },
  header: {
    marginBottom: "18px",
    textAlign: "center",
  },
  title: {
    margin: 0,
    color: "#222",
    fontSize: "26px",
    fontWeight: 700,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "10px",
  },
  label: {
    fontSize: "13px",
    color: "#4b5563",
  },
  input: {
    width: "93%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d9dee5",
    backgroundColor: "#fff",
    color: "#111827",
    fontSize: "15px",
    outline: "none",
    transition: "box-shadow 160ms ease, border-color 160ms ease",
  },
  button: {
    marginTop: "4px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #2f7b3a",
    backgroundColor: "#2f7b3a",
    color: "#fff",
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
    transition: "transform 120ms ease, box-shadow 160ms ease, filter 160ms ease",
  },
  footerText: {
    marginTop: "16px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },
  link: {
    color: "#2f7b3a",
    fontWeight: 700,
    textDecoration: "none",
  },
};

export default Login;
