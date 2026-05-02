import api from './axios'

export const getProfile = () => api.get('/user/profile')
export const updateProfile = (formData) =>
  api.put('/user/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const getAllUsers = () => api.get('/user/all')
export const getUserById = (id) => api.get(`/user/${id}`)
