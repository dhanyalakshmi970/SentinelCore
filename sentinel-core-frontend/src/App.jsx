import { useAuth } from "./context/AuthContext";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";


function App() {

    const {
        isAuthenticated
    } = useAuth();


    if (!isAuthenticated) {

        return <Login />;

    }


    return <Dashboard />;

}


export default App;