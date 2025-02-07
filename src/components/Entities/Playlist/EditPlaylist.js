import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlaylistService from "../../services/playlistService";

const EditPlaylist = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState({
        name: '',
        description: '',
        imageUrl: '',
        creator: ''
    });

    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchPlaylistData = async () => {
            try {
                const data = await PlaylistService.getPlaylistById(id);
                setPlaylist({
                    name: data.name,
                    description: data.description,
                    imageUrl: data.imageUrl || "",
                    creator: data.ime
                });

                if (isAuthenticated && currentUser?.username === data.ime) {
                    setIsOwner(true);
                }
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistData();
    }, [id, isAuthenticated, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlaylist((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await PlaylistService.updatePlaylist(id, playlist);
            navigate(`/playlists`);
        } catch (error) {
            console.error("Error updating playlist:", error);
            alert("Failed to update playlist");
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading playlist...</div>;
    }

    if (!isOwner) {
        return (
            <div className="text-center text-danger mt-5">
                You do not have permission to edit this playlist.
            </div>
        );
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-4">Edit Playlist</h1>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-3 col-sm-12">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={playlist.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description:</label>
                            <textarea
                                name="description"
                                value={playlist.description}
                                onChange={handleChange}
                                className="form-control"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image URL:</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={playlist.imageUrl}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Update Playlist
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPlaylist;
