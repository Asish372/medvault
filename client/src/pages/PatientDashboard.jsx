import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  Heart, 
  Activity, 
  Download,
  Eye,
  Clock,
  User,
  Pill,
  TestTube,
  Search,
  Filter,
  TrendingUp,
  Loader,
  Bell,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'
import demoDataService from '../services/demoDataService'

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [records, setRecords] = useState([])
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Get patient-specific data
      const patientStats = demoDataService.getPatientStats()
      const patientRecords = demoDataService.getPatientRecords()
      const upcomingAppointments = demoDataService.getUpcomingAppointments()
      const activePrescriptions = demoDataService.getActivePrescriptions()
      
      setStats(patientStats)
      setRecords(patientRecords)
      setAppointments(upcomingAppointments)
      setPrescriptions(activePrescriptions)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleViewRecord = (recordId) => {
    toast.success(`Viewing record ${recordId}`)
  }

  const handleDownloadRecord = (recordId) => {
    toast.success(`Downloading record ${recordId}`)
  }

  const filteredRecords = records.filter(record =>
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statCards = [
    {
      title: 'Medical Records',
      value: stats.totalRecords || 0,
      icon: FileText,
      color: 'from-teal-500 to-emerald-500'
    },
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments || 0,
      icon: Calendar,
      color: 'from-emerald-500 to-cyan-500'
    },
    {
      title: 'Active Prescriptions',
      value: stats.activePrescriptions || 0,
      icon: Pill,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Lab Results',
      value: stats.labResults || 0,
      icon: TestTube,
      color: 'from-blue-500 to-indigo-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl mr-3 shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                Patient Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Welcome back! Here's your health overview
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Doctor
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medical Records */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100 dark:border-gray-700"
            >
              <div className="p-6 border-b border-teal-100 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    Recent Medical Records
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-teal-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 text-slate-900 dark:text-white text-sm backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-teal-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {record.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Dr. {record.doctor} • {record.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.type === 'Consultation' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' :
                          record.type === 'Lab Result' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                          'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
                        }`}>
                          {record.type}
                        </span>
                        <button className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100 dark:border-gray-700"
            >
              <div className="p-6 border-b border-teal-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Upcoming Appointments
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {appointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-4 p-3 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-emerald-100 dark:border-gray-600"
                    >
                      <div className="w-3 h-3 rounded-full mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-sm" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Dr. {appointment.doctor}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {appointment.type}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Active Prescriptions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100 dark:border-gray-700"
            >
              <div className="p-6 border-b border-teal-100 dark:border-gray-700 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Active Prescriptions
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {prescriptions.map((prescription, index) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-4 p-3 bg-gradient-to-r from-slate-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-cyan-100 dark:border-gray-600"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Pill className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {prescription.medication}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {prescription.dosage} • {prescription.frequency}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Prescribed by Dr. {prescription.doctor}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Health Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100 dark:border-gray-700"
            >
              <div className="p-6 border-b border-teal-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Health Metrics
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-indigo-100 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Blood Pressure</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">120/80</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-indigo-100 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Heart Rate</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">72 bpm</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-indigo-100 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Weight</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">70 kg</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
