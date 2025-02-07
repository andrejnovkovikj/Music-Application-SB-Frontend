import React, { useEffect, useState } from "react";
import albumService from "../../services/albumService";
import { Link } from 'react-router-dom';
import axios from "axios";
import { Dropdown } from 'react-bootstrap';

const ListAlbum = ({ isAuthenticated, currentUser }) => {
    const [albums, setAlbums] = useState([]);
    const [likedAlbums, setLikedAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLikedAlbums = async () => {

        try {
            const response = await axios.get(
                `https://music-application-sb.onrender.com/api/users/${currentUser.username}/liked-albums`,
                { withCredentials: true }
            );
            setLikedAlbums(response.data.map(album => album.id));
        } catch (error) {
            console.error("Error fetching liked albums:", error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !currentUser) {
            setLoading(false);
            return;
        }

        const fetchAlbums = async () => {
            try {
                const albumData = await albumService.getAllAlbums();
                setAlbums(albumData);
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };

        const checkAdminRole = async () => {
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

        fetchAlbums();
        fetchLikedAlbums();
        checkAdminRole();
        setLoading(false);
    }, [isAuthenticated, currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this album?")) {
            try {
                await albumService.deleteAlbum(id);
                setAlbums(albums.filter(album => album.id !== id));
            } catch (error) {
                console.error("Error deleting album:", error);
            }
        }
    };

    const handleLike = async (albumId) => {
        try {
            await axios.post(
                `https://music-application-sb.onrender.com/api/albums/${albumId}/like`,
                {},
                { withCredentials: true }
            );
            setLikedAlbums([...likedAlbums, albumId]);
        } catch (error) {
            console.error("Error liking the album:", error);
        }
    };

    const handleUnlike = async (albumId) => {
        try {
            await axios.post(
                `https://music-application-sb.onrender.com/api/albums/${albumId}/unlike`,
                {},
                { withCredentials: true }
            );
            setLikedAlbums(likedAlbums.filter(id => id !== albumId));
        } catch (error) {
            console.error("Error unliking the album:", error);
        }
    };

    const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading albums...</div>;
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <h1 className="mb-4 text-center">Albums</h1>

            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for an album..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12">
                    <ul className="list-group list-group-flush">
                        {filteredAlbums.length > 0 ? (
                            filteredAlbums.map(album => (
                                <li key={album.id}
                                    className="list-group-item d-flex justify-content-between align-items-center py-2 mb-2 shadow-sm rounded">
                                    <div className="d-flex align-items-center">
                                        <img
                                            className="img-fluid rounded me-3"
                                            src={album.imageUrl}
                                            alt={album.title}
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        <div className="flex-grow-1" style={{ textAlign: "center", paddingLeft: "10px" }}>
                                            <Link to={`/albums/${album.id}`}
                                                  className="text-dark text-decoration-none">{album.title}</Link>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                                <i className="fas fa-bars"></i>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {isAdmin && (
                                                    <>
                                                        <Dropdown.Item as={Link}
                                                                       to={`/albums/edit/${album.id}`}>Edit</Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDelete(album.id)}>Delete</Dropdown.Item>
                                                    </>
                                                )}
                                                {likedAlbums.includes(album.id) ? (
                                                    <Dropdown.Item
                                                        onClick={() => handleUnlike(album.id)}>Dislike</Dropdown.Item>
                                                ) : (
                                                    <Dropdown.Item
                                                        onClick={() => handleLike(album.id)}>Like</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-center">No albums available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ListAlbum;
