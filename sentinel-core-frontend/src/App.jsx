import { useState } from "react";

import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";


function AppContent() {

    const [loggedIn, setLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setLoggedIn(true);
    };

    return loggedIn ? (
        <Dashboard />
    ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
    );
}


function App() {

    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}


export default App;