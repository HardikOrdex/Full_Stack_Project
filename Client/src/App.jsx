import "./App.css";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from "./AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" />
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
