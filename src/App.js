import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Home from './Components/Home/Home';
import Mapa from './Components/Mapa/Mapa';
import Sobre from './Components/Sobre/Sobre';
import Contato from './Components/Contato/Contato';

export default function App() {
  return (
    <body>
        <Header/>
        <Nav/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/mapa' element={<Mapa/>}/>
          <Route path='/sobre' element={<Sobre/>}/>
          <Route path='/contato' element={<Contato/>}/>
        </Routes>
        <Footer/>
    </body>
  );
}