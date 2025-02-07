import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import songService from "../../services/songService";

const ListSong = ({ isAuthenticated, currentUser }) => {
    const [songs, setSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchLikedSongs = async () => {
        if (!isAuthenticated || !currentUser) return;
        try {
            const response = await axios.get(
                `https://music-application-sb.onrender.com/api/users/${currentUser.username}/liked-songs`,
                { withCredentials: true }
            );
            setLikedSongs(response.data.map(song => song.id));
        } catch (error) {
            console.error("Error fetching liked songs:", error);
        }
    };


    useEffect(() => {
        if (!isAuthenticated || !currentUser) {
            setLoading(false);
            return;
        }

        const fetchSongs = async () => {
            try {
                const songData = await songService.getAllSongs();
                setSongs(songData);
            } catch (error) {
                console.error("Error fetching songs:", error);
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

        fetchSongs();
        fetchLikedSongs();
        checkAdminRole();
        setLoading(false);
    }, [isAuthenticated, currentUser]);

    // Delete Song (Fix)
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this song?")) {
            try {
                await songService.deleteSong(id);
                setSongs(prevSongs => prevSongs.filter(song => song.id !== id));
                alert("Song deleted successfully!");
            } catch (error) {
                console.error("Error deleting song:", error);
                alert("Failed to delete the song.");
            }
        }
    };

    const handleLike = async (songId) => {
        try {
            await axios.post(
                `https://music-application-sb.onrender.com/api/songs/${songId}/like`,
                {},
                { withCredentials: true }
            );
            setLikedSongs([...likedSongs, songId]);
        } catch (error) {
            console.error("Error liking the song:", error);
        }
    };

    const handleUnlike = async (songId) => {
        try {
            await axios.post(
                `https://music-application-sb.onrender.com/api/songs/${songId}/unlike`,
                {},
                { withCredentials: true }
            );
            setLikedSongs(likedSongs.filter(id => id !== songId));
        } catch (error) {
            console.error("Error unliking the song:", error);
        }
    };

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading songs...</div>;
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <h1 className="mb-4 text-center">Songs</h1>

            {/* Search Input */}
            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a song..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12">
                    <ul className="list-group list-group-flush">
                        {filteredSongs.length > 0 ? (
                            filteredSongs.map(song => (
                                <li key={song.id}
                                    className="list-group-item d-flex justify-content-between align-items-center py-2 mb-2 shadow-sm rounded">
                                    <div className="d-flex align-items-center">
                                        <img
                                            className="img-fluid rounded me-3"
                                            src={song.album.imageUrl}
                                            alt={song.title}
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        <div className="flex-grow-1" style={{ textAlign: "center", paddingLeft: "10px" }}>
                                            <Link to={`/songs/${song.id}`}
                                                  className="text-dark text-decoration-none">{song.title}</Link>
                                            <br />
                                            <Link to={`/artists/${song.artist.id}`}
                                                  className="text-muted text-decoration-none">
                                                <small>{song.artist.name}</small>
                                            </Link>
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
                                                                       to={`/songs/edit/${song.id}`}>Edit</Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDelete(song.id)}>Delete</Dropdown.Item>
                                                    </>
                                                )}
                                                {likedSongs.includes(song.id) ? (
                                                    <Dropdown.Item
                                                        onClick={() => handleUnlike(song.id)}>Dislike</Dropdown.Item>
                                                ) : (
                                                    <Dropdown.Item
                                                        onClick={() => handleLike(song.id)}>Like</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-center">No songs available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ListSong;
