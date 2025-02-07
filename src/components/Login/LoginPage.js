import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.location.href = "https://music-application-sb.onrender.com/login";
    }, []);

    return (
        <div className="container-sm d-flex justify-content-center align-items-center mt-5">
            <div className="text-center">
                <h2>Redirecting to Login...</h2>
                <p>If you are not redirected, please <a href="https://music-application-sb.onrender.com/login">click here</a>.</p>
            </div>
        </div>
    );
};

export default LoginPage;
