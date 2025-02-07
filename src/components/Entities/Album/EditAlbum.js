import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import albumService from "../../services/albumService";
import artistService from "../../services/artistService";
import axios from "axios";

const EditAlbum = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [album, setAlbum] = useState({
        title: "",
        dateCreated: "",
        artistId: "",
        genre: "",
        imageUrl: ""
    });

    const [artists, setArtists] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !currentUser) {
            setLoading(false);
            return;
        }

        albumService.getAlbumsById(id)
            .then((data) => {
                setAlbum({
                    title: data.title,
                    dateCreated: data.dateCreated,
                    artistId: data.artist.id,
                    genre: data.genre,
                    imageUrl: data.imageUrl
                });
            })
            .catch((error) => console.error("Error fetching album: ", error));

        artistService.getAllArtists()
            .then((data) => setArtists(data))
            .catch((error) => console.error("Error fetching artists: ", error));

        // Check if user is admin
        axios.get(`https://music-application-sb.onrender.com/api/users/current-user-role/${currentUser.username}`,
            { withCredentials: true })
            .then((response) => {
                setIsAdmin(response.data);
            })
            .catch((error) => console.error("Error checking role:", error))
            .finally(() => setLoading(false));

    }, [id, isAuthenticated, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlbum((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedAlbum = {
            title: album.title,
            dateCreated: album.dateCreated,
            artist: { id: album.artistId },
            genre: album.genre,
            imageUrl: album.imageUrl
        };

        albumService.updateAlbum(id, updatedAlbum)
            .then(() => navigate("/albums"))
            .catch((error) => {
                console.error("Error updating album: ", error);
                alert("Failed to update album");
            });
    };


    if (!isAdmin) {
        return <div>You do not have permission to edit this album.</div>;
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-6">Edit Album</h1>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-3 col-sm-12">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={album.title}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image Url:</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={album.imageUrl}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date Created:</label>
                            <input
                                type="date"
                                name="dateCreated"
                                value={album.dateCreated}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Artist:</label>
                            <select
                                name="artistId"
                                value={album.artistId}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select artist</option>
                                {artists.map((artist) => (
                                    <option key={artist.id} value={artist.id}>
                                        {artist.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Genre:</label>
                            <select
                                name="genre"
                                value={album.genre}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select genre</option>
                                <option value="HIPHOP">Hip-Hop</option>
                                <option value="ROCK">Rock</option>
                                <option value="EDM">EDM</option>
                                <option value="DANCE">Dance</option>
                                <option value="POP">Pop</option>
                                <option value="RNB">R&B</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Update Album
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAlbum;
