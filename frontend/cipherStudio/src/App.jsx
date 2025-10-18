import './App.css'
import Login from './components/Login'
import {useAppContext} from './context/AppContext'
import {Toaster} from 'react-hot-toast'

function App() {
  const {showLogin, user, setShowLogin, logout} = useAppContext();

  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to CipherStudio</h1>
        
        {user ? (
          <div className="text-center">
            <p className="text-xl mb-4">Hello, {user.firstName} {user.lastName}!</p>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button 
              onClick={logout} 
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>
    </>
  )
}

export default App