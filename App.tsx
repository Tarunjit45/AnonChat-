import React, { useState, useEffect } from 'react';
import { ChatRoom } from './components/ChatRoom';
import { CategorySelector } from './components/CategorySelector';
import { UserSession, Category } from './types';

function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Check for existing session or create new one
    const storedId = localStorage.getItem('anon_id');
    const storedName = localStorage.getItem('anon_name');

    if (storedId && storedName) {
      setUser({ id: storedId, username: storedName });
    } else {
      // Generate random ID
      const newId = crypto.randomUUID();
      // Generate random generic username like User-a19f
      const randomSuffix = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
      const newName = `User-${randomSuffix}`;

      localStorage.setItem('anon_id', newId);
      localStorage.setItem('anon_name', newName);
      
      setUser({ id: newId, username: newName });
    }
  }, []);

  if (!user) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no category selected, show selector
  if (!selectedCategory) {
    return (
      <CategorySelector 
        onSelectCategory={(category) => setSelectedCategory(category)} 
      />
    );
  }

  // If category selected, show chat room
  return (
    <ChatRoom 
      user={user} 
      category={selectedCategory} 
      onLeave={() => setSelectedCategory(null)} 
    />
  );
}

export default App;
