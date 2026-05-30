import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axiosClient.post(
                "/api/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data
            );

            toast.success("Login successful");

            navigate("/dashboard");

        } catch(error) {

            toast.error("Invalid credentials");
        }
    };

    return (

        <div style={pageStyle}>

            <div style={authCard}>

                <div style={logoCircle}>
                    ₹
                </div>

                <h1 style={titleStyle}>
                    Expense Flow
                </h1>

                <p style={subtitleStyle}>
                    Login to manage your expenses
                </p>

                <form onSubmit={handleSubmit}>

                    <label style={labelStyle}>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        style={loginButton}
                    >
                        Login
                    </button>

                </form>

                <p style={footerText}>
                    Don’t have an account?{" "}

                    <Link
                        to="/register"
                        style={linkStyle}
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a, #111827)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
    color: "#e5e7eb"
};

const authCard = {
    width: "420px",
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
    padding: "36px",
    borderRadius: "20px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.45)"
};

const logoCircle = {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 auto 18px auto"
};

const titleStyle = {
    textAlign: "center",
    margin: 0,
    color: "#f8fafc"
};

const subtitleStyle = {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: "28px"
};

const labelStyle = {
    display: "block",
    color: "#cbd5e1",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold"
};

const inputStyle = {
    width: "100%",
    padding: "13px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "14px"
};

const loginButton = {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "4px"
};

const footerText = {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: "22px"
};

const linkStyle = {
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: "bold"
};

export default LoginPage;