import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginApi } from '../../api/auth'
import { register } from '../../api/auth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', adminSecretKey: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await loginApi({ email: form.email, password: form.password })
        if (res.data.user.role !== 'admin') {
          return toast.error('This account is not an admin account.')
        }
        login(res.data.token, res.data.user)
        toast.success('Welcome back, Admin! 🚀')
        navigate('/admin/dashboard')
      } else {
        const res = await register({ ...form, role: 'admin' })
        login(res.data.token, res.data.user)
        toast.success('Admin account created!')
        navigate('/admin/dashboard')
      }
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot connect to server. Please check your backend deployment!')
      } else {
        toast.error(err.response.data?.message || 'Authentication failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute top-20 left-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card glow-purple">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Recruiter access only</p>
          </div>

          {/* Toggle */}
          <div className="flex glass rounded-xl p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  mode === m ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Admin Name" className="input-field" />
              </div>
            )}
            <div>
              <label className="label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="admin@company.com" className="input-field" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required placeholder="Enter password" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {mode === 'register' && (
              <div>
                <label className="label">Admin Secret Key</label>
                <input name="adminSecretKey" type="password" value={form.adminSecretKey}
                  onChange={handleChange} required placeholder="Enter admin secret key" className="input-field" />
                <p className="text-xs text-gray-600 mt-1">Contact system administrator for this key</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : <Shield size={16} />}
              {loading ? 'Processing...' : mode === 'login' ? 'Admin Sign In' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
