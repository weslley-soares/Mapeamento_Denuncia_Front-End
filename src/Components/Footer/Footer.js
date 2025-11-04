import './Footer.css';

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Secretaria do Meio Ambiente - João Pessoa</p>
      </div>
    </footer>
  )
}