import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserPlus, 
  Activity, 
  Shield, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  Loader,
  Plus,
  Calendar,
  ChevronDown,
  Heart,
  FileText,
  Settings,
  ArrowRight,
  UserCheck,
  Bell,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import toast from 'react-hot-toast'
import demoDataService from '../services/demoDataService'
import AddUserModal from '../components/AddUserModal'
import AddPatientModal from '../components/AddPatientModal'
import AddDoctorModal from '../components/AddDoctorModal'
import AnimatedCounter from '../components/AnimatedCounter'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentUsers, setRecentUsers] = useState([])
  const [systemActivity, setSystemActivity] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [realTimeCounts, setRealTimeCounts] = useState({})

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const adminStats = demoDataService.getAdminStats()
      const users = demoDataService.getRecentUsers()
      const activity = demoDataService.getSystemActivity()
      const counts = demoDataService.getRealTimeCounts()
      
      setStats(adminStats)
      setRecentUsers(users)
      setSystemActivity(activity)
      setRealTimeCounts(counts)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAdded = (newUser) => {
    setRecentUsers(prev => [newUser, ...prev])
    const updatedCounts = demoDataService.getRealTimeCounts()
    setRealTimeCounts(updatedCounts)
    
    setStats(prev => ({
      ...prev,
      totalUsers: prev.totalUsers + 1,
      ...(newUser.role === 'doctor' && { totalDoctors: prev.totalDoctors + 1 }),
      ...(newUser.role === 'patient' && { totalPatients: prev.totalPatients + 1 })
    }))
    
    const newActivity = {
      id: Date.now(),
      action: `New ${newUser.role} added`,
      user: newUser.name,
      time: 'Just now',
      type: 'user_added'
    }
    setSystemActivity(prev => [newActivity, ...prev.slice(0, 9)])
  }

  const handlePatientAdded = (newPatient) => {
    const updatedCounts = demoDataService.getRealTimeCounts()
    setRealTimeCounts(updatedCounts)
    
    setStats(prev => ({
      ...prev,
      totalPatients: prev.totalPatients + 1
    }))
    
    const newActivity = {
      id: Date.now(),
      action: 'New patient added',
      user: newPatient.name,
      time: 'Just now',
      type: 'patient_added'
    }
    setSystemActivity(prev => [newActivity, ...prev.slice(0, 9)])
  }

  const handleDoctorAdded = (newDoctor) => {
    const updatedCounts = demoDataService.getRealTimeCounts()
    setRealTimeCounts(updatedCounts)
    
    setStats(prev => ({
      ...prev,
      totalDoctors: prev.totalDoctors + 1
    }))
    
    const newActivity = {
      id: Date.now(),
      action: 'New doctor added',
      user: newDoctor.name,
      time: 'Just now',
      type: 'doctor_added'
    }
    setSystemActivity(prev => [newActivity, ...prev.slice(0, 9)])
  }

  const handleAppointmentAdded = (newAppointment) => {
    const newActivity = {
      id: Date.now(),
      action: 'New appointment scheduled',
      user: newAppointment.patientName,
      time: 'Just now',
      type: 'appointment_added'
    }
    setSystemActivity(prev => [newActivity, ...prev.slice(0, 9)])
    toast.success('Appointment scheduled successfully!')
  }

  const filteredUsers = recentUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statCards = [
    {
      title: 'Total Users',
      value: realTimeCounts.totalUsers || stats.totalUsers || 0,
      change: '+12',
      icon: Users,
      color: 'bg-blue-500',
      delay: 0
    },
    {
      title: 'Total Patients',
      value: realTimeCounts.totalPatients || stats.totalPatients || 0,
      change: '+8',
      icon: UserPlus,
      color: 'bg-green-500',
      delay: 200
    },
    {
      title: 'Total Doctors',
      value: realTimeCounts.totalDoctors || stats.totalDoctors || 0,
      change: '+3',
      icon: Shield,
      color: 'bg-purple-500',
      delay: 400
    },
    {
      title: 'System Activity',
      value: stats.systemActivity || 0,
      change: '+25',
      icon: Activity,
      color: 'bg-orange-500',
      delay: 600
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
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 shadow-lg border-b border-blue-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">MedVault</h1>
                  <p className="text-blue-100 text-sm">Admin Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Admin User</p>
                  <p className="text-blue-100 text-xs">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Total Users', 
              value: realTimeCounts.totalUsers || stats.totalUsers || 0, 
              icon: Users, 
              color: 'from-blue-500 to-indigo-600',
              bgColor: 'from-blue-50 to-indigo-100',
              borderColor: 'border-blue-200',
              textColor: 'text-blue-700'
            },
            { 
              title: 'Active Patients', 
              value: realTimeCounts.totalPatients || stats.totalPatients || 0, 
              icon: Heart, 
              color: 'from-emerald-500 to-teal-600',
              bgColor: 'from-emerald-50 to-teal-100',
              borderColor: 'border-emerald-200',
              textColor: 'text-emerald-700'
            },
            { 
              title: 'Total Doctors', 
              value: realTimeCounts.totalDoctors || stats.totalDoctors || 0, 
              icon: UserCheck, 
              color: 'from-purple-500 to-pink-600',
              bgColor: 'from-purple-50 to-pink-100',
              borderColor: 'border-purple-200',
              textColor: 'text-purple-700'
            },
            { 
              title: 'System Health', 
              value: '99.9%', 
              icon: Activity, 
              color: 'from-orange-500 to-red-600',
              bgColor: 'from-orange-50 to-red-100',
              borderColor: 'border-orange-200',
              textColor: 'text-orange-700'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border ${stat.borderColor} dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${stat.bgColor} dark:from-gray-800 dark:to-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor} dark:text-gray-300`}>
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    <AnimatedCounter value={typeof stat.value === 'string' ? 99.9 : stat.value} />
                    {typeof stat.value === 'string' && stat.value.includes('%') ? '%' : ''}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-200 dark:border-gray-700 p-6 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Quick Actions
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Quick Add</span>
                  </button>
                  
                  {showQuickAdd && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-rose-200 dark:border-gray-700 z-10">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowAddUser(true);
                            setShowQuickAdd(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <UserPlus className="h-4 w-4 text-rose-500" />
                          <span>Add User</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowAddPatient(true);
                            setShowQuickAdd(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <Heart className="h-4 w-4 text-rose-500" />
                          <span>Add Patient</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowAddAppointment(true);
                            setShowQuickAdd(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <Calendar className="h-4 w-4 text-rose-500" />
                          <span>Book Appointment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: UserPlus, label: 'Manage Users', color: 'from-rose-500 to-pink-500', bgColor: 'from-rose-100 to-pink-200' },
                  { icon: FileText, label: 'View Reports', color: 'from-pink-500 to-purple-500', bgColor: 'from-pink-100 to-purple-200' },
                  { icon: Settings, label: 'System Settings', color: 'from-purple-500 to-indigo-500', bgColor: 'from-purple-100 to-indigo-200' },
                  { icon: Shield, label: 'Security Audit', color: 'from-indigo-500 to-blue-500', bgColor: 'from-indigo-100 to-blue-200' }
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`w-full flex items-center space-x-3 p-4 bg-white/80 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r ${action.bgColor} dark:from-gray-700 dark:to-gray-600 border border-white/50 dark:border-gray-600`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-cyan-200 dark:border-gray-700 p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Recent Users
                </h2>
                <button className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {filteredUsers.slice(0, 5).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-cyan-50 dark:from-gray-700 dark:to-gray-600 border border-cyan-100 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${
                        user.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                        user.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        'bg-gradient-to-br from-emerald-500 to-teal-600'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        user.role === 'doctor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {user.role}
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="mt-8">
          <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 dark:border-gray-700 p-6 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-800 dark:to-gray-700">
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
              System Activity
            </h2>
            <div className="space-y-4">
              {systemActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-amber-50 dark:from-gray-700 dark:to-gray-600 border border-amber-100 dark:border-gray-600"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    activity.type === 'user_login' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                    activity.type === 'patient_added' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                    activity.type === 'appointment_booked' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                    'bg-gradient-to-br from-orange-500 to-red-600'
                  }`}>
                    {activity.type === 'user_login' ? <Users className="h-5 w-5 text-white" /> :
                     activity.type === 'patient_added' ? <UserPlus className="h-5 w-5 text-white" /> :
                     activity.type === 'appointment_booked' ? <Calendar className="h-5 w-5 text-white" /> :
                     <Activity className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.timestamp}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.type === 'user_login' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    activity.type === 'patient_added' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    activity.type === 'appointment_booked' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {activity.type.replace('_', ' ')}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BarChart 
            data={[
              { label: 'Jan', value: 100 },
              { label: 'Feb', value: 120 },
              { label: 'Mar', value: 150 },
              { label: 'Apr', value: 180 },
              { label: 'May', value: 200 },
              { label: 'Jun', value: 220 },
              { label: 'Jul', value: 250 },
              { label: 'Aug', value: 280 },
              { label: 'Sep', value: 300 },
              { label: 'Oct', value: 320 },
              { label: 'Nov', value: 350 },
              { label: 'Dec', value: 380 }
            ]}
            title="Monthly Users"
            color="blue"
          />
          <DonutChart 
            data={[
              { label: 'Users', value: 50, color: 'blue' },
              { label: 'Patients', value: 30, color: 'green' },
              { label: 'Doctors', value: 20, color: 'purple' }
            ]}
            title="System Users"
            centerValue={100}
            centerLabel="Total Users"
          />
        </div>
      </main>

      {/* Modals */}
      <AddUserModal 
        isOpen={showAddUser} 
        onClose={() => setShowAddUser(false)} 
        onUserAdded={handleUserAdded}
      />
      <AddPatientModal 
        isOpen={showAddPatient} 
        onClose={() => setShowAddPatient(false)} 
        onPatientAdded={handlePatientAdded}
      />
      <AddDoctorModal 
        isOpen={showAddDoctor} 
        onClose={() => setShowAddDoctor(false)} 
        onDoctorAdded={handleDoctorAdded}
      />
      <AddAppointmentModal 
        isOpen={showAddAppointment} 
        onClose={() => setShowAddAppointment(false)} 
        onAppointmentAdded={handleAppointmentAdded}
      />
    </div>
  )
}

// Simple Chart Components
const BarChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className={`h-5 w-5 mr-2 text-${color}-600`} />
          {title}
        </h3>
        <TrendingUp className={`h-5 w-5 text-${color}-600`} />
      </div>
      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full shadow-sm`}
              />
            </div>
            <div className="w-12 text-sm font-bold text-gray-900 dark:text-white">
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const DonutChart = ({ data, title, centerValue, centerLabel }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0
  
  return (
    <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-purple-600" />
          {title}
        </h3>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage * 2.51} ${251 - percentage * 2.51}`
              const strokeDashoffset = -cumulativePercentage * 2.51
              cumulativePercentage += percentage
              
              return (
                <motion.circle
                  key={item.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:stroke-width-10"
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                />
              )
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {centerValue}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {centerLabel}
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.label} ({item.value})
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Add Appointment Modal Component
const AddAppointmentModal = ({ isOpen, onClose, onAppointmentAdded }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.patientName || !formData.doctorName || !formData.appointmentDate) {
        toast.error('Please fill in all required fields')
        return
      }

      const appointmentData = {
        ...formData,
        id: `appointment-${Date.now()}`,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }

      onAppointmentAdded(appointmentData)
      
      setFormData({
        patientName: '',
        doctorName: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: ''
      })
      
      onClose()
    } catch (error) {
      toast.error('Failed to schedule appointment')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-teal-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between p-6 border-b border-teal-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Book Appointment
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule a new patient appointment
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreVertical className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-teal-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter patient name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-teal-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter doctor name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-teal-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-teal-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Visit
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-teal-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Brief reason for appointment"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-teal-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Any additional notes or special requirements"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-teal-100 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    <span>Schedule Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
