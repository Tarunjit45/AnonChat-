import React, { useState, useEffect } from 'react';
import { ChatRoom } from './components/ChatRoom';
import { CategorySelector } from './components/CategorySelector';
import { BootSequence } from './components/BootSequence';
import { UserSession, Category } from './types';

function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem('anon_id');
    const storedName = localStorage.getItem('anon_name');

    if (storedId && storedName) {
      setUser({ id: storedId, username: storedName });
    } else {
      const newId = crypto.randomUUID();
      // Generate a more "hacker-like" ID
      const newName = `USR-${Math.floor(Math.random() * 900000) + 100000}`;

      localStorage.setItem('anon_id', newId);
      localStorage.setItem('anon_name', newName);
      
      setUser({ id: newId, username: newName });
    }
  }, []);

  // Show boot sequence only on first load
  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  if (!user) return null;

  if (!selectedCategory) {
    return (
      <CategorySelector 
        onSelectCategory={(category) => setSelectedCategory(category)} 
      />
    );
  }

  return (
    <ChatRoom 
      user={user} 
      category={selectedCategory} 
      onLeave={() => setSelectedCategory(null)} 
    />
  );
}

export default App;