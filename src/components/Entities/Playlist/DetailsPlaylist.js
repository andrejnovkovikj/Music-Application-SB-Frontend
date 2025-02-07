import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import playlistService from "../../services/playlistService";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

const DetailsPlaylist = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchPlaylistData = async () => {
            try {
                const playlistData = await playlistService.getPlaylistById(id);
                setPlaylist(playlistData);

                if (isAuthenticated && currentUser?.username === playlistData.ime) {
                    setIsOwner(true);
                }

                if (isAuthenticated) {
                    const response = await axios.get(
                        `https://music-application-sb.onrender.com/api/users/${currentUser.username}/liked-playlists`,
                        { withCredentials: true }
                    );
                    const isLiked = response.data.some((p) => p.id === playlistData.id);
                    setLiked(isLiked);
                }

                const songsResponse = await axios.get(
                    `https://music-application-sb.onrender.com/api/playlists/get/${playlistData.id}`
                );
                setSongs(songsResponse.data || []);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistData();
    }, [id, isAuthenticated, currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
            try {
                await playlistService.deletePlaylist(id);
                navigate("/playlists");
            } catch (error) {
                console.error("Error deleting playlist:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading playlist...</div>;
    }

    if (!playlist) {
        return <div className="text-center text-danger mt-5">Playlist not found.</div>;
    }

    return (
        <div className="container-sm mt-5 p-4" style={{ maxWidth: "900px" }}>
            <h1 className="text-center">{playlist.name}</h1>
            <h6 className="text-center">{playlist.description}</h6>
            <p className="text-center">Created by: {playlist.ime}</p>

            <div className="d-flex justify-content-center">
                <img
                    className="img-fluid"
                    src={playlist.imageUrl}
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                    alt={playlist.name}
                />
            </div>

            {isOwner && (
                <div className="d-flex justify-content-center p-3">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-options">
                            Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/playlists/edit/${playlist.id}`}>
                                Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(playlist.id)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}

            <div className="mt-4">
                <div className="card shadow-sm p-3">
                    <h3 className="text-center">Songs in this Playlist:</h3>
                    {playlist.songs.length === 0 ? (
                        <p className="text-center">No songs available for this playlist.</p>
                    ) : (
                        <ul className="list-group">
                            {playlist.songs.map((song) => (
                                <li key={song.id} className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={song.album?.imageUrl || "https://via.placeholder.com/50"}
                                            alt={song.title}
                                            className="rounded me-3"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                        <div className="flex-grow-1">
                                            <Link to={`/songs/${song.id}`} className="text-dark text-decoration-none">
                                                <h6>{song.title}</h6>
                                            </Link>
                                            <Link to={`/artists/${song.artist.id}`} className="text-dark text-decoration-none">
                                                <small>{song.artist.name}</small>
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsPlaylist;
