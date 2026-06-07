import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/index.tsx'
import Providers from './app/provider.tsx'

createRoot(document.getElementById('root')!).render(
  <Providers>
    <AppRoutes />
  </Providers>
)
