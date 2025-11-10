import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header/Header';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Home from './Components/Home/Home';
import Mapa from './Components/Mapa/Mapa';
import Sobre from './Components/Sobre/Sobre';
import Contato from './Components/Contato/Contato';
import Cadastro from './Components/Cadastro/Cadastro';
import Login from './Components/Login/Login';
import CadDenuncia from './Components/CadDenuncias/CadDenuncia';

export default function App() {

  const location = useLocation();

  const isCadastro = location.pathname === "/cadastro";
  const isLogin = location.pathname === "/login";

  if(isCadastro) {
    return <Cadastro/>
  }
  if(isLogin) {
    return <Login/>
  }

  return (
    <body>
        <Header/>
        <Nav/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/mapa' element={<Mapa/>}/>
          <Route path='/sobre' element={<Sobre/>}/>
          <Route path='/contato' element={<Contato/>}/>
          <Route path='/cadastro' element={<Cadastro/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/cdenuncia' element={<CadDenuncia/>}/>
        </Routes>
        <Footer/>
    </body>
  );
}