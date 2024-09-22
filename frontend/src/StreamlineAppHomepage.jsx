"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, DollarSign, BarChart2, Smartphone, Zap, Users, FileText, Package, Sun, Moon } from 'lucide-react'

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
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Streamline App</h1>
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              {['Features', 'Pricing', 'Docs', 'About'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-800 text-white">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <select
              value={selectedLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-gray-800 text-white rounded p-1"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </nav>

        <div className="relative">
          <div
            className="absolute inset-0 bg-blue-400 rounded-full filter blur-3xl"
            style={{ opacity: glowOpacity }}
          />
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {features.map((feature, index) => (
              <IsometricIcon
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
            <motion.div
              className="col-start-2 row-start-1 row-span-2 w-full max-w-sm mx-auto bg-black rounded-3xl overflow-hidden border-4 border-blue-400"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-6 bg-gray-800 rounded-t-3xl" />
              <div className="p-6 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4">Streamline</h2>
                <motion.div
                  className="w-32 h-32 bg-blue-600 rounded-2xl flex items-center justify-center mb-6"
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Check size={64} className="text-green-400" />
                </motion.div>
                <p className="text-center mb-6">Simplify Your Development Process</p>
                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-full font-semibold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert("Get Started clicked! Add your onboarding logic here.")}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Revolutionize Your App Development</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            From concept to deployment, faster than ever before. Streamline App combines low-code ease with professional-grade tools, AI-powered assistance, and seamless collaboration features.
          </p>
          <motion.button
            className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-lg mr-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Start Streamlining Now clicked! Add your action logic here.")}
          >
            Start Streamlining Now
          </motion.button>
          <motion.button
            className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Watch Demo clicked! Add your demo video logic here.")}
          >
            Watch Demo
          </motion.button>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-4 text-center">Stay Updated</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert("Newsletter signup logic here!") }} className="flex justify-center">
            <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l-full w-64 text-gray-900" />
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-r-full">Subscribe</button>
          </form>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          © 2023 Streamline App. All rights reserved.
          <div className="mt-2">
            <a href="#" className="mx-2 hover:text-blue-400">Twitter</a>
            <a href="#" className="mx-2 hover:text-blue-400">LinkedIn</a>
            <a href="#" className="mx-2 hover:text-blue-400">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
