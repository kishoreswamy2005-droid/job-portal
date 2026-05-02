import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProfile, updateProfile } from '../../api/user'
import toast from 'react-hot-toast'
import {
  User, Phone, GraduationCap, Briefcase, Plus, X,
  Upload, FileText, Camera, Save, CheckCircle, Link as LinkIcon
} from 'lucide-react'

const Dashboard = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', education: { degree: '', institution: '', year: '' },
    skills: [], projects: [], experienceLevel: 'Fresher',
  })
  const [newSkill, setNewSkill] = useState('')
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' })
  const [profileImage, setProfileImage] = useState(null)
  const [resume, setResume] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()
  const resumeRef = useRef()

  useEffect(() => {
    getProfile().then((res) => {
      const u = res.data.user
      setProfile(u)
      setForm({
        name: u.name || '',
        phone: u.phone || '',
        education: u.education || { degree: '', institution: '', year: '' },
        skills: u.skills || [],
        projects: u.projects || [],
        experienceLevel: u.experienceLevel || 'Fresher',
      })
      setImagePreview(u.profileImage || null)
    }).catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const completeness = (() => {
    const fields = [
      form.name, form.phone, form.education?.degree,
      form.skills.length > 0, form.projects.length > 0,
      profile?.profileImage, profile?.resume, form.experienceLevel,
    ]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  })()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleEduChange = (e) => setForm({ ...form, education: { ...form.education, [e.target.name]: e.target.value } })

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] })
    }
    setNewSkill('')
  }
  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((sk) => sk !== s) })

  const addProject = () => {
    if (newProject.title) {
      setForm({ ...form, projects: [...form.projects, { ...newProject }] })
      setNewProject({ title: '', description: '', link: '' })
    }
  }
  const removeProject = (i) => setForm({ ...form, projects: form.projects.filter((_, idx) => idx !== i) })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }
  const handleResumeChange = (e) => {
    const file = e.target.files[0]
    if (file) setResume(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('phone', form.phone)
      fd.append('experienceLevel', form.experienceLevel)
      fd.append('education', JSON.stringify(form.education))
      fd.append('skills', JSON.stringify(form.skills))
      fd.append('projects', JSON.stringify(form.projects))
      if (profileImage) fd.append('profileImage', profileImage)
      if (resume) fd.append('resume', resume)

      const res = await updateProfile(fd)
      setProfile(res.data.user)
      updateUser(res.data.user)
      toast.success('Profile updated! ✅')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">My Profile</h1>
          <p className="section-sub">Complete your profile to get better job matches</p>
        </div>
        {/* Profile Completeness */}
        <div className="glass rounded-2xl p-4 min-w-[200px]">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Profile Complete</span>
            <span className={`font-bold ${completeness >= 80 ? 'text-green-400' : completeness >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {completeness}%
            </span>
          </div>
          <div className="w-full bg-dark-500 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${completeness >= 80 ? 'bg-green-500' : completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completeness < 100 ? 'Fill all fields for best matches' : '🎉 Profile complete!'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image + Basic Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <User size={18} className="text-primary-400" /> Basic Information
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden glass border-2 border-white/10">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-bg flex items-center justify-center text-3xl font-black text-white">
                    {form.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => fileRef.current.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 gradient-bg rounded-xl flex items-center justify-center hover:opacity-90 transition-all">
                <Camera size={14} className="text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input-field" required />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Email Address</label>
                <input value={profile?.email || ''} disabled className="input-field opacity-50 cursor-not-allowed" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Experience Level</label>
                <div className="flex gap-3">
                  {['Fresher', 'Experienced'].map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setForm({ ...form, experienceLevel: level })}
                      className={`flex-1 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                        form.experienceLevel === level
                          ? 'gradient-bg text-white border-transparent'
                          : 'glass text-gray-400 border-white/10 hover:border-primary-500/40'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <GraduationCap size={18} className="text-purple-400" /> Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Degree</label>
              <input name="degree" value={form.education.degree} onChange={handleEduChange} placeholder="B.Tech CSE" className="input-field" />
            </div>
            <div>
              <label className="label">Institution</label>
              <input name="institution" value={form.education.institution} onChange={handleEduChange} placeholder="MIT University" className="input-field" />
            </div>
            <div>
              <label className="label">Year</label>
              <input name="year" value={form.education.year} onChange={handleEduChange} placeholder="2024" className="input-field" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Briefcase size={18} className="text-blue-400" /> Skills
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill (press Enter)"
              className="input-field"
            />
            <button type="button" onClick={addSkill} className="btn-primary flex-shrink-0 flex items-center gap-1.5">
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span key={skill} className="flex items-center gap-1.5 bg-primary-500/15 text-primary-300 border border-primary-500/25 px-3 py-1.5 rounded-xl text-sm">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && <p className="text-gray-600 text-sm">No skills added yet</p>}
          </div>
        </div>

        {/* Projects */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <LinkIcon size={18} className="text-green-400" /> Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project Title" className="input-field" />
            <input value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              placeholder="GitHub / Live Link" className="input-field" />
            <input value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief description" className="input-field" />
          </div>
          <button type="button" onClick={addProject} className="btn-secondary flex items-center gap-2 text-sm mb-4">
            <Plus size={14} /> Add Project
          </button>
          <div className="space-y-3">
            {form.projects.map((p, i) => (
              <div key={i} className="flex items-start justify-between glass rounded-xl p-4 group">
                <div>
                  <div className="font-semibold text-white">{p.title}</div>
                  {p.description && <p className="text-gray-400 text-sm mt-0.5">{p.description}</p>}
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-primary-400 text-xs hover:underline">{p.link}</a>}
                </div>
                <button type="button" onClick={() => removeProject(i)}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-3 flex-shrink-0">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <FileText size={18} className="text-yellow-400" /> Resume
          </h2>
          <div
            onClick={() => resumeRef.current.click()}
            className="border-2 border-dashed border-white/10 hover:border-primary-500/40 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-white/2"
          >
            <Upload size={28} className="text-gray-500 mx-auto mb-3" />
            {resume ? (
              <div>
                <p className="text-green-400 font-medium flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> {resume.name}
                </p>
                <p className="text-gray-600 text-xs mt-1">Click to change</p>
              </div>
            ) : profile?.resume ? (
              <div>
                <p className="text-primary-400 text-sm">Resume uploaded ✓</p>
                <p className="text-gray-600 text-xs mt-1">Click to update</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-1">Click to upload your resume</p>
                <p className="text-gray-600 text-xs">PDF only • Max 5MB</p>
              </div>
            )}
          </div>
          <input ref={resumeRef} type="file" accept=".pdf" onChange={handleResumeChange} className="hidden" />
        </div>

        {/* Save Button */}
        <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </>
          ) : (
            <><Save size={18} /> Save Profile</>
          )}
        </button>
      </form>
    </div>
  )
}

export default Dashboard
