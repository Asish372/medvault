import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Lock,
  Phone,
  Sun,
  Moon,
  Activity,
  Calendar,
  Star
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import AnimatedCounter from '../components/AnimatedCounter'

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme()
  const statsRef = useRef(null)
  const [isStatsVisible, setIsStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStatsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        {theme === 'dark' ? (
          <Sun className="h-6 w-6 text-yellow-400" />
        ) : (
          <Moon className="h-6 w-6 text-slate-600" />
        )}
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* Unique MedVault Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-24 h-24 border-4 border-teal-400 rounded-full animate-spin opacity-60"></div>
                
                {/* Middle rotating ring */}
                <div className="absolute inset-2 w-20 h-20 border-3 border-emerald-400 rounded-full animate-reverse-spin opacity-80"></div>
                
                {/* Central medical symbol container */}
                <div className="absolute inset-4 w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                  {/* DNA helix inspired design */}
                  <div className="relative">
                    <Heart className="h-8 w-8 text-white animate-pulse" />
                    {/* Floating particles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-500"></div>
                  </div>
                </div>
                
                {/* Glowing background */}
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                MedVault
              </span>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6"
          >
            Secure Patient Records
            <span className="block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Management System
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Streamline healthcare operations with our comprehensive, HIPAA-compliant 
            patient record management system designed for modern healthcare facilities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-teal-600 text-teal-600 dark:text-teal-400 font-semibold rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 text-slate-600 dark:text-slate-400"
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium">256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-cyan-600" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">10,000+ Users</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Why Choose MedVault?
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the future of healthcare management with our cutting-edge features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Advanced encryption and security protocols protect sensitive patient data",
                color: "from-blue-500 to-indigo-600",
                bgColor: "from-blue-50 to-indigo-100",
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&crop=center"
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Customizable permissions for admins, doctors, and patients",
                color: "from-emerald-500 to-teal-600",
                bgColor: "from-emerald-50 to-teal-100",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&crop=center"
              },
              {
                icon: Activity,
                title: "Real-Time Updates",
                description: "Instant synchronization across all devices and platforms",
                color: "from-purple-500 to-pink-600",
                bgColor: "from-purple-50 to-pink-100",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop&crop=center"
              },
              {
                icon: FileText,
                title: "Digital Records",
                description: "Paperless system with easy search and retrieval capabilities",
                color: "from-orange-500 to-red-600",
                bgColor: "from-orange-50 to-red-100",
                image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop&crop=center"
              },
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "Intelligent appointment booking and management system",
                color: "from-cyan-500 to-blue-600",
                bgColor: "from-cyan-50 to-blue-100",
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop&crop=center"
              },
              {
                icon: Heart,
                title: "Patient Care Focus",
                description: "Designed to improve patient outcomes and care quality",
                color: "from-rose-500 to-pink-600",
                bgColor: "from-rose-50 to-pink-100",
                image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer"
              >
                {/* Feature Image with Better Visibility */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-110 contrast-105"
                    loading="lazy"
                  />
                  {/* Reduced opacity overlay for better photo visibility */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.bgColor} opacity-40 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-500"></div>
                  
                  {/* Enhanced Icon overlay */}
                  <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Floating animation elements */}
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Enhanced Content */}
                <div className="p-6 relative">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 group-hover:bg-clip-text dark:group-hover:from-white dark:group-hover:to-slate-200 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Animated bottom border */}
                  <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with Better Animations */}
      <section ref={statsRef} className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:to-emerald-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-400/5 to-indigo-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300">
              Join thousands of healthcare providers who trust MedVault
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: 10000, suffix: '+', label: 'Patients Managed', delay: 0, color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-100', icon: Users },
              { number: 500, suffix: '+', label: 'Healthcare Providers', delay: 200, color: 'from-emerald-500 to-teal-600', bgColor: 'from-emerald-50 to-teal-100', icon: Heart },
              { number: 99.9, suffix: '%', label: 'System Uptime', delay: 400, color: 'from-purple-500 to-pink-600', bgColor: 'from-purple-50 to-pink-100', icon: Activity },
              { number: 24, suffix: '/7', label: 'Support Available', delay: 600, color: 'from-orange-500 to-red-600', bgColor: 'from-orange-50 to-red-100', icon: Shield }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className={`text-center bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${stat.bgColor} dark:from-gray-800 dark:to-gray-700 group cursor-pointer relative overflow-hidden`}
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>

                <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {isStatsVisible && (
                    <AnimatedCounter 
                      value={stat.number} 
                      duration={2500}
                      delay={stat.delay}
                    />
                  )}
                  {stat.suffix}
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-semibold group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                  {stat.label}
                </div>

                {/* Animated particles */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Practice?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of healthcare professionals who have already revolutionized their patient care with MedVault.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200">
                <Phone className="mr-2 h-5 w-5" />
                Schedule Demo
              </button>
            </div>
            
            {/* Additional Trust Elements */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span className="text-sm">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">30-Day Money Back</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">MedVault</h3>
                  <p className="text-slate-400 text-sm">Healthcare Management</p>
                </div>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Secure, efficient, and user-friendly patient record management system designed for modern healthcare facilities.
              </p>
              <div className="space-y-2">
                <p className="text-slate-500 text-sm">
                  Created by <span className="text-teal-400 font-semibold">Asish Bindhani</span>
                </p>
                <p className="text-slate-500 text-sm">
                  📧 Email: <span className="text-teal-400">work.asishbindhani@gmail.com</span>
                </p>
                <p className="text-slate-500 text-sm">
                  📱 Phone: <span className="text-teal-400">+919337256379</span>
                </p>
                <p className="text-slate-500 text-sm">
                  💼 Work: <span className="text-teal-400">Healthcare Technology Solutions</span>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/features" className="hover:text-teal-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-teal-400 transition-colors">Security</Link></li>
                <li><Link to="/integrations" className="hover:text-teal-400 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/help" className="hover:text-teal-400 transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 MedVault. All rights reserved. Built with ❤️ for healthcare professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
