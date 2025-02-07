import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import artistService from "../../services/artistService";
import axios from "axios";

const EditArtist = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState({
        name: "",
        bio: "",
        imageUrl: "",
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const data = await artistService.getArtistById(id);
                setArtist(data);
            } catch (error) {
                console.error("Error fetching artist: ", error);
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

        fetchArtistData();
        checkAdminStatus();
    }, [id, isAuthenticated, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArtist((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await artistService.updateArtist(id, artist);
            navigate(`/artists`);
        } catch (error) {
            console.error("Error updating artist: ", error);
            alert("Failed to update artist");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        return <div className="text-center text-danger mt-5">You do not have permission to edit an artist.</div>;
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-4">Edit Artist</h1>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-3 col-sm-12">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={artist.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={artist.imageUrl}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Bio</label>
                            <textarea
                                name="bio"
                                value={artist.bio}
                                onChange={handleChange}
                                className="form-control"
                                required
                            ></textarea>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Update Artist
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditArtist;
