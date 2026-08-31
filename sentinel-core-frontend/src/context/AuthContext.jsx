import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [roles, setRoles] = useState([]);

    // Called after successful login
    const loginUser = (access, refresh) => {
        setAccessToken(access);
        setRefreshToken(refresh);

        // Decode access token to get user roles
        const decoded = jwtDecode(access);

        setRoles(decoded.roles || []);
    };

    // Logout user
    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setRoles([]);
    };

    // Check whether the logged-in user is an admin
    const isAdmin = roles.includes("ROLE_ADMIN");

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                roles,
                isAdmin,
                loginUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);