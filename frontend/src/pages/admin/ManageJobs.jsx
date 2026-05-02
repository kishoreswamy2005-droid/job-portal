import { useState, useEffect } from 'react'
import { getJobs, createJob, updateJob, deleteJob } from '../../api/jobs'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, MapPin, DollarSign, CheckCircle, Briefcase } from 'lucide-react'

const EMPTY_FORM = { title: '', description: '', location: '', salary: '', jobType: 'Job', experienceLevel: 'Any', skillsRequired: [] }

const ManageJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchJobs = () => {
    setLoading(true)
    getJobs({ limit: 100 }).then((res) => setJobs(res.data.jobs)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchJobs() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !form.skillsRequired.includes(s)) setForm({ ...form, skillsRequired: [...form.skillsRequired, s] })
    setNewSkill('')
  }

  const openCreate = () => { setForm(EMPTY_FORM); setEditJob(null); setShowForm(true) }
  const openEdit = (job) => {
    setForm({ title: job.title, description: job.description, location: job.location,
      salary: job.salary || '', jobType: job.jobType, experienceLevel: job.experienceLevel, skillsRequired: job.skillsRequired || [] })
    setEditJob(job)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, skillsRequired: JSON.stringify(form.skillsRequired) }
      if (editJob) {
        await updateJob(editJob._id, payload)
        toast.success('Job updated!')
      } else {
        await createJob(payload)
        toast.success('Job posted!')
      }
      setShowForm(false)
      fetchJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job? This cannot be undone.')) return
    try {
      await deleteJob(id)
      toast.success('Job deleted')
      setJobs((prev) => prev.filter((j) => j._id !== id))
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Manage Jobs</h1>
          <p className="section-sub">{jobs.length} active listings</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Post Job
        </button>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Job Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Frontend Developer" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Type</label>
                  <select name="jobType" value={form.jobType} onChange={handleChange} className="input-field">
                    <option value="Job">Job</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="label">Experience Level</label>
                  <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="input-field">
                    <option value="Any">Any</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Bangalore, Remote" className="input-field" />
                </div>
                <div>
                  <label className="label">Salary (optional)</label>
                  <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹8-12 LPA" className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Skills Required</label>
                <div className="flex gap-2 mb-2">
                  <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add skill (Enter)" className="input-field" />
                  <button type="button" onClick={addSkill} className="btn-secondary px-4 text-sm flex-shrink-0">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skillsRequired.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 bg-primary-500/15 text-primary-300 border border-primary-500/25 px-3 py-1.5 rounded-xl text-sm">
                      {s}
                      <button type="button" onClick={() => setForm({ ...form, skillsRequired: form.skillsRequired.filter((sk) => sk !== s) })}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Job Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={6}
                  placeholder="Describe the role, responsibilities, requirements..." className="input-field resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    : <CheckCircle size={15} />}
                  {saving ? 'Saving...' : editJob ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No jobs posted yet</p>
          <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2"><Plus size={15} /> Post First Job</button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg">{job.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      job.jobType === 'Internship' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>{job.jobType}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-primary-400" />{job.location}</span>
                    {job.salary && <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-green-400" />{job.salary}</span>}
                    <span className="text-gray-600">{new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skillsRequired?.slice(0, 5).map((s) => (
                      <span key={s} className="text-xs bg-dark-600 text-gray-400 px-2.5 py-1 rounded-lg border border-white/5">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(job)} className="p-2.5 glass rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="p-2.5 glass rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageJobs
