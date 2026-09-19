import Assets from "./components/Assets";
import OpenAlerts from "./components/OpenAlerts";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import Dashboard from "./components/Dashboard";
import AddAsset from "./components/AddAsset";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                {/* DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ASSETS PAGE */}
                <Route
                    path="/assets"
                    element={
                        <ProtectedRoute>
                            <Assets />
                        </ProtectedRoute>
                    }
                />

                {/* OPEN ALERTS PAGE */}
                <Route
                    path="/alerts"
                    element={
                        <ProtectedRoute>
                            <OpenAlerts />
                        </ProtectedRoute>
                    }
                />

                {/* ADD ASSET */}
                <Route
                    path="/add-asset"
                    element={
                        <ProtectedRoute>
                            <AddAsset />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;