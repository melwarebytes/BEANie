import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Encyclopedia from './pages/Encyclopedia'
import BrewGuides from './pages/BrewGuides'
import BeanLibrary from './pages/BeanLibrary'
import CoffeeLab from './pages/CoffeeLab'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import BlogPost from './pages/BlogPost'
import EncyclopediaItem from './pages/EncyclopediaItem'

export default function App(){
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encyclopedia" element={<Encyclopedia/>} />
          <Route path="/encyclopedia/:id" element={<EncyclopediaItem />} />
          <Route path="/brew-guides" element={<BrewGuides/>} />
          <Route path="/beans" element={<BeanLibrary/>} />
          <Route path="/coffee-lab" element={<CoffeeLab/>} />
          <Route path="/blog" element={<Blog/>} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}