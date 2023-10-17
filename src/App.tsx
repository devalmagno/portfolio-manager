import Router from './Router'

import AuthProvider from './contexts/AuthContext'

import './App.scss'

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

export default App
