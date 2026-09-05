import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem("accessToken")
    );

    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem("refreshToken")
    );

    const [roles, setRoles] = useState([]);

    // ==========================================
    // Decode JWT
    // ==========================================

    const updateRoles = (token) => {

        if (!token) {
            setRoles([]);
            return;
        }

        try {

            const decoded = jwtDecode(token);

            setRoles(decoded.roles || []);

        } catch (error) {

            console.error(
                "Unable to decode access token",
                error
            );

            setRoles([]);
        }
    };


    // ==========================================
    // Restore authentication after refresh
    // ==========================================

    useEffect(() => {

        const storedAccessToken =
            localStorage.getItem("accessToken");

        if (storedAccessToken) {
            updateRoles(storedAccessToken);
        }

    }, []);


    // ==========================================
    // Login
    // ==========================================

    const loginUser = (access, refresh) => {

        // React state
        setAccessToken(access);
        setRefreshToken(refresh);

        // Local storage
        localStorage.setItem(
            "accessToken",
            access
        );

        if (refresh) {

            localStorage.setItem(
                "refreshToken",
                refresh
            );

        }

        updateRoles(access);
    };


    // ==========================================
    // Logout
    // ==========================================

    const logout = () => {

        setAccessToken(null);
        setRefreshToken(null);
        setRoles([]);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };


    // ==========================================
    // Authentication status
    // ==========================================

    const isAuthenticated =
        Boolean(accessToken);


    const isAdmin =
        roles.includes("ROLE_ADMIN");


    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                roles,
                isAuthenticated,
                isAdmin,
                loginUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


// ==========================================
// useAuth
// ==========================================

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }

    return context;
}