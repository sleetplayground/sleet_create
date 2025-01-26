import { Link } from 'react-router-dom';
import '../styles/index.css';
import '../styles/colors.css';
import '../styles/fonts.css';
import '../styles/layout.css';
import '../styles/buttons.css';
import '../styles/footer.css';
import '../styles/header.css';

const Home = () => {
  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Sleet Account</h1>
          <p>near account creation playground</p>
        </div>
      </header>
      
      <article className="main-content">
        <p>what do you want to create?</p>
        <Link to="/account" className="button">Account</Link>
        <Link to="/sub" className="button">Sub Account</Link>
        <p>
          This is a playground project by Sleet,
          only use this tool if you know what you are doing.
        </p>
      </article>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/account">Account</Link>
          <Link to="/sub">Sub Account</Link>
        </div>
        <div className="copyright">Copyright 2025 by SLEET</div>
      </footer>
    </div>
  );
};

export default Home;