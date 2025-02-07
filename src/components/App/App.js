import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Entities/Navbar/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";

import Home from '../Home/Home';
import LoginPage from '../Login/LoginPage';
import ListAlbum from '../Entities/Album/ListAlbum';
import EditAlbum from '../Entities/Album/EditAlbum';
import CreateAlbum from '../Entities/Album/CreateAlbum';
import DetailsAlbum from '../Entities/Album/DetailsAlbum';
import ListArtist from '../Entities/Artist/ListArtist';
import CreateArtist from '../Entities/Artist/CreateArtist';
import EditArtist from '../Entities/Artist/EditArtist';
import DetailsArtist from '../Entities/Artist/DetailsArtist';
import CreatePlaylist from '../Entities/Playlist/CreatePlaylist';
import ListPlaylist from '../Entities/Playlist/ListPlaylist';
import DetailsPlaylist from '../Entities/Playlist/DetailsPlaylist';
import EditPlaylist from '../Entities/Playlist/EditPlaylist';
import CreateSong from '../Entities/Song/CreateSong';
import ListSong from '../Entities/Song/ListSong';
import DetailsSong from '../Entities/Song/DetailsSong';
import EditSong from '../Entities/Song/EditSong';
import CreateUser from '../Entities/User/CreateUser';
import ListUser from '../Entities/User/ListUser';
import DetailsUser from '../Entities/User/DetailsUser';
import EditUser from '../Entities/User/EditUser';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        axios.get("https://music-application-sb.onrender.com/api/users/authenticated", { withCredentials: true })
            .then(response => {
                setIsAuthenticated(response.data);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setCurrentUser(null);
            });
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            axios.get("https://music-application-sb.onrender.com/api/users/current-user", { withCredentials: true })
                .then(response => {
                    setCurrentUser(response.data);
                })
                .catch(error => {
                    console.error("Error fetching current user:", error);
                    setCurrentUser(null);
                });
        } else {
            setCurrentUser(null);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        axios.post("https://music-application-sb.onrender.com/logout", {}, { withCredentials: true })
            .then(() => {
                setIsAuthenticated(false);
                setCurrentUser(null);
                window.location.href = "/";
            })
            .catch(error => {
                console.error("Logout error:", error);
            });
    };

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} currentUser={currentUser} handleLogout={handleLogout} />

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Home />} />

                <Route path="/albums" element={<ListAlbum isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/albums/edit/:id" element={<EditAlbum isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/albums/create" element={<CreateAlbum isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/albums/:id" element={<DetailsAlbum isAuthenticated={isAuthenticated} currentUser={currentUser} />} />

                <Route path="/artists" element={<ListArtist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/artists/edit/:id" element={<EditArtist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/artists/create" element={<CreateArtist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/artists/:id" element={<DetailsArtist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />

                <Route path="/playlists/create" element={<CreatePlaylist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/playlists" element={<ListPlaylist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/playlists/:id" element={<DetailsPlaylist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/playlists/edit/:id" element={<EditPlaylist isAuthenticated={isAuthenticated} currentUser={currentUser} />} />

                <Route path="/songs/create" element={<CreateSong isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/songs" element={<ListSong isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/songs/:id" element={<DetailsSong isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/songs/edit/:id" element={<EditSong isAuthenticated={isAuthenticated} currentUser={currentUser} />} />

                <Route path="/users/create" element={<CreateUser isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/users" element={<ListUser isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/users/:id" element={<DetailsUser isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/users/edit/:id" element={<EditUser isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
            </Routes>
        </Router>
    );
}

export default App;
