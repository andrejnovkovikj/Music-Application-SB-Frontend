import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import playlistService from "../../services/playlistService";

const CreatePlaylist = ({ isAuthenticated, currentUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setError("You must be logged in to create a playlist.");
            return;
        }

        const newPlaylist = {
            ...formData,
            username: currentUser?.username // Attach the logged-in user
        };

        try {
            setLoading(true);
            await playlistService.createPlaylist(newPlaylist);
            navigate("/playlists");
        } catch (error) {
            console.error("Error adding playlist:", error);
            setError("Failed to create playlist. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center text-danger mt-5">
                You must be logged in to create a playlist.
            </div>
        );
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-4">Create Playlist</h1>
            </div>
            <div className="d-flex justify-content-center">
                <div className="col-md-6 col-sm-12">
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
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
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Creating..." : "Create Playlist"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePlaylist;
