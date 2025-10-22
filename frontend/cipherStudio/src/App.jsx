import './App.css'
import Login from './components/Login'
import {useAppContext} from './context/AppContext'
import {Toaster} from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';

function App() {
  const {showLogin, user, setShowLogin, logout} = useAppContext();

  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:projectId" element={<Editor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App