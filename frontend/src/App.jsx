import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'

// Pages
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/user/Dashboard'
import JobList from './pages/user/JobList'
import JobDetail from './pages/user/JobDetail'
import Applications from './pages/user/Applications'
import Notifications from './pages/user/Notifications'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageJobs from './pages/admin/ManageJobs'
import Applicants from './pages/admin/Applicants'
import Schedule from './pages/admin/Schedule'

// Route Guards
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
  return children
}

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
  return children
}

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
        <Route path="/admin/login" element={<PublicOnly><AdminLogin /></PublicOnly>} />

        {/* Browse jobs (public, but apply requires auth) */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* User Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute role="user"><Applications /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute role="user"><Notifications /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute role="admin"><ManageJobs /></ProtectedRoute>} />
        <Route path="/admin/applicants" element={<ProtectedRoute role="admin"><Applicants /></ProtectedRoute>} />
        <Route path="/admin/schedule" element={<ProtectedRoute role="admin"><Schedule /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
            <p className="text-gray-400 mb-6">Page not found</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
