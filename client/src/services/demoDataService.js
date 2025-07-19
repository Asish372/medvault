// Demo data service for MedVault application
// This provides mock data when using demo accounts

export const demoDataService = {
  // Admin Dashboard Data
  getAdminStats: () => ({
    totalUsers: 1234,
    activeDoctors: 89,
    totalPatients: 945,
    patientRecords: 5678,
    systemHealth: 99.9,
    monthlyGrowth: 12.5
  }),

  getRecentUsers: () => [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medvault.com',
      role: 'doctor',
      status: 'active',
      joinDate: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'patient',
      status: 'active',
      joinDate: '2024-01-14',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      email: 'michael.brown@medvault.com',
      role: 'doctor',
      status: 'pending',
      joinDate: '2024-01-13',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      role: 'patient',
      status: 'active',
      joinDate: '2024-01-12',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    }
  ],

  getSystemActivity: () => [
    {
      id: 1,
      action: 'New user registration',
      user: 'Dr. Sarah Johnson',
      timestamp: '2 minutes ago',
      type: 'user'
    },
    {
      id: 2,
      action: 'Patient record updated',
      user: 'Dr. Michael Brown',
      timestamp: '5 minutes ago',
      type: 'record'
    },
    {
      id: 3,
      action: 'System backup completed',
      user: 'System',
      timestamp: '1 hour ago',
      type: 'system'
    }
  ],

  // Doctor Dashboard Data
  getDoctorStats: () => ({
    totalPatients: 45,
    todayAppointments: 8,
    pendingReports: 12,
    completedToday: 6
  }),

  getDoctorPatients: () => [
    {
      id: 1,
      name: 'John Smith',
      age: 34,
      condition: 'Hypertension',
      lastVisit: '2024-01-10',
      status: 'stable',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Emily Davis',
      age: 28,
      condition: 'Diabetes Type 2',
      lastVisit: '2024-01-08',
      status: 'monitoring',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Robert Wilson',
      age: 52,
      condition: 'Heart Disease',
      lastVisit: '2024-01-05',
      status: 'critical',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ],

  getTodayAppointments: () => [
    {
      id: 1,
      patient: 'John Smith',
      time: '09:00 AM',
      type: 'Follow-up',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: 'Emily Davis',
      time: '10:30 AM',
      type: 'Check-up',
      status: 'confirmed'
    },
    {
      id: 3,
      patient: 'Robert Wilson',
      time: '02:00 PM',
      type: 'Consultation',
      status: 'pending'
    }
  ],

  // Patient Dashboard Data
  getPatientStats: () => ({
    upcomingAppointments: 2,
    activeRecords: 8,
    lastVisit: '2024-01-10',
    healthScore: 85
  }),

  getPatientRecords: () => [
    {
      id: 1,
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      type: 'General Check-up',
      diagnosis: 'Healthy',
      status: 'completed'
    },
    {
      id: 2,
      date: '2023-12-15',
      doctor: 'Dr. Michael Brown',
      type: 'Blood Test',
      diagnosis: 'Normal levels',
      status: 'completed'
    },
    {
      id: 3,
      date: '2023-11-20',
      doctor: 'Dr. Sarah Johnson',
      type: 'Vaccination',
      diagnosis: 'Flu shot administered',
      status: 'completed'
    }
  ],

  getPatientAppointments: () => [
    {
      id: 1,
      date: '2024-01-20',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      type: 'Follow-up',
      status: 'scheduled'
    },
    {
      id: 2,
      date: '2024-02-05',
      time: '02:30 PM',
      doctor: 'Dr. Michael Brown',
      type: 'Consultation',
      status: 'scheduled'
    }
  ],

  getVitalSigns: () => ({
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 98.6,
    weight: 165,
    height: '5\'10"',
    lastUpdated: '2024-01-10'
  }),

  // Common functions
  addPatient: (patientData) => {
    // Simulate adding a patient
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Patient added successfully',
          patient: {
            id: Date.now(),
            ...patientData,
            createdAt: new Date().toISOString()
          }
        })
      }, 1000)
    })
  },

  updatePatient: (patientId, patientData) => {
    // Simulate updating a patient
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Patient updated successfully',
          patient: {
            id: patientId,
            ...patientData,
            updatedAt: new Date().toISOString()
          }
        })
      }, 1000)
    })
  },

  addMedicalRecord: (recordData) => {
    // Simulate adding a medical record
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Medical record added successfully',
          record: {
            id: Date.now(),
            ...recordData,
            createdAt: new Date().toISOString()
          }
        })
      }, 1000)
    })
  },

  scheduleAppointment: (appointmentData) => {
    // Simulate scheduling an appointment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Appointment scheduled successfully',
          appointment: {
            id: Date.now(),
            ...appointmentData,
            status: 'scheduled',
            createdAt: new Date().toISOString()
          }
        })
      }, 1000)
    })
  },

  addDoctor: async (doctorData) => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    const newDoctor = {
      id: `doctor-${Date.now()}`,
      ...doctorData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patientsCount: 0,
      rating: 5.0
    }
    
    // Add to mock data
    demoDataService.doctors = demoDataService.doctors || []
    demoDataService.doctors.unshift(newDoctor)
    
    // Also add to users list
    const newUser = {
      id: newDoctor.id,
      name: newDoctor.name,
      email: newDoctor.email,
      role: 'doctor',
      status: 'active',
      avatar: newDoctor.avatar,
      lastLogin: new Date().toISOString(),
      createdAt: newDoctor.createdAt
    }
    
    demoDataService.recentUsers = demoDataService.recentUsers || []
    demoDataService.recentUsers.unshift(newUser)
    
    return {
      success: true,
      doctor: newDoctor
    }
  },

  addUser: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    const newUser = {
      id: `${userData.role}-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null
    }
    
    // Add to users list
    demoDataService.users = demoDataService.users || []
    demoDataService.users.unshift(newUser)
    
    // If it's a doctor, also add to doctors list
    if (userData.role === 'doctor') {
      const doctorData = {
        ...newUser,
        patientsCount: 0,
        rating: 5.0,
        consultationFee: userData.consultationFee || 100,
        availableHours: userData.availableHours || 'Mon-Fri 9AM-5PM'
      }
      
      demoDataService.doctors = demoDataService.doctors || []
      demoDataService.doctors.unshift(doctorData)
    }
    
    // If it's a patient, also add to patients list
    if (userData.role === 'patient') {
      const patientData = {
        ...newUser,
        condition: userData.condition || 'General Health',
        lastVisit: new Date().toISOString().split('T')[0],
        status: 'Active',
        age: userData.age || calculateAge(userData.dateOfBirth)
      }
      
      demoDataService.patients = demoDataService.patients || []
      demoDataService.patients.unshift(patientData)
    }
    
    return {
      success: true,
      user: newUser
    }
  },

  calculateAge: (dateOfBirth) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  },

  getRealTimeCounts: () => ({
    totalUsers: demoDataService.users?.length || 0,
    totalPatients: demoDataService.patients?.length || 0,
    totalDoctors: demoDataService.doctors?.length || 0,
    activeUsers: demoDataService.users?.filter(user => user.status === 'active').length || 0
  }),

  // Search functionality
  searchPatients: (query) => {
    const allPatients = demoDataService.getDoctorPatients()
    return allPatients.filter(patient => 
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.condition.toLowerCase().includes(query.toLowerCase())
    )
  },

  searchUsers: (query) => {
    const allUsers = demoDataService.getRecentUsers()
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase())
    )
  }
}

export default demoDataService
