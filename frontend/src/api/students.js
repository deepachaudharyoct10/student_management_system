import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const API = axios.create({ baseURL: BASE_URL })

export const getAllStudents = (search = '') =>
  API.get(`/students${search ? `?search=${encodeURIComponent(search)}` : ''}`)

export const getStudentById = (id) => API.get(`/students/${id}`)

export const createStudent = (formData) =>
  API.post('/students', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const updateStudent = (id, formData) =>
  API.put(`/students/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteStudent = (id) => API.delete(`/students/${id}`)
