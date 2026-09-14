import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import Dashboards from "./pages/Dashboards/Dashboard.jsx";
import RegisterCertificate from "./pages/RegisterCertificate/RegisterCertificate.jsx";
import Certificates from "./pages/Certificates/Certificates.jsx";
import CertificateDetails from "./pages/CertificateDetails/CertificateDetails.jsx";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboards />} />
        <Route path="/registerCertificate" element={<RegisterCertificate />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/certificates/:id" element={<CertificateDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
