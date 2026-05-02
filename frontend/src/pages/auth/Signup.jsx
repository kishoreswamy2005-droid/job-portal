import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { register } from '../../api/auth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Briefcase, ArrowLeft, User } from 'lucide-react'

const Signup = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!')
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password, role: 'user' })
      login(res.data.token, res.data.user)
      toast.success('Account created successfully! 🎉')
      navigate('/dashboard')
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot connect to server. Please check your backend deployment!')
      } else {
        toast.error(err.response.data?.message || 'Registration failed. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card glow">
          <div className="text-center mb-8">
            <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Start your job search journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} required
                placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="john@example.com" className="input-field" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required placeholder="Min. 6 characters" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword}
                onChange={handleChange} required placeholder="Re-enter password" className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
