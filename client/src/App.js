import './App.css';
import Signup from './Pages/Signup';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import {Routes,Route} from "react-router-dom"
import ResetPassword from './Pages/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div className="App flex flex-col bg-gray-200 ">
      <Navbar />
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/dashboard" Component={Dashboard}></Route>
        <Route path="login" Component={Login}></Route>
        <Route path="signup" Component={Signup}></Route>
        <Route path="/forgot-password" Component={ForgotPassword} />
        <Route path="/reset-password" Component={ResetPassword} />
      </Routes>
    </div>
  );
}

export default App;
