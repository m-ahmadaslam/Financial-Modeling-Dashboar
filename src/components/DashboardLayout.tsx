"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { 
  ChevronDownIcon, 
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  FolderIcon,
  PlusIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import NotificationBell from './NotificationBell';
import ScreenshotCapture from './ScreenshotCapture';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  // Listen for reopen screenshot modal event
  useEffect(() => {
    const handleReopenModal = () => {
      setShowScreenshot(true);
    };

    window.addEventListener('reopenScreenshotModal', handleReopenModal);
    return () => {
      window.removeEventListener('reopenScreenshotModal', handleReopenModal);
    };
  }, []);
  const [usersExpanded, setUsersExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gray-800 h-1"></div>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            
            {/* Bigger Alfanar Logo */}
            <div className="flex items-center ml-4 lg:ml-0">
              <Image
                src="/alflogo.png"
                alt="Alfanar Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Screenshot Button */}
            <button
              onClick={() => setShowScreenshot(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Take Screenshot"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Notification Bell */}
            <NotificationBell userId="superadmin" />

            <span className="text-gray-600 text-sm hidden sm:block">
              Welcome, superadmin
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-gray-600 hover:text-blue-400 text-sm transition-colors flex items-center"
            >
              Logout
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Collapsible Sidebar */}
        <div 
          className={`
            fixed inset-y-0 left-0 z-50 bg-black shadow-2xl transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-y-0
            ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
            ${sidebarExpanded ? 'lg:w-64' : 'lg:w-16'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
              <div className="flex items-center">
                {/* Three-line hamburger for desktop (toggle expand) */}
                <button
                  type="button"
                  aria-label="Toggle sidebar"
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className="hidden lg:flex w-6 h-6 flex-col justify-center items-center space-y-1 cursor-pointer"
                >
                  <div className="w-4 h-0.5 bg-white rounded-full"></div>
                  <div className="w-4 h-0.5 bg-white rounded-full"></div>
                  <div className="w-4 h-0.5 bg-white rounded-full"></div>
                </button>
              </div>
              
              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Sidebar Content */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 group/item"
              >
                <HomeIcon className="w-5 h-5 flex-shrink-0" />
                <span className={`
                  ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap
                  ${sidebarExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                `}>
                  Dashboard
                </span>
              </Link>

              {/* Charts */}
              <Link
                href="/dashboard/charts"
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 group/item"
              >
                <ChartBarIcon className="w-5 h-5 flex-shrink-0" />
                <span className={`
                  ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap
                  ${sidebarExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                `}>
                  Charts
                </span>
              </Link>

              {/* Assumptions */}
              <Link
                href="/dashboard/assumptions"
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 group/item"
              >
                <DocumentTextIcon className="w-5 h-5 flex-shrink-0" />
                <span className={`
                  ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap
                  ${sidebarExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                `}>
                  Assumptions
                </span>
              </Link>

              {/* Projects Section */}
              <div className="pt-4">
                <button
                  onClick={() => setProjectsExpanded(!projectsExpanded)}
                  className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 group/item"
                >
                  <div className="flex items-center">
                    <FolderIcon className="w-5 h-5 flex-shrink-0" />
                    <span className={`
                      ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap
                      ${sidebarExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                    `}>
                      Projects
                    </span>
                  </div>
                  {sidebarExpanded && (
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${projectsExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {projectsExpanded && sidebarExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    <Link
                      href="/dashboard/new-project"
                      className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <PlusIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3">New Project</span>
                    </Link>
                    <Link
                      href="/dashboard/projects"
                      className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <FolderIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3">All Projects</span>
                    </Link>
                    <Link
                      href="/dashboard/timelines"
                      className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <ChartBarIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3">Timelines</span>
                    </Link>
                    <Link
                      href="/dashboard/departments"
                      className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3">Departments</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Users Section */}
              <div className="pt-4">
                <button
                  onClick={() => setUsersExpanded(!usersExpanded)}
                  className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 group/item"
                >
                  <div className="flex items-center">
                    <UserGroupIcon className="w-5 h-5 flex-shrink-0" />
                    <span className={`
                      ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap
                      ${sidebarExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                    `}>
                      Users
                    </span>
                  </div>
                  {sidebarExpanded && (
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${usersExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {usersExpanded && sidebarExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    <Link
                      href="/dashboard/manage-users"
                      className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3">Manage Users</span>
                    </Link>
                    <Link
                      href="/dashboard/manage-authorization"
                      className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <CogIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3">Manage Authorization</span>
                    </Link>
                  </div>
                )}
              </div>

            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-700">
              <div className={`
                flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg
                ${sidebarExpanded ? 'justify-start' : 'justify-center'}
              `}>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className={`
                  ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap
                  ${sidebarExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                `}>
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Screenshot Capture Modal */}
      <ScreenshotCapture
        isOpen={showScreenshot}
        onClose={() => setShowScreenshot(false)}
        onScreenshotTaken={(screenshot: string, annotations?: string) => {
          // Store screenshot data in localStorage for now
          localStorage.setItem('pendingScreenshot', JSON.stringify({ screenshot, annotations }));
          setShowScreenshot(false);
        }}
      />
    </div>
  );
}
