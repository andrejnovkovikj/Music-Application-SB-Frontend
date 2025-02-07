import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get("https://music-application-sb.onrender.com/api/users/current-user", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking login status:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, checkLoginStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
