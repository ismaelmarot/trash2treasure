import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthProvider } from './context/AuthContext'
import { PWASetup } from './components/PWASetup'


function App() {
  return (
    <AuthProvider>
      <PWASetup />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}


export default App