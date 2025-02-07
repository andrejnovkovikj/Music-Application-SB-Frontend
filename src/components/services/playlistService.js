import axios from 'axios';

const playlistService = {
    getAllPlaylists: async () => {
        try {
            const response = await axios.get('https://music-application-sb.onrender.com/api/playlists');
            return response.data;
        } catch (error) {
            console.error('Error fetching playlists', error);
            throw error;
        }
    },

    getPlaylistById: async (id) => {
        try {
            const response = await axios.get(`https://music-application-sb.onrender.com/api/playlists/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching playlist with id ${id}`, error);
            throw error;
        }
    },

    createPlaylist: async (playlist) => {
        try {
            const response = await axios.post('https://music-application-sb.onrender.com/api/playlists', playlist);
            return response.data;
        } catch (error) {
            console.error('Error creating playlist', error);
            throw error;
        }
    },

    updatePlaylist: async (id, playlist) => {
        try {
            const response = await axios.put(`https://music-application-sb.onrender.com/api/playlists/${id}`, playlist);
            return response.data;
        } catch (error) {
            console.error(`Error updating playlist ${id}`, error);
            throw error;
        }
    },

    deletePlaylist: async (id) => {
        try {
            await axios.delete(`https://music-application-sb.onrender.com/api/playlists/${id}`);
        } catch (error) {
            console.error(`Error deleting playlist ${id}`, error);
            throw error;
        }
    },
    getPlaylistsByUserId: async (userId) => {
        try {
            const response = await axios.get(`https://music-application-sb.onrender.com/api/users/${userId}/playlists`, {
                withCredentials: true // Include credentials (like JWT) if necessary
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching playlists for user ${userId}`, error);
            throw error;
        }
    },

    addSongToPlaylist: async (playlistId, songId) => {
        try {
            await axios.post(
                `https://music-application-sb.onrender.com/api/playlists/${playlistId}/${songId}/add-song-to-playlist`,
                {},
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error adding song to playlist:", error);
            throw error;
        }
    },

    removeSongFromPlaylist: async (playlistId, songId) => {
        try {
            await axios.delete(
                `https://music-application-sb.onrender.com/api/playlists/${playlistId}/${songId}/remove-song-from-playlist`,
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error removing song from playlist:", error);
            throw error;
        }
    }

};

export default playlistService;
