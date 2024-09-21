"use client"

import { motion, useAnimation } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Check, DollarSign, Shield, FileText, Zap, Users, Smartphone, BarChart2, Plus } from 'lucide-react'

const IsometricIcon = ({ children, x, y, index, title }) => (
  <motion.div
    className="absolute w-32 h-32 sm:w-40 sm:h-40"
    style={{
      x,
      y,
      perspective: '1000px',
    }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
  >
    <motion.div
      className="w-full h-full cursor-pointer group"
      style={{
        transformStyle: 'preserve-3d',
        transform: 'rotateX(60deg) rotateZ(-45deg)',
      }}
      whileHover={{ scale: 1.1 }}
    >
      <div className="absolute inset-0 bg-blue-500 bg-opacity-50 border-2 border-blue-300" style={{ transform: 'translateZ(20px)' }} />
      <div className="absolute inset-0 bg-blue-600 bg-opacity-50 border-2 border-blue-300" style={{ transform: 'rotateY(-90deg) translateZ(20px)' }} />
      <div className="absolute inset-0 bg-blue-400 bg-opacity-50 border-2 border-blue-300" style={{ transform: 'rotateX(90deg) translateZ(20px)' }} />
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(40px)' }}>
        {children}
      </div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-blue-900 bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ transform: 'translateZ(40px)' }}
      >
        <p className="text-white text-center text-sm">{title}</p>
      </motion.div>
    </motion.div>
  </motion.div>
)

const MovingDot = ({ targets }) => {
  const controls = useAnimation()

  useEffect(() => {
    const animate = async () => {
      while (true) {
        const currentTarget = targets[Math.floor(Math.random() * targets.length)]
        await controls.start({
          x: currentTarget.x + Math.random() * 40,
          y: currentTarget.y + Math.random() * 40,
          transition: { duration: 2, type: 'spring' }
        })
      }
    }
    animate()
  }, [controls, targets])

  return (
    <motion.div
      className="absolute w-2 h-2 bg-green-400 rounded-full"
      animate={controls}
      initial={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
    />
  )
}

export default function StreamlineAppHomepage() {
  const [dots, setDots] = useState([])
  const [glowOpacity, setGlowOpacity] = useState(0.5)
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1200, height: typeof window !== 'undefined' ? window.innerHeight : 800 })
  const [showCustomComponentModal, setShowCustomComponentModal] = useState(false)
  const [customComponentName, setCustomComponentName] = useState('')
  const [customComponentProperties, setCustomComponentProperties] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setDots(Array.from({ length: 20 }, (_, i) => i))

    const interval = setInterval(() => {
      setGlowOpacity((prev) => (prev === 0.5 ? 0.7 : 0.5))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const iconPositions = [
    { x: 20, y: 20 },
    { x: windowSize.width - 180, y: 20 },
    { x: 20, y: windowSize.height - 180 },
    { x: windowSize.width - 180, y: windowSize.height - 180 },
    { x: windowSize.width / 4 - 70, y: windowSize.height / 2 - 200 },
    { x: (windowSize.width / 4) * 3 - 70, y: windowSize.height / 2 - 200 },
    { x: windowSize.width / 4 - 70, y: windowSize.height / 2 + 60 },
    { x: (windowSize.width / 4) * 3 - 70, y: windowSize.height / 2 + 60 },
  ]

  const handleCreateCustomComponent = async () => {
    try {
      const response = await fetch('/api/custom_component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customComponentName,
          properties: customComponentProperties.split(',').map(prop => prop.trim()),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Custom component "${data.name}" created successfully!`);
        setShowCustomComponentModal(false);
        setCustomComponentName('');
        setCustomComponentProperties('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating custom component:', error);
      alert('An error occurred while creating the custom component.');
    }
  };

  return (
    <div className="relative w-screen h-screen bg-gray-900 overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-blue-400 rounded-full filter blur-3xl"
        style={{ opacity: glowOpacity }}
      />

      <IsometricIcon x={iconPositions[0].x} y={iconPositions[0].y} index={0} title="Save Money">
        <DollarSign size={40} className="text-green-400" />
      </IsometricIcon>

      <IsometricIcon x={iconPositions[1].x} y={iconPositions[1].y} index={1} title="Track Progress">
        <BarChart2 size={40} className="text-green-400" />
      </IsometricIcon>

      <IsometricIcon x={iconPositions[2].x} y={iconPositions[2].y} index={2} title="Achieve Goals">
        <Check size={40} className="text-green-400" />
      </IsometricIcon>

      <IsometricIcon x={iconPositions[3].x} y={iconPositions[3].y} index={3} title="Mobile Access">
        <Smartphone size={40} className="text-green-400" />
      </IsometricIcon>

      <IsometricIcon x={iconPositions[4].x} y={iconPositions[4].y} index={4} title="AI-Powered">
        <Zap size={40} className="text-green-400" />
      </IsometricIcon>

      <IsometricIcon x={iconPositions[5].x} y={iconPositions[5].y} index={5} title="Collaboration">
        <Users size={40} className="text-green-400" />
      </IsometricIcon>

      <IsometricIcon x={iconPositions[6].x} y={iconPositions[6].y} index={6} title="Secure">
        <Shield size={40} className="text-green-400" />
      </IsometricIcon>

      <IsometricIcon x={iconPositions[7].x} y={iconPositions[7].y} index={7} title="Documentation">
        <FileText size={40} className="text-green-400" />
      </IsometricIcon>

      <motion.div
        className="absolute w-64 h-112 sm:w-80 sm:h-128 bg-black rounded-3xl border-4 border-blue-400 overflow-hidden"
        style={{
          x: windowSize.width / 2 - 160,
          y: windowSize.height / 2 - 256,
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="w-full h-6 bg-gray-800 rounded-t-3xl" />
        <div className="w-full h-full flex flex-col items-center justify-start p-6 relative">
          <h1 className="text-3xl font-bold mb-4 mt-8">Streamline</h1>
          <motion.div
            className="w-32 h-32 bg-blue-600 rounded-full mb-4 flex items-center justify-center relative overflow-hidden"
            animate={{ rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 opacity-50" />
            <Check size={60} className="text-white" />
          </motion.div>
          <p className="text-center mb-4">Simplify Your Development</p>
          <motion.button
            className="bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.div>

      {dots.map((id) => (
        <MovingDot key={id} targets={iconPositions} />
      ))}

      <div className="absolute bottom-4 left-4 text-sm text-blue-300">
        © 2023 Streamline App. All rights reserved.
      </div>

      <nav className="absolute top-4 right-4">
        <ul className="flex space-x-2 sm:space-x-6">
          {['Features', 'Pricing', 'Docs', 'About'].map((item) => (
            <li key={item}>
              <a href="#" className="text-blue-300 hover:text-green-400 transition-colors text-sm sm:text-base">{item}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute left-4 right-4 bottom-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Revolutionize Your App Development</h2>
        <p className="text-sm sm:text-base mb-6">From concept to deployment, faster than ever before with AI-powered assistance and seamless collaboration.</p>
        <motion.button
          className="bg-green-400 text-blue-900 px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-lg mr-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Streamlining Now
        </motion.button>
        <motion.button
          className="bg-blue-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCustomComponentModal(true)}
        >
          Create Custom Component
        </motion.button>
      </div>

      {showCustomComponentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Custom Component</h2>
            <input
              type="text"
              placeholder="Component Name"
              className="w-full p-2 mb-4 border rounded text-gray-800"
              value={customComponentName}
              onChange={(e) => setCustomComponentName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Properties (comma-separated)"
              className="w-full p-2 mb-4 border rounded text-gray-800"
              value={customComponentProperties}
              onChange={(e) => setCustomComponentProperties(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={() => setShowCustomComponentModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateCustomComponent}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
