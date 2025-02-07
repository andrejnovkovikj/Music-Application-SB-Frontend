import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import songService from "../../services/songService";
import playlistService from "../../services/playlistService";
import axios from "axios";
import { Dropdown, Modal, Button, Form } from "react-bootstrap";

const DetailsSong = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [liked, setLiked] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [songInPlaylists, setSongInPlaylists] = useState(new Set());

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const songData = await songService.getSongById(id);
                setSong(songData);

                if (!isAuthenticated || !currentUser) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://music-application-sb.onrender.com/api/users/${currentUser.username}/liked-songs`,
                    { withCredentials: true }
                );
                setLiked(response.data.some((likedSong) => likedSong.id === songData.id));

                const playlistsResponse = await playlistService.getPlaylistsByUserId(currentUser.username);
                setPlaylists(playlistsResponse);

                const playlistsWithSong = new Set();
                playlistsResponse.forEach((playlist) => {
                    if (playlist.songs.some((s) => s.id === songData.id)) {
                        playlistsWithSong.add(playlist.id);
                    }
                });
                setSongInPlaylists(playlistsWithSong);
            } catch (error) {
                console.error("Error fetching song details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongData();
    }, [id, isAuthenticated, currentUser]);

    const handleLike = async () => {
        try {
            await songService.likeSong(id);
            setLiked(true);
        } catch (error) {
            console.error("Error liking the song", error);
        }
    };

    const handleUnlike = async () => {
        try {
            await songService.unlikeSong(id);
            setLiked(false);
        } catch (error) {
            console.error("Error unliking the song", error);
        }
    };

    const handleAddToPlaylist = async () => {
        if (!selectedPlaylist || songInPlaylists.has(parseInt(selectedPlaylist))) {
            return;
        }

        try {
            await playlistService.addSongToPlaylist(selectedPlaylist, id);
            alert("Song added to playlist!");

            setSongInPlaylists((prev) => new Set(prev).add(parseInt(selectedPlaylist)));
            setShowModal(false);
        } catch (error) {
            console.error("Error adding song to playlist:", error);
        }
    };

    const handleRemoveFromPlaylist = async (playlistId) => {
        try {
            await playlistService.removeSongFromPlaylist(playlistId, id);
            alert("Song removed from playlist!");

            setSongInPlaylists((prev) => {
                const updatedSet = new Set(prev);
                updatedSet.delete(playlistId);
                return updatedSet;
            });
        } catch (error) {
            console.error("Error removing song from playlist:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!song) return <div>Error: Song not found</div>;

    return (
        <div className="container-sm mt-5 p-4" style={{ maxWidth: "900px" }}>
            <h1 className="text-center">{song.title}</h1>
            <h6 className="text-center">by {song.artist.name}</h6>

            <div className="d-flex justify-content-center">
                <img
                    className="img-fluid"
                    src={song.album.imageUrl}
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                    alt={song.title}
                />
            </div>

            <div className="d-flex justify-content-center p-3">
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-options">
                        Options
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {liked ? (
                            <Dropdown.Item onClick={handleUnlike}>Dislike</Dropdown.Item>
                        ) : (
                            <Dropdown.Item onClick={handleLike}>Like</Dropdown.Item>
                        )}

                        <Dropdown.Divider />

                        <Dropdown.Item onClick={() => setShowModal(true)}>Add to Playlist</Dropdown.Item>

                        {playlists
                            .filter((playlist) => songInPlaylists.has(playlist.id))
                            .map((playlist) => (
                                <Dropdown.Item key={playlist.id} onClick={() => handleRemoveFromPlaylist(playlist.id)}>
                                    Remove from {playlist.name}
                                </Dropdown.Item>
                            ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className="mt-4 d-flex justify-content-center">
                <div className="card shadow-sm p-3" style={{ width: "80%" }}>
                    <h3 className="text-center">Album: {song.album.title}</h3>
                    <Link to={`/albums/${song.album.id}`} className="list-group-item">
                        <div className="d-flex align-items-center">
                            <img
                                src={song.album.imageUrl}
                                alt={song.album.title}
                                className="rounded me-3"
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                            <h5 className="mb-0">{song.album.title}</h5>
                        </div>
                    </Link>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add to Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select a Playlist</Form.Label>
                        <Form.Select
                            value={selectedPlaylist}
                            onChange={(e) => setSelectedPlaylist(e.target.value)}
                        >
                            <option value="">Select a playlist...</option>
                            {playlists.map((playlist) => (
                                <option
                                    key={playlist.id}
                                    value={playlist.id}
                                    disabled={songInPlaylists.has(playlist.id)}
                                >
                                    {playlist.name} {songInPlaylists.has(playlist.id) ? "(Already in)" : ""}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddToPlaylist} disabled={!selectedPlaylist || songInPlaylists.has(parseInt(selectedPlaylist))}>
                        Add Song
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DetailsSong;
