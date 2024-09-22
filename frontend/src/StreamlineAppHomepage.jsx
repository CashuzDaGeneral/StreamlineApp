import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, DollarSign, BarChart2, Smartphone, Zap, Users, FileText, Package, Sun, Moon } from 'lucide-react'
import PropTypes from 'prop-types'

const IsometricIcon = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="w-32 h-32 sm:w-40 sm:h-40 cursor-pointer relative"
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="w-full h-full" style={{ transform: "rotateX(60deg) rotateZ(-45deg)" }}>
        <div className="absolute inset-0 bg-blue-500 opacity-50" style={{ transform: "translateZ(20px)" }} />
        <div className="absolute inset-0 bg-blue-600 opacity-50" style={{ transform: "rotateY(-90deg) translateZ(20px)" }} />
        <div className="absolute inset-0 bg-blue-400 opacity-50" style={{ transform: "rotateX(90deg) translateZ(20px)" }} />
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(40px)" }}>
          {icon}
        </div>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-blue-900 bg-opacity-90 flex flex-col items-center justify-center p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-white text-center text-sm font-bold mb-1">{title}</p>
            <p className="text-white text-center text-xs">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

IsometricIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

const HomePage = () => {
  const [glowOpacity, setGlowOpacity] = useState(0.5)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowOpacity((prev) => (prev === 0.5 ? 0.7 : 0.5))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // You would also update your Tailwind classes here
  }

  const changeLanguage = (lang) => {
    setSelectedLanguage(lang)
    // You would implement your localization logic here
  }

  const features = [
    { icon: <DollarSign size={40} className="text-green-400" />, title: "Save Money", description: "Optimize your development costs" },
    { icon: <BarChart2 size={40} className="text-green-400" />, title: "Track Progress", description: "Monitor your project's advancement" },
    { icon: <Zap size={40} className="text-green-400" />, title: "AI-Powered", description: "Leverage AI for smarter development" },
    { icon: <Users size={40} className="text-green-400" />, title: "Collaboration", description: "Work seamlessly with your team" },
    { icon: <Smartphone size={40} className="text-green-400" />, title: "Mobile Access", description: "Develop on-the-go with mobile support" },
    { icon: <FileText size={40} className="text-green-400" />, title: "Documentation", description: "Access comprehensive guides" },
    { icon: <Package size={40} className="text-green-400" />, title: "Package Management", description: "Easily manage your dependencies" },
    { icon: <Check size={40} className="text-green-400" />, title: "Quality Assurance", description: "Ensure top-notch code quality" },
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} overflow-hidden`}>
      {/* Rest of the component code... */}
    </div>
  )
}

export default HomePage
