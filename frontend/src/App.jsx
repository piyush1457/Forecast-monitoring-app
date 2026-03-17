import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto pb-12">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
