import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createStudent } from '../api/students'

const COURSES = ['B.Tech', 'B.Sc', 'B.Com', 'BCA', 'BBA', 'MBA', 'MCA', 'M.Tech', 'M.Sc', 'Other']
const YEARS = [1, 2, 3, 4, 5]
const GENDERS = ['Male', 'Female', 'Other']

const initialForm = {
  name: '', course: '', year: '', date_of_birth: '',
  email: '', mobile_number: '', gender: '', address: '',
}

export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.course) errs.course = 'Course is required'
    if (!form.year) errs.year = 'Year is required'
    if (!form.date_of_birth) errs.date_of_birth = 'Date of birth is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.mobile_number.trim()) errs.mobile_number = 'Mobile number is required'
    else if (!/^[0-9]{10}$/.test(form.mobile_number)) errs.mobile_number = 'Must be 10 digits'
    if (!form.gender) errs.gender = 'Gender is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    if (photo) formData.append('photo', photo)

    try {
      setSubmitting(true)
      await createStudent(formData)
      toast.success('Student added successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
          <p className="text-gray-500 text-sm">Fill in the details below to register a student</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="card flex flex-col items-center gap-4">
          <div className="relative">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border-4 border-blue-200" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <label className="cursor-pointer btn-secondary text-sm">
            <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </label>
          <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 2MB</p>
        </div>

        {/* Personal Info */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">1</span>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Rahul Sharma" />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Date of Birth *</label>
              <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="input-field" />
              {errors.date_of_birth && <p className="error-text">{errors.date_of_birth}</p>}
            </div>
            <div>
              <label className="label">Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                <option value="">Select gender</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gender && <p className="error-text">{errors.gender}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address *</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Enter full address" />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">2</span>
            Academic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Course *</label>
              <select name="course" value={form.course} onChange={handleChange} className="input-field">
                <option value="">Select course</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.course && <p className="error-text">{errors.course}</p>}
            </div>
            <div>
              <label className="label">Year *</label>
              <select name="year" value={form.year} onChange={handleChange} className="input-field">
                <option value="">Select year</option>
                {YEARS.map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
              {errors.year && <p className="error-text">{errors.year}</p>}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">3</span>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="student@example.com" />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Mobile Number *</label>
              <input type="tel" name="mobile_number" value={form.mobile_number} onChange={handleChange} className="input-field" placeholder="10-digit number" maxLength={10} />
              {errors.mobile_number && <p className="error-text">{errors.mobile_number}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link to="/" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
            {submitting ? (
              <><div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div> Saving...</>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Add Student</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
