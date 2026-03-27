import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MyStartup from './views/MyStartup';
import CompetitorView from './views/CompetitorView';
import InvestorsView from './views/InvestorsView';
import './App.css';

function App() {
  return (
    <Router basename="/lab3">
      <div id="app">
        <header>
          <h1>Startup Simulator</h1>
          <nav>
            <ul>
              <li><Link to="/">Мій стартап</Link></li>
              <li><Link to="/market">Ринок</Link></li>
              <li><Link to="/investors">Інвестори</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<MyStartup />} />
            <Route path="/market" element={<CompetitorView />} />
            <Route path="/investors" element={<InvestorsView />} />
          </Routes>
        </main>

        <footer>
          <h3>Контактна інформація:</h3>
          <p>Телефон: +380*********</p>
          <p>Пошта: danylo.piantkivskyi.oi.2024@lpnu.ua</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
