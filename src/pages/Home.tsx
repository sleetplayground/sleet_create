import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../css/index.css';
import '../css/colors.css';
import '../css/fonts.css';
import '../css/layout.css';
import '../css/buttons.css';
import '../css/footer.css';
import '../css/header.css';

const Home = () => {
  return (
    <Layout>
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

    </Layout>
  );
};

export default Home;