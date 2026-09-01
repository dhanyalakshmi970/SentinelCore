import {
    createContext,
    useContext,
    useState
} from "react";

import { jwtDecode } from "jwt-decode";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {


    // ==========================================
    // Get existing token
    // ==========================================

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );


    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refreshToken")
    );


    // ==========================================
    // Extract roles from JWT
    // ==========================================

    const getRolesFromToken = (token) => {

        if (!token) {
            return [];
        }


        try {

            const decoded = jwtDecode(token);


            console.log(
                "Decoded JWT:",
                decoded
            );


            /*
             * Possible backend formats:
             *
             * roles: ["ROLE_ADMIN"]
             *
             * role: "ROLE_ADMIN"
             *
             * authorities: ["ROLE_ADMIN"]
             */

            let tokenRoles =
                decoded.roles ||
                decoded.role ||
                decoded.authorities ||
                [];


            // Convert single role to array

            if (!Array.isArray(tokenRoles)) {

                tokenRoles = [tokenRoles];

            }


            // Normalize roles

            const normalizedRoles =
                tokenRoles
                    .filter(Boolean)
                    .map(role =>
                        String(role).toUpperCase()
                    );


            console.log(
                "User Roles:",
                normalizedRoles
            );


            return normalizedRoles;

        } catch (error) {

            console.error(
                "JWT Decode Error:",
                error
            );

            return [];

        }

    };


    // ==========================================
    // Initial roles
    // ==========================================

    const [roles, setRoles] = useState(() => {

        const token =
            localStorage.getItem("accessToken");

        return getRolesFromToken(token);

    });


    // ==========================================
    // Login
    // ==========================================

    const loginUser = (
        access,
        refresh
    ) => {


        // Save token in state

        setAccessToken(access);

        setRefreshToken(refresh);


        // Save token in localStorage

        localStorage.setItem(
            "accessToken",
            access
        );

        localStorage.setItem(
            "refreshToken",
            refresh
        );


        // Get roles

        const userRoles =
            getRolesFromToken(access);


        // Save roles

        setRoles(userRoles);


        console.log(
            "Login successful"
        );


        console.log(
            "Roles:",
            userRoles
        );


        console.log(
            "Is Admin:",
            userRoles.includes("ROLE_ADMIN") ||
            userRoles.includes("ADMIN")
        );

    };


    // ==========================================
    // Logout
    // ==========================================

    const logout = () => {

        console.log(
            "Logging out..."
        );


        setAccessToken(null);

        setRefreshToken(null);

        setRoles([]);


        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

    };


    // ==========================================
    // Authentication
    // ==========================================

    const isAuthenticated =
        !!accessToken;


    // ==========================================
    // Admin
    // ==========================================

    const isAdmin =
        roles.includes("ROLE_ADMIN") ||
        roles.includes("ADMIN");


    // ==========================================
    // Viewer
    // ==========================================

    const isViewer =
        roles.includes("ROLE_VIEWER") ||
        roles.includes("VIEWER");


    // ==========================================
    // Context Provider
    // ==========================================

    return (

        <AuthContext.Provider
            value={{

                accessToken,

                refreshToken,

                roles,

                isAuthenticated,

                isAdmin,

                isViewer,

                loginUser,

                logout

            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


// ==========================================
// Custom Hook
// ==========================================

export const useAuth = () =>
    useContext(AuthContext);