import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import Dashboards from "./pages/Dashboards/Dashboard.jsx";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/dashboard" element={<Dashboards />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
