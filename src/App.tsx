import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AudioProvider } from './components/audio/AudioProvider'
import { MovementNav } from './components/chrome/MovementNav'
import { StageAtmosphere } from './components/chrome/StageAtmosphere'
import { GrainOverlay } from './components/chrome/GrainOverlay'
import { ScrollProgress } from './components/chrome/ScrollProgress'
import { CurtainTransition } from './components/chrome/CurtainTransition'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { MediaPage } from './pages/MediaPage'
import { ContactPage } from './pages/ContactPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppRoutes() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <StageAtmosphere />
      <GrainOverlay />
      <div className="vignette" aria-hidden />
      <ScrollProgress />
      <MovementNav />
      <div className="with-rail relative z-10">
        <main id="main">
          <CurtainTransition>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </CurtainTransition>
        </main>
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AudioProvider>
        <AppRoutes />
      </AudioProvider>
    </BrowserRouter>
  )
}
