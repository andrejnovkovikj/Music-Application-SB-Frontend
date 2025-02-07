import React, { useEffect, useState } from "react";
import playlistService from "../../services/playlistService";
import { Link } from "react-router-dom";

const ListPlaylist = ({ isAuthenticated,currentUser }) => {
    const [playlists, setPlaylists] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        playlistService.getAllPlaylists()
            .then(data => setPlaylists(data))
            .catch(error => console.error("Error fetching playlists:", error));


    }, []);

    const filteredPlaylists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-sm mb-4 mt-5" style={{maxWidth: "900px"}}>
            <h1 className="mb-4 text-center">Playlists</h1>
            <div className="d-flex justify-content-center">
                <div className="col-md-4 col-sm-12 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a playlist..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
                <div className="d-flex justify-content-center">
                    <div className="col-md-4 col-sm-12">
                        <ul className="list-group list-group-flush">
                            {filteredPlaylists.length > 0 ? (
                                filteredPlaylists.map(playlist => (
                                    <li key={playlist.id}
                                        className="list-group-item d-flex justify-content-between align-items-center py-2 mb-2 shadow-sm rounded">
                                        <div className="d-flex align-items-center">
                                            <img
                                                className="img-fluid rounded me-3"
                                                src={playlist.imageUrl}
                                                alt={playlist.name}
                                                style={{width: "40px", height: "40px", objectFit: "cover"}}
                                            />
                                            <div className="flex-grow-1"
                                                 style={{textAlign: "center", paddingLeft: "10px"}}>
                                                <Link to={`/playlists/${playlist.id}`}
                                                      className="text-dark text-decoration-none">{playlist.name}</Link>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item text-center">No playlists found</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
    );
};
export default ListPlaylist;
