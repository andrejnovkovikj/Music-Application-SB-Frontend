import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import { Link } from 'react-router-dom';

const ListUser = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        userService.getAllUsers()
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <h1 className="mb-4 text-center">Users</h1>
            <div className="d-flex justify-content-center">
                <div className="col-md-2 col-sm-12">
                    <ul className="list-group list-group-flush">
                        {users.length > 0 ? (
                            users.map(user => (
                                <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center py-2 mb-2 shadow-sm rounded">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <div className="flex-grow-1 align-items-center" style={{ paddingLeft: "10px" }}>
                                                <Link to={`/users/${user.id}`} className="text-dark text-decoration-none">
                                                    <h6>{user.username}</h6>
                                                </Link>
                                                <small>{user.email}</small>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-center">No users available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ListUser;
