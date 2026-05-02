import { MapPin, Clock, DollarSign, Briefcase, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const JobCard = ({ job, showMatchScore = false }) => {
  const jobTypeColor = job.jobType === 'Internship'
    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'

  return (
    <div className="card hover:glow group cursor-pointer animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${jobTypeColor}`}>
              {job.jobType}
            </span>
            {showMatchScore && job.matchScore > 0 && (
              <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full">
                <Star size={10} fill="currentColor" /> {job.matchScore}% match
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {job.createdBy?.name || 'Company'}
          </p>
        </div>
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
          <Briefcase size={18} className="text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <MapPin size={14} className="text-primary-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <DollarSign size={14} className="text-green-400" />
          {job.salary || 'Not disclosed'}
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <Clock size={14} className="text-purple-400" />
          {job.experienceLevel || 'Any'}
        </div>
      </div>

      {/* Skills */}
      {job.skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skillsRequired.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-primary-500/10 text-primary-300 border border-primary-500/20 px-2.5 py-1 rounded-lg"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Description preview */}
      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{job.description}</p>

      {/* Footer */}
      <Link
        to={`/jobs/${job._id}`}
        className="flex items-center justify-between w-full"
      >
        <span className="text-xs text-gray-500">
          {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1 text-sm text-primary-400 font-medium group-hover:gap-2 transition-all">
          View Details <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  )
}

export default JobCard
