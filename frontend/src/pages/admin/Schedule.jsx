import { useState, useEffect } from 'react'
import { getJobs } from '../../api/jobs'
import { getJobApplicants, scheduleInterview } from '../../api/applications'
import toast from 'react-hot-toast'
import { Calendar, Clock, Link as LinkIcon, Send, Users, FileText } from 'lucide-react'

const Schedule = () => {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [applicants, setApplicants] = useState([])
  const [selectedApp, setSelectedApp] = useState('')
  const [form, setForm] = useState({ date: '', time: '', meetingLink: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getJobs({ limit: 100 }).then((res) => setJobs(res.data.jobs))
  }, [])

  const handleJobChange = (e) => {
    const jobId = e.target.value
    setSelectedJob(jobId)
    setSelectedApp('')
    if (jobId) {
      setLoading(true)
      getJobApplicants(jobId)
        .then((res) => setApplicants(res.data.applications.filter((a) => a.status !== 'rejected')))
        .finally(() => setLoading(false))
    } else {
      setApplicants([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedApp) return toast.error('Please select a candidate')
    if (!form.date || !form.time || !form.meetingLink) return toast.error('Date, time and meeting link are required')

    setSending(true)
    try {
      await scheduleInterview(selectedApp, form)
      toast.success('Interview scheduled! Candidate has been notified. 📅')
      setForm({ date: '', time: '', meetingLink: '', notes: '' })
      setSelectedApp('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview')
    } finally {
      setSending(false)
    }
  }

  const selectedApplicant = applicants.find((a) => a._id === selectedApp)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Schedule Interview</h1>
        <p className="section-sub">Set up interview details and notify the candidate automatically</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Job */}
        <div className="card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 gradient-bg rounded-full text-xs font-black text-white flex items-center justify-center">1</span>
            Select Job Position
          </h2>
          <select value={selectedJob} onChange={handleJobChange} className="input-field">
            <option value="">— Choose a job —</option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>{j.title} — {j.location}</option>
            ))}
          </select>
        </div>

        {/* Step 2: Select Candidate */}
        <div className={`card transition-all ${!selectedJob ? 'opacity-40 pointer-events-none' : ''}`}>
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 gradient-bg rounded-full text-xs font-black text-white flex items-center justify-center">2</span>
            Select Candidate
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              Loading applicants...
            </div>
          ) : (
            <>
              <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="input-field mb-4">
                <option value="">— Choose a candidate —</option>
                {applicants.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.userId?.name} ({a.status?.replace('_', ' ')})
                  </option>
                ))}
              </select>
              {applicants.length === 0 && selectedJob && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <Users size={14} /> No eligible candidates for this position
                </p>
              )}
              {/* Selected candidate preview */}
              {selectedApplicant && (
                <div className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-sm font-bold text-white">
                    {selectedApplicant.userId?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{selectedApplicant.userId?.name}</div>
                    <div className="text-gray-400 text-sm">{selectedApplicant.userId?.email}</div>
                    {selectedApplicant.userId?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {selectedApplicant.userId.skills.slice(0, 4).map((s) => (
                          <span key={s} className="text-xs bg-primary-500/10 text-primary-300 px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedApplicant.userId?.resume && (
                    <a href={selectedApplicant.userId.resume} target="_blank" rel="noreferrer"
                      className="ml-auto text-primary-400 hover:underline flex items-center gap-1 text-xs">
                      <FileText size={12} /> Resume
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Step 3: Interview Details */}
        <div className={`card transition-all ${!selectedApp ? 'opacity-40 pointer-events-none' : ''}`}>
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 gradient-bg rounded-full text-xs font-black text-white flex items-center justify-center">3</span>
            Interview Details
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label flex items-center gap-1.5"><Calendar size={13} /> Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Clock size={13} /> Time *</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="mb-4">
            <label className="label flex items-center gap-1.5"><LinkIcon size={13} /> Meeting Link *</label>
            <input type="url" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
              placeholder="https://meet.google.com/..." className="input-field" />
          </div>
          <div>
            <label className="label">Additional Notes (optional)</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3} placeholder="Instructions, round details, documents to bring..." className="input-field resize-none" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={sending || !selectedApp}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
          {sending ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : <Send size={18} />}
          {sending ? 'Sending Notification...' : 'Schedule & Notify Candidate'}
        </button>
      </form>
    </div>
  )
}

export default Schedule
