import { useState, useEffect } from 'react'
import { getUserApplications } from '../../api/applications'
import { Link } from 'react-router-dom'
import { FileText, MapPin, DollarSign, Clock, ExternalLink, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const statusConfig = {
  applied: { label: 'Applied', cls: 'badge-applied', step: 1 },
  under_review: { label: 'Under Review', cls: 'badge-under_review', step: 2 },
  accepted: { label: 'Accepted 🎉', cls: 'badge-accepted', step: 4 },
  rejected: { label: 'Not Selected', cls: 'badge-rejected', step: 4 },
}

const StatusBar = ({ status }) => {
  const current = statusConfig[status]?.step || 1
  const isRejected = status === 'rejected'
  return (
    <div className="flex gap-1 mt-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
          i <= current
            ? isRejected && i === current ? 'bg-red-500' : 'bg-primary-500'
            : 'bg-dark-500'
        }`} />
      ))}
    </div>
  )
}

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getUserApplications()
      .then((res) => setApplications(res.data.applications))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter)
  const counts = applications.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc }, {})

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">My Applications</h1>
        <p className="section-sub">{applications.length} total applications submitted</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { key: 'all', label: 'Total', count: applications.length, color: 'text-blue-400' },
          { key: 'under_review', label: 'Under Review', count: counts.under_review || 0, color: 'text-yellow-400' },
          { key: 'accepted', label: 'Accepted', count: counts.accepted || 0, color: 'text-green-400' },
          { key: 'rejected', label: 'Rejected', count: counts.rejected || 0, color: 'text-red-400' },
        ].map((s) => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`card text-center cursor-pointer transition-all ${filter === s.key ? 'border-primary-500/50 glow' : ''}`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
            <div className="text-gray-500 text-xs mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">Start applying for jobs to track your progress here</p>
          <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const job = app.jobId
            const sc = statusConfig[app.status] || statusConfig.applied
            return (
              <div key={app._id} className="card animate-slide-up">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-white text-lg">{job?.title || 'Job'}</h3>
                      <span className={sc.cls}>{sc.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-1">
                      {job?.location && <span className="flex items-center gap-1.5"><MapPin size={13} className="text-primary-400" />{job.location}</span>}
                      {job?.salary && <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-green-400" />{job.salary}</span>}
                      <span className="flex items-center gap-1.5"><Clock size={13} />Applied {formatDistanceToNow(new Date(app.createdAt))} ago</span>
                    </div>
                    <StatusBar status={app.status} />
                  </div>
                  {job?.jobType && (
                    <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${
                      job.jobType === 'Internship' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>{job.jobType}</span>
                  )}
                </div>

                {app.interviewDetails?.date && (
                  <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400 font-semibold text-sm mb-2">
                      <Calendar size={14} /> Interview Scheduled
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-300">
                      <div><span className="text-gray-500">Date: </span>{app.interviewDetails.date}</div>
                      <div><span className="text-gray-500">Time: </span>{app.interviewDetails.time}</div>
                      {app.interviewDetails.meetingLink && (
                        <a href={app.interviewDetails.meetingLink} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-primary-400 hover:underline">
                          <ExternalLink size={12} /> Join Meeting
                        </a>
                      )}
                    </div>
                    {app.interviewDetails.notes && <p className="text-gray-400 text-sm mt-2">{app.interviewDetails.notes}</p>}
                  </div>
                )}

                <div className="flex justify-end mt-3">
                  <Link to={`/jobs/${job?._id}`} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                    <ExternalLink size={13} /> View Job
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Applications
