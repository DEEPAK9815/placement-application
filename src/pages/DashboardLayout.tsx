
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code, BookOpen, User, BarChart, Loader2, CheckCircle } from 'lucide-react';
import { useProjectStatus } from '../hooks/useProjectStatus';

const ProjectStatusBadge = () => {
    const { status } = useProjectStatus();

    return (
        <div className={`mx-4 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center justify-between border ${status === 'Shipped'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
            }`}>
            <span>{status}</span>
            {status === 'Shipped'
                ? <CheckCircle className="w-3.5 h-3.5" />
                : <Loader2 className="w-3.5 h-3.5 animate-spin-slow" />
            }
        </div>
    );
};

const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${isActive
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span>{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
        </Link>
    );
};

export const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
                        <span className="font-serif font-bold text-lg text-gray-900">Placement Prep</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</div>
                    <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarLink to="/dashboard/practice" icon={Code} label="Practice" />
                    <SidebarLink to="/dashboard/assessments" icon={BarChart} label="Assessments" />
                    <SidebarLink to="/dashboard/resources" icon={BookOpen} label="Resources" />
                    <SidebarLink to="/dashboard/profile" icon={User} label="Profile" />

                    <div className="mt-8 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Career Tools</div>
                    <SidebarLink to="/resume-builder" icon={BookOpen} label="Resume Builder" />
                    <SidebarLink to="/job-tracker" icon={LayoutDashboard} label="Job Tracker" />

                    <div className="mt-8 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Release</div>
                    <SidebarLink to="/prp/07-test" icon={Code} label="Test Checklist" />
                    <SidebarLink to="/prp/08-ship" icon={BarChart} label="Ship Project" />
                    <SidebarLink to="/prp/proof" icon={BookOpen} label="Proof of Work" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <ProjectStatusBadge />
                    <div className="flex items-center space-x-3 px-4 py-2 mt-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">JD</div>
                        <div className="text-sm">
                            <div className="font-medium text-gray-900">John Doe</div>
                            <div className="text-gray-500 text-xs">Student</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header (visible on small screens) */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 md:hidden justify-between">
                    <span className="font-serif font-bold text-lg">Placement Prep</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium">JD</div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
