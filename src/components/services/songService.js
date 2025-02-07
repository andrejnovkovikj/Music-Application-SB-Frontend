import axios from 'axios';

const songService = {
    getAllSongs: async () => {
        try {
            const response = await axios.get('https://music-application-sb.onrender.com/api/songs');
            return response.data;
        } catch (error) {
            console.error('Error fetching songs', error);
            throw error;
        }
    },

    getSongById: async (id) => {
        try {
            const response = await axios.get(`https://music-application-sb.onrender.com/api/songs/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching song with id ${id}`, error);
            throw error;
        }
    },

    createSong: async (song) => {
        try {
            const response = await axios.post('https://music-application-sb.onrender.com/api/songs', song);
            return response.data;
        } catch (error) {
            console.error('Error creating song', error);
            throw error;
        }
    },

    updateSong: async (id, song) => {
        try {
            const response = await axios.put(`https://music-application-sb.onrender.com/api/songs/${id}`, song);
            return response.data;
        } catch (error) {
            console.error(`Error updating song ${id}`, error);
            throw error;
        }
    },

    deleteSong: async (id) => {
        try {
            await axios.delete(`https://music-application-sb.onrender.com/api/songs/delete/${id}`);
        } catch (error) {
            console.error(`Error deleting song ${id}`, error);
            throw error;
        }
    },

    likeSong: async (songId) => {
        try {
            const response = await axios.post(`https://music-application-sb.onrender.com/api/songs/${songId}/like`);
            return response.data;
        } catch (error) {
            console.error(`Error liking album ${songId}`, error);
            throw error;
        }
    },

    unlikeSong: async (songId) => {
        try {
            const response = await axios.post(`https://music-application-sb.onrender.com/api/songs/${songId}/unlike`);
            return response.data;
        } catch (error) {
            console.error(`Error unliking album ${songId}`, error);
            throw error;
        }
    },

    getLikedSongsByUserId: async (userId) => {
        try {
            const response = await axios.get(`https://music-application-sb.onrender.com/api/users/${userId}/liked-songs`, {
                withCredentials: true // Include credentials (like JWT) if necessary
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching liked songs for user ${userId}`, error);
            throw error;
        }
    }

};
export default songService;
