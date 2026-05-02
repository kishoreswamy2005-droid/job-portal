import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getJobById } from '../../api/jobs'
import { applyForJob } from '../../api/applications'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MapPin, DollarSign, Clock, Briefcase, ArrowLeft, Send,
  CheckCircle, Users, Calendar, ExternalLink
} from 'lucide-react'

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showCover, setShowCover] = useState(false)

  useEffect(() => {
    getJobById(id)
      .then((res) => setJob(res.data.job))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleApply = async () => {
    if (!user) return navigate('/login')
    setApplying(true)
    try {
      await applyForJob(id, { coverLetter })
      setApplied(true)
      toast.success('Application submitted successfully! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message
      if (msg?.includes('already applied')) {
        setApplied(true)
        toast.error('You have already applied for this job.')
      } else {
        toast.error(msg || 'Failed to apply. Try again.')
      }
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!job) return null

  const jobTypeColor = job.jobType === 'Internship'
    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center flex-shrink-0">
                <Briefcase size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${jobTypeColor}`}>
                    {job.jobType}
                  </span>
                  <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                <p className="text-gray-400 mt-1">{job.createdBy?.name || 'Company'}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
              {[
                { icon: <MapPin size={16} className="text-primary-400" />, label: 'Location', value: job.location },
                { icon: <DollarSign size={16} className="text-green-400" />, label: 'Salary', value: job.salary || 'Not disclosed' },
                { icon: <Clock size={16} className="text-purple-400" />, label: 'Experience', value: job.experienceLevel },
                { icon: <Calendar size={16} className="text-yellow-400" />, label: 'Posted', value: new Date(job.createdAt).toLocaleDateString('en-IN') },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                    {m.icon} {m.label}
                  </div>
                  <div className="font-semibold text-white text-sm">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-4">Job Description</h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
              {job.description}
            </div>
          </div>

          {/* Skills */}
          {job.skillsRequired?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <span key={skill} className="bg-primary-500/15 text-primary-300 border border-primary-500/20 px-3 py-1.5 rounded-xl text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — Apply */}
        <div className="space-y-5">
          <div className="card sticky top-20">
            <h2 className="font-bold text-white text-lg mb-4">Apply for this Role</h2>

            {applied ? (
              <div className="text-center py-4">
                <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                <p className="text-green-400 font-bold">Applied Successfully!</p>
                <p className="text-gray-500 text-sm mt-1">Track your status in Applications</p>
                <button onClick={() => navigate('/applications')} className="btn-secondary w-full mt-4 text-sm">
                  View My Applications
                </button>
              </div>
            ) : (
              <div>
                {showCover ? (
                  <div className="mb-4">
                    <label className="label">Cover Letter (optional)</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={5}
                      placeholder="Tell us why you're a great fit..."
                      className="input-field resize-none"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCover(true)}
                    className="btn-secondary w-full text-sm mb-3 flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} /> Add Cover Letter
                  </button>
                )}

                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : <Send size={16} />}
                  {applying ? 'Submitting...' : 'Apply Now'}
                </button>

                {!user && (
                  <p className="text-center text-gray-500 text-xs mt-3">
                    <button onClick={() => navigate('/login')} className="text-primary-400 hover:underline">Login</button> to apply
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="pt-4 mt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Users size={14} /> Multiple openings available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
