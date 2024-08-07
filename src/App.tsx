import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignupForm from "../src/pages/SignupForm";
import LoginForm from "../src/pages/LoginForm";
import TimeStamp from './pages/TimeStamp';
import SummaryTime from "../src/pages/SummaryTime";
import Users from "./pages/Users";
import Button from './pages/Button';



function App() {


  return (
    <>
    <Routes> 
      <Route path='/' element={<LoginForm />}/> 
      <Route path='/signup' element={<SignupForm />}/>
     <Route path='/timestamp' element={<TimeStamp/>}/>
     <Route path='/summary' element={<SummaryTime/>}/> 
     <Route path='/users' element={<Users/>}/> 
     <Route path='/button' element={<Button/>}/> 
     </Routes>
    </>
  )
}

export default App;
