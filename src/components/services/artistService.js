import axios from "axios";

const artistService = {
    getAllArtists: async () => {
        try {
            const response = await axios.get('https://music-application-sb.onrender.com/api/artists');
            return response.data;
        } catch (error) {
            console.error('Error fetching artists', error);
            throw error;
        }
    },

    getArtistById: async (id) => {
        try {
            const response = await axios.get(`https://music-application-sb.onrender.com/api/artists/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching artist with id ${id}`, error);
            throw error;
        }
    },

    createArtist: async (artist) => {
        try {
            const response = await axios.post('https://music-application-sb.onrender.com/api/artists', artist);
            return response.data;
        } catch (error) {
            console.error('Error creating artist', error);
            throw error;
        }
    },

    updateArtist: async (id, artist) => {
        try {
            await axios.put(`https://music-application-sb.onrender.com/api/artists/update/${id}`, artist);
        } catch (error) {
            console.error(`Error updating artist ${id}`, error);
            throw error;
        }
    },
    deleteArtist: async (id) => {
        try {
            await axios.delete(`https://music-application-sb.onrender.com/api/artists/delete/${id}`);
        }catch (error){
            console.error(`Error deleting artist ${id}`,error);
            throw error;
        }
    },
};

export default artistService;
