import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlbumService from "../../services/albumService";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

const DetailsAlbum = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [liked, setLiked] = useState(false);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const albumData = await AlbumService.getAlbumsById(id);
                setAlbum(albumData);

                const songsResponse = await AlbumService.getSongsFromAlbum(albumData.id);
                setSongs(songsResponse);

                if (!isAuthenticated || !currentUser) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://music-application-sb.onrender.com/api/users/${currentUser.username}/liked-albums`,
                    { withCredentials: true }
                );
                const isLiked = response.data.some((album) => album.id === albumData.id);
                setLiked(isLiked);
            } catch (error) {
                console.error("Error fetching album:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [id, isAuthenticated, currentUser]);


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this album?")) {
            try {
                await AlbumService.deleteAlbum(id);
                navigate("/albums");
            } catch (error) {
                console.error("Error deleting album:", error);
            }
        }
    };

    const handleLike = async () => {
        try {
            await axios.post(
                `https://music-application-sb.onrender.com/api/albums/${id}/like`,
                {},
                { withCredentials: true }
            );
            setLiked(true);
        } catch (error) {
            console.error("Error liking the album", error);
        }
    };

    const handleUnlike = async () => {
        try {
            await axios.post(
                `https://music-application-sb.onrender.com/api/albums/${id}/unlike`,
                {},
                { withCredentials: true }
            );
            setLiked(false);
        } catch (error) {
            console.error("Error unliking the album", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!album) {
        return <div>Error: Album not found</div>;
    }

    return (
        <div className="container-sm mt-5 p-4" style={{ maxWidth: "900px" }}>
            <h1 className="text-center">{album.title}</h1>
            <h6 className="text-center">{album.artist.name}</h6>

            <div className="d-flex justify-content-center">
                <img
                    className="img-fluid"
                    src={album.imageUrl}
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                    alt={album.title}
                />
            </div>

            <div className="d-flex justify-content-center p-3">
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-options">
                        Options
                    </Dropdown.Toggle>

                    <Dropdown.Menu>

                        {/* Like / Unlike */}
                        {liked ? (
                            <Dropdown.Item onClick={handleUnlike}>Dislike</Dropdown.Item>
                        ) : (
                            <Dropdown.Item onClick={handleLike}>Like</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className="mt-4 d-flex justify-content-center">
                <div className="card shadow-sm p-3" style={{ width: "80%" }}>
                    <h3 className="text-center">Songs in this Album:</h3>
                    {songs.length > 0 ? (
                        <ul className="list-group">
                            {songs.map((song) => (
                                <Link to={`/songs/${song.id}`} key={song.id} className="list-group-item">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={song.album.imageUrl}
                                            alt={song.title}
                                            className="rounded me-3"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                        <h5 className="mb-0">{song.title}</h5>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center">No songs available for this album.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsAlbum;
