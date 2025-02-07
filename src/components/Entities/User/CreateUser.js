import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";

const CreateUser = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [isPremium, setIsPremium] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = { username, email, password, role, isPremium };

        userService.createUser(newUser)
            .then(() => navigate("/users"))
            .catch((error) => console.error("Error creating user: ", error));
    };

    return (
        <div className="container-sm mb-4 mt-3" style={{ maxWidth: "900px" }}>
            <h1 className="mt-4 mb-4">Create User</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                        className="form-check-input"
                    />
                    <label className="form-check-label">Premium User</label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Create User
                </button>
            </form>
        </div>
    );
};

export default CreateUser;
