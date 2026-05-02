import api from './axios'

export const getJobs = (params) => api.get('/jobs', { params })
export const getJobById = (id) => api.get(`/jobs/${id}`)
export const getRecommendedJobs = () => api.get('/jobs/recommended')
export const createJob = (data) => api.post('/jobs', data)
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data)
export const deleteJob = (id) => api.delete(`/jobs/${id}`)
