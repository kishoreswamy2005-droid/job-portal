import api from './axios'

export const applyForJob = (jobId, data) => api.post(`/applications/apply/${jobId}`, data)
export const getUserApplications = () => api.get('/applications/user')
export const getJobApplicants = (jobId) => api.get(`/applications/job/${jobId}`)
export const getAllApplications = () => api.get('/applications/all')
export const updateApplicationStatus = (id, status) =>
  api.put(`/applications/${id}/status`, { status })
export const scheduleInterview = (id, data) => api.post(`/applications/${id}/interview`, data)
