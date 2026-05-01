import React, { useState, useEffect } from 'react';
import InvestorCard from '../components/InvestorCard';
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import { db } from '../firebase'; 

function InvestorsView() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const fetchInvestors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "investors"));
      const investorsData = [];
      querySnapshot.forEach((doc) => {
        investorsData.push({ id: doc.id, ...doc.data() });
      });
      setInvestors(investorsData);
      setLoading(false);
    } catch (error) {
      console.error("Помилка при завантаженні інвесторів:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleAddInvestor = async (e) => {
    e.preventDefault(); 
    if (newName.trim() === '' || newBudget.trim() === '') return;

    try {
      await addDoc(collection(db, "investors"), {
        name: newName,
        budget: newBudget
      });
      
      setNewName('');
      setNewBudget('');
      
      fetchInvestors();
      alert("Інвестора успішно додано!");
    } catch (error) {
      console.error("Помилка при додаванні інвестора:", error);
      alert("Помилка: " + error.message);
    }
  };

  return (
    <section id="investors">
      <h2>Інвестори</h2>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '400px', margin: '0 auto 30px' }}>
        <h3>Додати інвестора</h3>
        <form onSubmit={handleAddInvestor} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Ім'я інвестора (напр. Ілон Маск)" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <input 
            type="text" 
            placeholder="Бюджет (напр. $1 млрд)" 
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            Додати в базу
          </button>
        </form>
      </div>
      
      {loading ? (
        <p style={{ textAlign: 'center' }}>Завантаження даних з бази...</p>
      ) : investors.length > 0 ? (
        <div className="grid-container">
          {investors.map(i => (
            <InvestorCard 
              key={i.id} 
              name={i.name} 
              budget={i.budget} 
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Наразі інвесторів у базі немає.</p>
      )}
    </section>
  );
}

export default InvestorsView;