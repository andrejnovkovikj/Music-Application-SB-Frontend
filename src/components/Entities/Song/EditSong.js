import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import songService from "../../services/songService";
import albumService from "../../services/albumService";
import artistService from "../../services/artistService";
import axios from "axios";

const EditSong = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [song, setSong] = useState({
        title: "",
        filePath: "",
        lengthSeconds: "",
        albumId: "",
        artistId: "",
    });

    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const data = await songService.getSongById(id);
                setSong({
                    title: data.title,
                    filePath: data.filePath,
                    lengthSeconds: data.lengthSeconds,
                    albumId: data.album.id,
                    artistId: data.artist.id,
                });
            } catch (error) {
                console.error("Error fetching song: ", error);
            }
        };

        const fetchDropdownData = async () => {
            try {
                const albumsData = await albumService.getAllAlbums();
                setAlbums(albumsData);

                const artistsData = await artistService.getAllArtists();
                setArtists(artistsData);
            } catch (error) {
                console.error("Error fetching dropdown data: ", error);
            }
        };

        const checkAdminStatus = async () => {
            if (!isAuthenticated || !currentUser) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `https://music-application-sb.onrender.com/api/users/current-user-role/${currentUser.username}`,
                    { withCredentials: true }
                );
                setIsAdmin(response.data);
            } catch (error) {
                console.error("Error checking role:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongData();
        fetchDropdownData();
        checkAdminStatus();
    }, [id, isAuthenticated, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSong((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedSong = {
            title: song.title,
            filePath: song.filePath,
            lengthSeconds: song.lengthSeconds,
            album: { id: song.albumId },
            artist: { id: song.artistId },
        };

        try {
            await songService.updateSong(id, updatedSong);
            navigate("/songs");
        } catch (error) {
            console.error("Error updating song: ", error);
            alert("Failed to update song");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        return <div className="text-center text-danger mt-5">You do not have permission to edit a song.</div>;
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-4">Edit Song</h1>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-3 col-sm-12">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={song.title}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">File Path:</label>
                            <input
                                type="text"
                                name="filePath"
                                value={song.filePath}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Length (Seconds):</label>
                            <input
                                type="number"
                                name="lengthSeconds"
                                value={song.lengthSeconds}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Album:</label>
                            <select
                                name="albumId"
                                value={song.albumId}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select album</option>
                                {albums.map((album) => (
                                    <option key={album.id} value={album.id}>
                                        {album.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Artist:</label>
                            <select
                                name="artistId"
                                value={song.artistId}
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
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Update Song
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSong;
