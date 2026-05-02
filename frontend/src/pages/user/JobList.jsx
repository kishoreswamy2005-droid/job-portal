import { useState, useEffect, useCallback } from 'react'
import { getJobs, getRecommendedJobs } from '../../api/jobs'
import JobCard from '../../components/job/JobCard'
import JobFilter from '../../components/job/JobFilter'
import { useAuth } from '../../context/AuthContext'
import { Briefcase, Star, ChevronLeft, ChevronRight, Loader } from 'lucide-react'

const JobList = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({})

  const fetchJobs = useCallback(async (f = {}, page = 1) => {
    setLoading(true)
    try {
      const params = { ...f, page, limit: 12 }
      Object.keys(params).forEach((k) => !params[k] && delete params[k])
      const res = await getJobs(params)
      setJobs(res.data.jobs)
      setPagination(res.data.pagination)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
    if (user) {
      getRecommendedJobs()
        .then((res) => setRecommended(res.data.jobs))
        .catch(() => {})
    }
  }, [fetchJobs, user])

  const handleFilter = (f) => {
    setFilters(f)
    fetchJobs(f, 1)
  }

  const handlePage = (p) => fetchJobs(filters, p)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Find Jobs & Internships</h1>
        <p className="section-sub">{pagination.total} opportunities available</p>
      </div>

      <JobFilter onFilter={handleFilter} />

      {/* Recommended section */}
      {recommended.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <h2 className="text-lg font-bold text-white">Recommended for You</h2>
            <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full ml-1">
              Based on your skills
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map((job) => (
              <JobCard key={job._id} job={job} showMatchScore />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {recommended.length > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <Briefcase size={14} /> All Jobs
          </span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
      )}

      {/* Job Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={32} className="animate-spin text-primary-400" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => handlePage(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 glass rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all text-gray-400"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                p === pagination.page ? 'gradient-bg text-white' : 'glass text-gray-400 hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePage(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="p-2 glass rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all text-gray-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export default JobList
