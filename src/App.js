import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/Styles/Theme.css";
import Home from "./Components/Home/Home";
import HospitalSignIn from "./Components/HospitalSignIn/HospitalSignIn";
import Dashboard from "./Components/Dashboard/MainDashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import About from "./Components/About/About";
import Contact from "./Components/ContactUs/Contact";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hospital-signin" element={<HospitalSignIn />} />
          <Route
            path="/dashboard/:userId"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
