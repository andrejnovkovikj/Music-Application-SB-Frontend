import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../services/userService";

const EditUser = ({ username }) => {
    const { id } = useParams();
    const [isAdmin,setIsAdmin] = useState(null);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        email: "",
        role: "",
        password: "",
    });

    useEffect(() => {
        userService.getUserById(id)
            .then((data) => setUser({
                username: data.username,
                email: data.email,
                role: data.role,
                password: data.password || "",
            }))
            .catch((error) => console.error("Error fetching user: ", error));
        if (username) {
            fetch(`https://music-application-sb.onrender.com/api/users/current-user-role/${username}`)
                .then((response) => response.json())
                .then((data) => {
                    setIsAdmin(data);
                })
                .catch((error) => console.error('Error checking role:', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedUser = {
            username: user.username,
            email: user.email,
            role: user.role,
            password: user.password,
        };

        userService.updateUser(id, updatedUser)
            .then(() => navigate("/users"))
            .catch((error) => {
                console.error("Error updating user: ", error);
                alert("Failed to update user");
            });
    };
    if (isAdmin === null) {
        return <div>You do not have permission to edit a user.</div>;
    }

    if (!isAdmin) {
        return <div>You do not have permission to edit a user.</div>;
    }
    return (
        <div className="container-sm mb-4 mt-3" style={{maxWidth:"900px"}}>
            <h1 className="mt-4 mb-4">Edit User</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Role:</label>
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="" disabled>Select role</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Leave empty to keep current password"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Update User
                </button>
            </form>
        </div>
    );
};

export default EditUser;
