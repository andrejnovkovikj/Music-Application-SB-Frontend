import React, { useState, useEffect } from "react";
import artistService from "../../services/artistService";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

const ListArtist = ({ isAuthenticated, currentUser }) => {
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await artistService.getAllArtists();
                setArtists(data);
            } catch (error) {
                console.error("Error fetching artists: ", error);
            } finally {
                setLoading(false);
            }
        };

        const checkAdminStatus = async () => {
            if (!isAuthenticated || !currentUser) return;

            try {
                const response = await axios.get(
                    `https://music-application-sb.onrender.com/api/users/current-user-role/${currentUser.username}`,
                    { withCredentials: true }
                );
                setIsAdmin(response.data);
            } catch (error) {
                console.error("Error checking role:", error);
            }
        };

        fetchArtists();
        checkAdminStatus();
    }, [isAuthenticated, currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this artist?")) {
            try {
                await artistService.deleteArtist(id);
                setArtists((prevArtists) => prevArtists.filter((artist) => artist.id !== id));
            } catch (error) {
                console.error("Error deleting artist: ", error);
            }
        }
    };

    const filteredArtists = artists.filter((artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <h1 className="mb-4 text-center">Artists</h1>

            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for an artist..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12">
                    <ul className="list-group list-group-flush">
                        {filteredArtists.length > 0 ? (
                            filteredArtists.map((artist) => (
                                <li
                                    key={artist.id}
                                    className="list-group-item d-flex justify-content-between align-items-center py-2 mb-2 shadow-sm rounded"
                                >
                                    <div className="d-flex align-items-center">
                                        <img
                                            className="img-fluid rounded-circle me-3"
                                            src={artist.imageUrl}
                                            alt={artist.name}
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        <div className="flex-grow-1" style={{ textAlign: "center", paddingLeft: "10px" }}>
                                            <Link to={`/artists/${artist.id}`} className="text-dark text-decoration-none">
                                                {artist.name}
                                            </Link>
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                                <i className="fas fa-bars"></i>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item as={Link} to={`/artists/edit/${artist.id}`}>
                                                    Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDelete(artist.id)}>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-center">No artists found</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ListArtist;
