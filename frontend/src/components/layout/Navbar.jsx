import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNotifications } from '../../api/notifications'
import {
  Bell, Briefcase, User, LogOut, Menu, X, ChevronDown,
  LayoutDashboard, Search, FileText, Home
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (user) {
      getNotifications()
        .then((res) => setUnread(res.data.unreadCount))
        .catch(() => {})
    }
  }, [user, location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/jobs', icon: <Search size={16} />, label: 'Find Jobs' },
    { to: '/applications', icon: <FileText size={16} />, label: 'Applications' },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/admin/jobs', icon: <Briefcase size={16} />, label: 'Manage Jobs' },
    { to: '/admin/applicants', icon: <User size={16} />, label: 'Applicants' },
  ]

  const links = user?.role === 'admin' ? adminLinks : userLinks

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">JobPortal</span>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === link.to
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                {user.role !== 'admin' && (
                  <Link to="/notifications" className="relative p-2 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white">
                    <Bell size={20} />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 glass rounded-xl px-3 py-2 hover:bg-white/5 transition-all"
                  >
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 gradient-bg rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-200 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-48 glass-dark rounded-2xl border border-white/10 shadow-2xl z-50 py-2 animate-fade-in">
                      {user.role !== 'admin' && (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <User size={14} /> My Profile
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/" className="btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            {user && (
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {user && menuOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
