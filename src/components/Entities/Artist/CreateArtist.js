import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import artistService from "../../services/artistService"; //

const CreateArtist = ({ username }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [imageUrl,setImageUrl]=useState("");
    const [isAdmin, setIsAdmin] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newArtist = { name, bio, imageUrl };

        try {
            await artistService.createArtist(newArtist);
            navigate("/artists");
        } catch (error) {
            console.error("Error adding artist: ", error);
        }
    };


    return (
        <div className="container-sm mb-4 mt-5" style={{maxWidth: "900px"}}>
            <div className="d-flex justify-content-center">
                <h1 className="mt-4 mb-4">Create Artist</h1>
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-md-3 col-sm-12">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                            <label className="form-label">Bio:</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="form-control"
                                required
                            ></textarea>
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

export default CreateArtist;
