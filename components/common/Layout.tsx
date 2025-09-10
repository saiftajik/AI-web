
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ICONS, ROLES } from '../../constants';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
    const baseClasses = "flex items-center px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all duration-200 rounded-lg";
    const activeClasses = "bg-violet-600/20 text-white shadow-inner";

    return (
        <NavLink to={to} className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}>
            <span className="mr-4">{icon}</span>
            <span className="font-medium">{label}</span>
        </NavLink>
    );
};

const Sidebar: React.FC = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-dark-card border-r border-dark-border flex flex-col p-4">
            <div className="text-2xl font-bold text-center py-4 mb-8 text-white tracking-widest">
                SAIF <span className="text-violet-400">CAFE</span>
            </div>
            <nav className="flex-grow space-y-2">
                <NavItem to="/dashboard" icon={<ICONS.Dashboard className="w-6 h-6" />} label="Dashboard" />
                {user?.role === ROLES.ADMIN && (
                    <>
                        <NavItem to="/inventory" icon={<ICONS.Inventory className="w-6 h-6" />} label="Inventory" />
                        <NavItem to="/reports" icon={<ICONS.Reports className="w-6 h-6" />} label="Reports" />
                        <NavItem to="/ai-insights" icon={<ICONS.Ai className="w-6 h-6" />} label="AI Insights" />
                    </>
                )}
            </nav>
            <div className="mt-auto">
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 rounded-lg">
                    <ICONS.Logout className="w-6 h-6 mr-4" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};


const Layout: React.FC = () => {
    return (
        <div className="flex h-screen bg-dark-bg text-gray-200">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
