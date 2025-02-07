import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import albumService from "../services/albumService";
import artistService from "../services/artistService";
import playlistService from "../services/playlistService";
import songService from "../services/songService";
import userService from "../services/userService";
import axios from "axios";

const Home = () => {
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const albumsData = await albumService.getAllAlbums();
                setAlbums(albumsData.sort(() => Math.random() - 0.5).slice(0, 5));

                const artistsData = await artistService.getAllArtists();
                setArtists(artistsData.sort(() => Math.random() - 0.5).slice(0, 5));

                const playlistsData = await playlistService.getAllPlaylists();
                setPlaylists(playlistsData.sort(() => Math.random() - 0.5).slice(0, 5));

                const songsData = await songService.getAllSongs();
                setSongs(songsData.sort(() => Math.random() - 0.5).slice(0, 5));

                const usersData = await userService.getAllUsers();
                setUsers(usersData.sort(() => Math.random() - 0.5).slice(0, 5));

                const currentUser = await axios.get('https://music-application-sb.onrender.com/api/users/current-user', { withCredentials: true });
                setUser(currentUser.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mb-4 mt-5" style={{ maxWidth: "885px" }}>
            <h1 className="text-center">Welcome to the Music App</h1>
            <p className="text-center">Explore recent content:</p>

            {user ? (
                <h2 className="text-center">Hello, {user.username}!</h2>
            ) : (
                <h2 className="text-center">Hello, Guest!</h2>
            )}

            <h1 className="mb-4 text-center">Songs</h1>
            <div className="d-flex justify-content-center">
                <div className="col-md-6 col-sm-12">
                    <ul className="list-group list-group-flush">
                        {songs.length > 0 ? (
                            songs.map((song) => (
                                <li
                                    key={song.id}
                                    className="list-group-item d-flex justify-content-between align-items-center py-2 mb-2 shadow-sm rounded"
                                >
                                    <div className="d-flex align-items-center">
                                        <img
                                            className="img-fluid rounded me-3"
                                            src={song.album.imageUrl}
                                            alt={song.title}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div
                                            className="flex-grow-1"
                                            style={{ textAlign: "center", paddingLeft: "10px" }}
                                        >
                                            <Link
                                                to={`/songs/${song.id}`}
                                                className="text-dark text-decoration-none"
                                            >
                                                {song.title}
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-center">No songs available</li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="mb-5">
                <h3 className="text-center">Albums</h3>
                {albums.length > 0 ? (
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        {albums.map((album) => (
                            <Link key={album.id} to={`/albums/${album.id}`} className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center">
                                    <img
                                        className="img-fluid rounded"
                                        src={album.imageUrl}
                                        alt={album.title}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                    <h6 className="mt-2 text-center text-dark">{album.title}</h6>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <h6 className="text-center">No albums available!</h6>
                )}
            </div>

            <div className="mb-5">
                <h3 className="text-center">Artists</h3>
                {artists.length > 0 ? (
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        {artists.map((artist) => (
                            <Link key={artist.id} to={`/artists/${artist.id}`} className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center" style={{ maxWidth: "120px" }}>
                                    <img
                                        className="img-fluid rounded-circle"
                                        src={artist.imageUrl}
                                        alt={artist.name}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                    <h6 className="mt-2 text-center text-dark">{artist.name}</h6>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <h6 className="text-center">No artists available</h6>
                )}
            </div>

            <div className="mb-5">
                <h3 className="text-center">Playlists</h3>
                {playlists.length > 0 ? (
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        {playlists.map((playlist) => (
                            <Link key={playlist.id} to={`/playlists/${playlist.id}`} className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center" style={{ maxWidth: "120px" }}>
                                    <img
                                        className="img-fluid rounded"
                                        src={playlist.imageUrl}
                                        alt={playlist.name}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                    <h6 className="text-dark text-decoration-none">{playlist.name}</h6>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <h6 className="text-center">No playlists available</h6>
                )}
            </div>
        </div>
    );
};

export default Home;
