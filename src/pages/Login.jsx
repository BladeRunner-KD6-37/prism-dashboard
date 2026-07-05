import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import loginBg from '../assets/login-bg.mp4'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/products/home';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(username, password)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') {
      setUsername('admin')
      setPassword('admin123')
    } else {
      setUsername('user')
      setPassword('user123')
    }
  }

  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-black overflow-hidden px-4">
      {/* Fullscreen Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-fill z-0"
      >
        <source src={loginBg} type="video/mp4" />
      </video>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* Glossy & Translucent Login Card */}
      <div className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h1 className="text-3xl font-extrabold mb-1 text-center text-white tracking-wide">Prism</h1>
        <p className="text-sm text-gray-200 text-center mb-6 font-light">Sign in to your dashboard</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1 tracking-wider uppercase">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-300
                         focus:outline-none focus:ring-2 focus:ring-[#FFD232] focus:bg-white/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1 tracking-wider uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-300
                         focus:outline-none focus:ring-2 focus:ring-[#FFD232] focus:bg-white/20 transition-all"
              required
            />
          </div>

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#FFD232] text-[#4E5664] py-2 rounded-xl text-sm font-bold hover:bg-[#ffe066] active:scale-95 transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-300 text-center mb-2 font-medium">Demo accounts</p>
          <div className="flex gap-2">
            <button
              onClick={() => fillDemo('admin')}
              className="flex-1 text-xs py-1.5 border border-white/20 rounded-xl hover:bg-white/10 text-white font-medium transition-all cursor-pointer"
            >
              Fill Admin
            </button>
            <button
              onClick={() => fillDemo('user')}
              className="flex-1 text-xs py-1.5 border border-white/20 rounded-xl hover:bg-white/10 text-white font-medium transition-all cursor-pointer"
            >
              Fill User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login