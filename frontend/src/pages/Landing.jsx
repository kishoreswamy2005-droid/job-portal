import { useNavigate } from 'react-router-dom'
import { Briefcase, Users, ArrowRight, CheckCircle, Star, Zap, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const features = [
  { icon: <Zap size={20} className="text-yellow-400" />, title: 'Skill Matching', desc: 'AI-powered job recommendations based on your skill set' },
  { icon: <Shield size={20} className="text-green-400" />, title: 'Secure Platform', desc: 'JWT authentication with bcrypt encryption' },
  { icon: <Star size={20} className="text-purple-400" />, title: 'Real-time Tracking', desc: 'Track your application status from applied to accepted' },
  { icon: <CheckCircle size={20} className="text-blue-400" />, title: 'Interview Scheduling', desc: 'Admins can schedule interviews with meeting links' },
]

const Landing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary-300 mb-8 border border-primary-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Now hiring across 50+ companies
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Find Your
            <span className="gradient-text"> Dream Career</span>
            <br />With JobPortal
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with top companies, showcase your skills, and land your perfect job.
            The modern way to find opportunities that match your profile.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/signup')}
              className="group flex items-center gap-3 gradient-bg text-white font-bold text-lg py-4 px-10 rounded-2xl hover:opacity-90 transition-all duration-200 active:scale-95 shadow-2xl shadow-primary-500/25 glow"
            >
              <Users size={22} />
              I'm a Job Seeker
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="group flex items-center gap-3 glass text-white font-bold text-lg py-4 px-10 rounded-2xl hover:bg-white/10 transition-all duration-200 active:scale-95 border border-white/10 hover:border-purple-500/40"
            >
              <Briefcase size={22} />
              I'm a Recruiter
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { value: '10K+', label: 'Job Listings' },
              { value: '5K+', label: 'Companies' },
              { value: '50K+', label: 'Candidates' },
              { value: '95%', label: 'Success Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Why JobPortal?</h2>
          <p className="text-center text-gray-400 mb-12">Everything you need to land your next opportunity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:glow text-center group">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 gradient-bg rounded-lg flex items-center justify-center">
            <Briefcase size={12} className="text-white" />
          </div>
          <span className="font-bold text-gray-400">JobPortal</span>
        </div>
        © 2024 JobPortal. Built with ❤️ for developers and companies.
      </footer>
    </div>
  )
}

export default Landing
