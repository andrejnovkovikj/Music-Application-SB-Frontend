import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import artistService from "../../services/artistService";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

const DetailsArtist = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const artistData = await artistService.getArtistById(id);
                setArtist(artistData);

                const albumsResponse = await axios.get(
                    `https://music-application-sb.onrender.com/api/artists/get/${artistData.id}`
                );
                setAlbums(albumsResponse.data || []);

                if (!isAuthenticated || !currentUser) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://music-application-sb.onrender.com/api/users/current-user-role/${currentUser.username}`,
                    { withCredentials: true }
                );
                setIsAdmin(response.data);
            } catch (error) {
                console.error("Error fetching artist details or albums:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [id, isAuthenticated, currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this artist?")) {
            try {
                await artistService.deleteArtist(id);
                navigate("/artists");
            } catch (error) {
                console.error("Error deleting artist:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!artist) {
        return <div>Error: Artist not found</div>;
    }

    return (
        <div className="container-sm mt-5 p-4" style={{ maxWidth: "900px" }}>
            <h1 className="text-center">{artist.name}</h1>
            <p className="text-center">{artist.bio}</p>
            <div className="d-flex justify-content-center">
                <img
                    className="img-fluid"
                    src={artist.imageUrl}
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                    alt={artist.name}
                />
            </div>

            {isAdmin && (
                <div className="d-flex justify-content-center p-3">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-options">
                            Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/artists/edit/${artist.id}`}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(artist.id)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}

            <div className="mt-4 d-flex justify-content-center">
                <div className="card shadow-sm p-3" style={{ width: "80%" }}>
                    <h3 className="text-center">Albums by {artist.name}:</h3>
                    {albums.length > 0 ? (
                        <ul className="list-group">
                            {albums.map((album) => (
                                <Link to={`/albums/${album.id}`} key={album.id} className="list-group-item">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={album.imageUrl}
                                            alt={album.title}
                                            className="rounded me-3"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                        <h5 className="mb-0">{album.title}</h5>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center">No albums available for this artist.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsArtist;
