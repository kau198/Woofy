import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { BrowserRouter } from 'react-router-dom'
import { WoofyProvider } from './contexts/WoofyContext'
import App from './App'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource-variable/fraunces/wght.css'
import '@fontsource-variable/fraunces/wght-italic.css'
import './index.css'
import './woofy-refresh.css'

const basename = import.meta.env.BASE_URL === '/'
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <BrowserRouter basename={basename}>
          <WoofyProvider>
            <App />
          </WoofyProvider>
        </BrowserRouter>
      </LazyMotion>
    </MotionConfig>
  </StrictMode>,
)
