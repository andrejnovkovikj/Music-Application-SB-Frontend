import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown, NavDropdown } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";

const NavigationBar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('https://music-application-sb.onrender.com/api/users/current-user', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user", error);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('https://music-application-sb.onrender.com/logout', {}, { withCredentials: true });
            setUser(null);
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <Navbar bg="black" variant="dark" expand="lg" className="shadow-sm px-3">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="me-3">Music App</Navbar.Brand>

                <Nav className="d-flex flex-row">
                    <Nav.Link as={NavLink} to="/albums">Albums</Nav.Link>
                    <Nav.Link as={NavLink} to="/artists">Artists</Nav.Link>
                    <Nav.Link as={NavLink} to="/playlists">Playlists</Nav.Link>
                    <Nav.Link as={NavLink} to="/songs">Songs</Nav.Link>
                    <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
                </Nav>

                <Nav className="ms-3">
                    <NavDropdown title="Create" id="create-dropdown">
                        <NavDropdown.Item as={Link} to="/albums/create">Create Album</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/artists/create">Create Artist</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/playlists/create">Create Playlist</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/songs/create">Create Song</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/users/create">Create User</NavDropdown.Item>
                    </NavDropdown>
                </Nav>

                <Nav className="ms-auto">
                    {user ? (
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="outline-light" id="user-dropdown" className="d-flex align-items-center">
                                <FaUserAlt className="me-2" /> Welcome, {user.username}!
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleLogout} className="text-danger">
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button as={Link} to="/login" variant="outline-light">Login</Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
