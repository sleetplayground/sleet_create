import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/account">Account</Link>
        <Link to="/sub">Sub Account</Link>
      </div>
      <div className="copyright">Copyright 2025 by SLEET</div>
    </footer>
  );
};

export default Footer;