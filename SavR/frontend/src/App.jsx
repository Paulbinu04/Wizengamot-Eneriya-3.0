import './App.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SenderPage from './pages/SenderPage';
import ReceiverPage from './pages/ReceiverPage';
import NavBar from './components/NavBar';
// import Dashboard from './pages/Dashboard';
function App() {


  return (
    <>
      
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />}/> 
          <Route path="/sender" element={<><NavBar/><SenderPage /></>}/> 
          <Route path="/receiver" element={<><NavBar/><ReceiverPage /></>}/> 
          {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
      </Routes>
    </BrowserRouter>
      
    </>
  );
}

export default App
