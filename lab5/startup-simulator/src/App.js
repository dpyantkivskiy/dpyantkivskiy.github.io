import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Auth from './components/Auth';
import MyStartup from './views/MyStartup';
import CompetitorView from './views/CompetitorView';
import InvestorsView from './views/InvestorsView';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  return (
    <Router>
      <div id="app">
        <header>
          <h1>Startup Simulator</h1>
          <nav>
            {/* Меню тепер жорстко по центру, всі елементи на одному рівні */}
            <ul style={{ display: 'flex', gap: '35px', alignItems: 'center', justifyContent: 'center', listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: '800px' }}>
              <li><Link to="/">Мій стартап</Link></li>
              <li><Link to="/market">Ринок</Link></li>
              <li><Link to="/investors">Інвестори</Link></li>

              {currentUser && (
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      color: '#ff4d4d',
                      fontSize: '17px',
                      fontWeight: 'bold',
                      fontFamily: 'inherit',
                      padding: '0',
                      margin: '0'
                    }}
                  >
                    Вийти
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={currentUser ? <MyStartup /> : <Auth />} />
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