import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import songService from "../../services/songService";
import albumService from "../../services/albumService";
import artistService from "../../services/artistService";

const CreateSong = ({ username }) => {
    const navigate = useNavigate();


    const [title, setTitle] = useState("");
    const [filePath, setFilePath] = useState("");
    const [lengthSeconds, setLengthSeconds] = useState("");
    const [albumId, setAlbumId] = useState("");
    const [artistId, setArtistId] = useState("");
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [albumsData, artistsData] = await Promise.all([
                    albumService.getAllAlbums(),
                    artistService.getAllArtists(),
                ]);

                setAlbums(albumsData);
                setArtists(artistsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load albums or artists.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !filePath.trim() || !lengthSeconds || !albumId || !artistId) {
            setError("All fields are required.");
            return;
        }

        const newSong = {
            title,
            filePath,
            lengthSeconds: Number(lengthSeconds),
            album: { id: albumId },
            artist: { id: artistId }
        };

        try {
            await songService.createSong(newSong);
            navigate("/songs");
        } catch (error) {
            console.error("Error adding song:", error);
            setError("Failed to create song. Please try again.");
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container-sm mb-4 mt-5" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-4">Create Song</h1>
            </div>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Title:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">File Path (URL):</label>
                            <input
                                type="text"
                                value={filePath}
                                onChange={(e) => setFilePath(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Length (Seconds):</label>
                            <input
                                type="number"
                                min="1"
                                value={lengthSeconds}
                                onChange={(e) => setLengthSeconds(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Album:</label>
                            <select
                                value={albumId}
                                onChange={(e) => setAlbumId(e.target.value)}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select an album</option>
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
                                value={artistId}
                                onChange={(e) => setArtistId(e.target.value)}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select an artist</option>
                                {artists.map((artist) => (
                                    <option key={artist.id} value={artist.id}>
                                        {artist.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Create Song
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSong;
