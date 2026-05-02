import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

const JobFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    skills: '',
    experienceLevel: '',
  })

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value }
    setFilters(updated)
    onFilter(updated)
  }

  const clearFilters = () => {
    const cleared = { search: '', location: '', jobType: '', skills: '', experienceLevel: '' }
    setFilters(cleared)
    onFilter(cleared)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="card mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search jobs, roles..."
            className="input-field pl-9"
          />
        </div>

        {/* Location */}
        <div className="sm:w-40">
          <input
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Location"
            className="input-field"
          />
        </div>

        {/* Job Type */}
        <div className="sm:w-36">
          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Experience */}
        <div className="sm:w-40">
          <select
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Levels</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Skills filter */}
      <div className="mt-3">
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            name="skills"
            value={filters.skills}
            onChange={handleChange}
            placeholder="Filter by skills (e.g. React, Python, Node.js)"
            className="input-field pl-8 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default JobFilter
