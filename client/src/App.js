import './App.css';
import Signup from './Pages/Signup';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import {Routes,Route} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="login" Component={Login}></Route>
        <Route path="signup" Component={Signup}></Route>
      </Routes>
    </div>
  );
}

export default App;
