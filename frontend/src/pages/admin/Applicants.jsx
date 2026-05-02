import { useState, useEffect } from 'react'
import { getJobs } from '../../api/jobs'
import { getJobApplicants, updateApplicationStatus } from '../../api/applications'
import toast from 'react-hot-toast'
import {
  Users, ChevronDown, CheckCircle, XCircle, Clock,
  User, FileText, Phone, GraduationCap, ExternalLink, Briefcase
} from 'lucide-react'

const statusLabels = {
  applied: { label: 'Applied', cls: 'badge-applied' },
  under_review: { label: 'Under Review', cls: 'badge-under_review' },
  accepted: { label: 'Accepted', cls: 'badge-accepted' },
  rejected: { label: 'Rejected', cls: 'badge-rejected' },
}

const Applicants = () => {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)
  const [expandedUser, setExpandedUser] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    getJobs({ limit: 100 }).then((res) => {
      setJobs(res.data.jobs)
      if (res.data.jobs.length > 0) handleSelectJob(res.data.jobs[0])
    })
  }, [])

  const handleSelectJob = (job) => {
    setSelectedJob(job)
    setLoadingApps(true)
    setExpandedUser(null)
    getJobApplicants(job._id)
      .then((res) => setApplicants(res.data.applications))
      .finally(() => setLoadingApps(false))
  }

  const handleStatusChange = async (appId, status) => {
    setUpdatingId(appId)
    try {
      await updateApplicationStatus(appId, status)
      setApplicants((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a))
      toast.success(`Status updated to "${status.replace('_', ' ')}"`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Applicant Management</h1>
        <p className="section-sub">Review and manage candidates for your job postings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Job Selector Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Select Job</h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {jobs.map((job) => (
                <button key={job._id} onClick={() => handleSelectJob(job)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all text-sm ${
                    selectedJob?._id === job._id
                      ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}>
                  <div className="font-medium line-clamp-1">{job.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{job.location}</div>
                </button>
              ))}
              {jobs.length === 0 && <p className="text-gray-600 text-sm">No jobs posted yet</p>}
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="lg:col-span-3">
          {!selectedJob ? (
            <div className="text-center py-20">
              <Briefcase size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">Select a job to view applicants</p>
            </div>
          ) : loadingApps ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-20 card">
              <Users size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold">No applications yet</p>
              <p className="text-gray-600 text-sm mt-1">for {selectedJob.title}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-white">{selectedJob.title}</h2>
                <span className="text-sm text-gray-500">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</span>
              </div>

              {applicants.map((app) => {
                const u = app.userId
                const sc = statusLabels[app.status] || statusLabels.applied
                const isExpanded = expandedUser === app._id

                return (
                  <div key={app._id} className="card">
                    {/* Applicant Row */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {u?.profileImage ? (
                          <img src={u.profileImage} alt={u.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-11 gradient-bg rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {u?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{u?.name}</div>
                          <div className="text-gray-500 text-sm truncate">{u?.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={sc.cls}>{sc.label}</span>
                        <button onClick={() => setExpandedUser(isExpanded ? null : app._id)}
                          className="p-1.5 glass rounded-lg text-gray-400 hover:text-white transition-all">
                          <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Profile */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-white/5 animate-fade-in space-y-5">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          {u?.phone && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Phone size={13} className="text-primary-400" />
                              {u.phone}
                            </div>
                          )}
                          {u?.experienceLevel && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Briefcase size={13} className="text-purple-400" />
                              {u.experienceLevel}
                            </div>
                          )}
                          {u?.education?.degree && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <GraduationCap size={13} className="text-yellow-400" />
                              {u.education.degree} — {u.education.institution}
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {u?.skills?.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Skills</div>
                            <div className="flex flex-wrap gap-1.5">
                              {u.skills.map((s) => (
                                <span key={s} className="text-xs bg-primary-500/10 text-primary-300 border border-primary-500/20 px-2.5 py-1 rounded-lg">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {u?.projects?.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Projects</div>
                            <div className="space-y-2">
                              {u.projects.map((p, i) => (
                                <div key={i} className="flex items-start justify-between glass rounded-xl p-3">
                                  <div>
                                    <div className="font-medium text-white text-sm">{p.title}</div>
                                    {p.description && <div className="text-gray-500 text-xs mt-0.5">{p.description}</div>}
                                  </div>
                                  {p.link && (
                                    <a href={p.link} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline flex items-center gap-1 text-xs ml-3 flex-shrink-0">
                                      <ExternalLink size={11} /> Link
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resume */}
                        {u?.resume && (
                          <div>
                            <a href={u.resume} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 glass px-4 py-2 rounded-xl border border-primary-500/20 transition-all">
                              <FileText size={14} /> View Resume
                            </a>
                          </div>
                        )}

                        {/* Cover Letter */}
                        {app.coverLetter && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Cover Letter</div>
                            <p className="text-gray-300 text-sm glass rounded-xl p-4 leading-relaxed">{app.coverLetter}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button onClick={() => handleStatusChange(app._id, 'under_review')} disabled={updatingId === app._id}
                            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl hover:bg-yellow-500/20 transition-all disabled:opacity-50">
                            <Clock size={13} /> Mark Under Review
                          </button>
                          <button onClick={() => handleStatusChange(app._id, 'accepted')} disabled={updatingId === app._id}
                            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all disabled:opacity-50">
                            <CheckCircle size={13} /> Accept
                          </button>
                          <button onClick={() => handleStatusChange(app._id, 'rejected')} disabled={updatingId === app._id}
                            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50">
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Applicants
