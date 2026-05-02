import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../api/jobs'
import { getAllApplications } from '../../api/applications'
import { getAllUsers } from '../../api/user'
import { Briefcase, Users, FileText, TrendingUp, Plus, ArrowRight, BarChart2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} className="card hover:glow group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center glass group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  </Link>
)

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ jobs: 0, applications: 0, users: 0, accepted: 0 })
  const [recentApps, setRecentApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getJobs({ limit: 100 }), getAllApplications(), getAllUsers()])
      .then(([jobsRes, appsRes, usersRes]) => {
        const apps = appsRes.data.applications
        setStats({
          jobs: jobsRes.data.pagination?.total || 0,
          applications: apps.length,
          users: usersRes.data.users.length,
          accepted: apps.filter((a) => a.status === 'accepted').length,
        })
        setRecentApps(apps.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statusBadge = {
    applied: 'badge-applied', under_review: 'badge-under_review',
    accepted: 'badge-accepted', rejected: 'badge-rejected',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-sub">Welcome back, {user?.name} 👋</p>
        </div>
        <Link to="/admin/jobs" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={16} /> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<Briefcase size={22} className="text-blue-400" />} label="Active Jobs" value={loading ? '…' : stats.jobs} color="text-blue-400" to="/admin/jobs" />
        <StatCard icon={<FileText size={22} className="text-yellow-400" />} label="Applications" value={loading ? '…' : stats.applications} color="text-yellow-400" to="/admin/applicants" />
        <StatCard icon={<Users size={22} className="text-purple-400" />} label="Candidates" value={loading ? '…' : stats.users} color="text-purple-400" to="/admin/applicants" />
        <StatCard icon={<TrendingUp size={22} className="text-green-400" />} label="Accepted" value={loading ? '…' : stats.accepted} color="text-green-400" to="/admin/applicants" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { to: '/admin/jobs', icon: <Plus size={20} />, title: 'Post New Job', desc: 'Create a job or internship listing', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { to: '/admin/applicants', icon: <Users size={20} />, title: 'Review Applicants', desc: 'Accept, reject or schedule interviews', color: 'text-green-400', bg: 'bg-green-500/10' },
          { to: '/admin/schedule', icon: <BarChart2 size={20} />, title: 'Schedule Interviews', desc: 'Send meeting links to candidates', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((action) => (
          <Link key={action.to} to={action.to} className="card hover:glow group flex items-center gap-4">
            <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center flex-shrink-0 ${action.color} group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <div>
              <div className="font-bold text-white">{action.title}</div>
              <div className="text-gray-500 text-sm">{action.desc}</div>
            </div>
            <ArrowRight size={16} className="text-gray-600 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Recent Applications</h2>
          <Link to="/admin/applicants" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {recentApps.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No applications yet</p>
        ) : (
          <div className="space-y-3">
            {recentApps.map((app) => (
              <div key={app._id} className="flex items-center justify-between glass rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center text-sm font-bold text-white">
                    {app.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{app.userId?.name || 'Unknown'}</div>
                    <div className="text-gray-500 text-xs">{app.jobId?.title || 'Job'}</div>
                  </div>
                </div>
                <span className={statusBadge[app.status]}>{app.status?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
