import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Помилка при виході: " + error.message);
    }
  };

  if (currentUser) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Ласкаво просимо до Симулятора Стартапу!</h2>
        <p>Ви авторизовані як: <strong>{currentUser.email}</strong></p>
        
        <div style={{ border: '2px dashed #4CAF50', padding: '20px', margin: '20px auto', maxWidth: '600px', backgroundColor: '#f9fff9' }}>
          <h3>Сторінка "Мій стартап"</h3>
          <p>Тут буде інтерфейс управління твоїм бізнесом. Цей блок надійно захищений!</p>
        </div>

        <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>
          Вийти з системи
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', maxWidth: '400px', margin: '40px auto', backgroundColor: '#fdfdfd', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}>
      <h2 style={{ marginTop: '0', textAlign: 'center', color: '#333', marginBottom: '25px' }}>
        {isLoginMode ? 'Вхід в систему' : 'Реєстрація'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Ваш Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', width: '100%', fontSize: '15px' }}
        />
        <input 
          type="password" 
          placeholder="Пароль (мінімум 6 символів)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', width: '100%', fontSize: '15px' }}
        />
        <button type="submit" style={{ padding: '14px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', transition: '0.2s', marginTop: '10px', width: '100%' }}>
          {isLoginMode ? 'Увійти' : 'Зареєструватись'}
        </button>
      </form>

      <p style={{ marginTop: '25px', fontSize: '15px', textAlign: 'center', color: '#555' }}>
        {isLoginMode ? 'Ще не маєте акаунту? ' : 'Вже зареєстровані? '}
        <span 
          style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }} 
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? 'Створити акаунт' : 'Увійти'}
        </span>
      </p>
    </div>
  );
};

export default Auth;