import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AppShell from "./layout/AppShell";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import DashboardPage from "./pages/DashboardPage";
import AssetsPage from "./pages/AssetsPage";
import AlertsPage from "./pages/AlertsPage";
import IncidentsPage from "./pages/IncidentsPage";
import VulnerabilitiesPage from "./pages/VulnerabilitiesPage";
import CompliancePage from "./pages/CompliancePage";
import AuditLogsPage from "./pages/AuditLogsPage";
import AddAssetPage from "./pages/AddAssetPage";


export default function App() {

    return (
        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    {/* ============================= */}
                    {/* PUBLIC ROUTES */}
                    {/* ============================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                    />


                    {/* ============================= */}
                    {/* PROTECTED APPLICATION */}
                    {/* ============================= */}

                    <Route
                        element={
                            <ProtectedRoute>
                                <AppShell />
                            </ProtectedRoute>
                        }
                    >

                        {/* Default */}
                        <Route
                            index
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />


                        {/* Dashboard */}
                        <Route
                            path="dashboard"
                            element={<DashboardPage />}
                        />


                        {/* Assets */}
                        <Route
                            path="assets"
                            element={<AssetsPage />}
                        />


                        {/* Alerts */}
                        <Route
                            path="alerts"
                            element={<AlertsPage />}
                        />


                        {/* Incidents */}
                        <Route
                            path="incidents"
                            element={<IncidentsPage />}
                        />


                        {/* Vulnerabilities */}
                        <Route
                            path="vulnerabilities"
                            element={<VulnerabilitiesPage />}
                        />


                        {/* Compliance */}
                        <Route
                            path="compliance"
                            element={<CompliancePage />}
                        />


                        {/* Audit Logs */}
                        <Route
                            path="audit-logs"
                            element={<AuditLogsPage />}
                        />


                        {/* ================================= */}
                        {/* ADMIN ONLY - ADD ASSET */}
                        {/* ================================= */}

                        <Route
                            path="add-asset"
                            element={
                                <AdminRoute>
                                    <AddAssetPage />
                                </AdminRoute>
                            }
                        />

                    </Route>


                    {/* ============================= */}
                    {/* FALLBACK */}
                    {/* ============================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}