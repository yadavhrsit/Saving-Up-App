import './App.css';
import Signup from './Pages/Signup';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import {Routes,Route} from "react-router-dom"
import ResetPassword from './Pages/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="login" Component={Login}></Route>
        <Route path="signup" Component={Signup}></Route>
        <Route path='/forgot-password' Component={ForgotPassword}/>
        <Route path='/reset-password' Component={ResetPassword}/>
      </Routes>
    </div>
  );
}

export default App;
