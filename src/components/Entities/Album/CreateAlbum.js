import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AlbumService from "../../services/albumService";
import artistService from "../../services/artistService";

const CreateAlbum = ({ username }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [dateCreated, setDateCreated] = useState('');
    const [artistId, setArtistId] = useState('');
    const [genre, setGenre] = useState('');
    const [artists, setArtists] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        artistService.getAllArtists()
            .then((data) => setArtists(data))
            .catch((error) => console.error('Error fetching artists: ', error));

    }, [username]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAlbum = { title, dateCreated, artistId, genre, imageUrl };

        AlbumService.createAlbum(newAlbum)
            .then(() => navigate('/albums'))
            .catch(error => console.error('Error adding album: ', error));
    };

    return (
        <div className="container-sm mb-4 mt-5" style={{maxWidth: "900px"}}>

            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-4">Create Album</h1>
            </div>
            <div className="d-flex justify-content-center">
                <div className="col-md-3 col-sm-12">
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
                            <label className="form-label">Image Url:</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date Created:</label>
                            <input
                                type="date"
                                value={dateCreated}
                                onChange={(e) => setDateCreated(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Artist:</label>
                            <select
                                value={artistId}
                                onChange={(e) => setArtistId(e.target.value)}
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
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select genre</option>
                                <option value="HIPHOP">Hip Hop</option>
                                <option value="ROCK">Rock</option>
                                <option value="EDM">EDM</option>
                                <option value="DANCE">Dance</option>
                                <option value="POP">Pop</option>
                                <option value="RNB">R&B</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                                Create Album
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAlbum;
