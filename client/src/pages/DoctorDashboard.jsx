import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  Plus,
  Search,
  Filter,
  Heart,
  Stethoscope,
  Eye,
  Edit,
  UserPlus,
  Activity,
  TrendingUp,
  Loader,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'
import AddPatientModal from '../components/AddPatientModal'
import demoDataService from '../services/demoDataService'
import AnimatedCounter from '../components/AnimatedCounter'

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [realTimeCounts, setRealTimeCounts] = useState({})
  const [user, setUser] = useState({})

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Get doctor-specific data
      const doctorStats = demoDataService.getDoctorStats()
      const doctorPatients = demoDataService.getDoctorPatients()
      const todayAppointments = demoDataService.getTodayAppointments()
      const counts = demoDataService.getRealTimeCounts()
      const userData = demoDataService.getUserData()
      
      setStats(doctorStats)
      setPatients(doctorPatients)
      setAppointments(todayAppointments)
      setRealTimeCounts(counts)
      setUser(userData)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPatient = (newPatient) => {
    setPatients(prev => [newPatient, ...prev])
    const updatedCounts = demoDataService.getRealTimeCounts()
    setRealTimeCounts(updatedCounts)
    
    setStats(prev => ({
      ...prev,
      totalPatients: prev.totalPatients + 1
    }))
    toast.success('Patient added successfully!')
  }

  const handleViewPatient = (patientId) => {
    toast.success(`Viewing patient ${patientId}`)
  }

  const handleEditPatient = (patientId) => {
    toast.success(`Editing patient ${patientId}`)
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statCards = [
    {
      title: 'My Patients',
      value: realTimeCounts.totalPatients || stats.totalPatients || 0,
      icon: Users,
      color: 'from-teal-500 to-emerald-500',
      delay: 0
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments || 0,
      icon: Calendar,
      color: 'from-emerald-500 to-cyan-500',
      delay: 100
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews || 0,
      icon: FileText,
      color: 'from-cyan-500 to-blue-500',
      delay: 200
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
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                Doctor Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Welcome back, Dr. {user?.name?.split(' ')[1] || user?.name}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddPatient(true)}
              className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Patient
            </motion.button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    <AnimatedCounter 
                      value={stat.value} 
                      duration={2000}
                      delay={stat.delay}
                    />
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Patients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100 dark:border-gray-700"
          >
            <div className="p-6 border-b border-teal-100 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  My Patients
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-teal-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 text-slate-900 dark:text-white text-sm backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-teal-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Age: {patient.age} • {patient.condition}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        patient.status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        patient.status === 'Stable' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {patient.status}
                      </span>
                      <button className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100 dark:border-gray-700"
          >
            <div className="p-6 border-b border-teal-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Today's Schedule
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
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
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {appointment.time}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          appointment.type === 'Consultation' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' :
                          appointment.type === 'Follow-up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                          'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
                        }`}>
                          {appointment.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {appointment.patient}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {appointment.reason}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal 
        isOpen={showAddPatient} 
        onClose={() => setShowAddPatient(false)} 
        onPatientAdded={handleAddPatient}
      />
    </div>
  )
}

export default DoctorDashboard
