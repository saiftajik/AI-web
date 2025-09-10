
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import InventoryPage from './components/InventoryPage';
import ReportsPage from './components/ReportsPage';
import AiInsightsPage from './components/AiInsightsPage';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROLES } from './constants';

const App: React.FC = () => {
    return (
        <AppContextProvider>
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={
                            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.CASHIER]}>
                                <DashboardPage />
                            </ProtectedRoute>
                        } />
                        <Route path="inventory" element={
                            <ProtectedRoute roles={[ROLES.ADMIN]}>
                                <InventoryPage />
                            </ProtectedRoute>
                        } />
                        <Route path="reports" element={
                            <ProtectedRoute roles={[ROLES.ADMIN]}>
                                <ReportsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="ai-insights" element={
                            <ProtectedRoute roles={[ROLES.ADMIN]}>
                                <AiInsightsPage />
                            </ProtectedRoute>
                        } />
                    </Route>
                     <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </HashRouter>
        </AppContextProvider>
    );
};

export default App;
