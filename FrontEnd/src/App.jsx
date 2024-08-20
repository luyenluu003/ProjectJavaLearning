import { Route, Routes } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import './index.css'; 
import Home from "./pages/home";
import Login from "./auth/login";
import Register from "./auth/register";
import Profile from "./pages/profile";
import UsersService from "./service/usersService";
import UserManagement from "./pages/userManagement";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />}/>
        <Route path="/login" exact element={<Login />}/>
        <Route path="/register" exact element={<Register />}/>
        <Route path="/profile" exact element={<Profile />}/>
        {UsersService.adminOnly() && (
          <>
            <Route path="/services" exact element={<UserManagement />}/>
          </>
        )}
      </Routes>
    
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default App;
