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
        console.log("User ID:", user.uid); 
        console.log("Email:", user.email); 
      } else {
        setCurrentUser(null);
        console.log("No user is currently signed in."); 
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
        
        <div style={{ 
          border: '2px dashed #4CAF50', 
          padding: '20px', 
          margin: '20px auto',
          maxWidth: '600px',
          backgroundColor: '#f9fff9'
        }}>
          <h3>Сторінка "Мій стартап"</h3>
          <p>Тут буде інтерфейс управління твоїм бізнесом. Цей блок надійно захищений!</p>
        </div>

        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
        >
          Вийти з системи
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
      <h2>{isLoginMode ? 'Вхід в систему' : 'Реєстрація'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Ваш Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Пароль (мінімум 6 символів)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isLoginMode ? 'Увійти' : 'Зареєструватись'}
        </button>
      </form>

      <p style={{ marginTop: '15px', fontSize: '14px', textAlign: 'center' }}>
        {isLoginMode ? 'Ще не маєте акаунту? ' : 'Вже зареєстровані? '}
        <span 
          style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }} 
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? 'Створити акаунт' : 'Увійти'}
        </span>
      </p>
    </div>
  );
};

export default Auth;