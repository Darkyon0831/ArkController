import React, { useState } from 'react';
import "./App.css";

function App() {
  const sessionKey = null;

  if (sessionKey) 
  {
    // If session key exists, redirect to the main application
    return (
      <div className="app">
        <h1>Welcome to the ArkController</h1>
        {/* Main application components can be added here */}
      </div>
    );
  }
  else 
  {
    // If no session key, show the login page
    return (
      <LoginPage />
    );
  }
}


const TrySessionKey = async () => {
  const sessionKey = localStorage.getItem('session_key');
  if (sessionKey) 
  {
    const response = await fetch('/check_credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_key: sessionKey })
    });

    const data = await response.json();

    if (data.status === 1) 
    {
      return sessionKey;
    }
    else 
    {
      localStorage.removeItem('session_key');
      return null;
    }
  } 
  else 
  {
    return null;
  }
}

function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onclick = async() => {
    const response = await fetch('https://www.darkyon.com/api/check_credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await response.json();

    if (data.status === 1) 
    {
      console.log('Login successful');
      console.log('Session Key:', data.session_key);
      localStorage.setItem('session_key', data.session_key);
    } 
    else
    {
      console.error('Login failed:', data.message);
      setUsername('');
      setPassword('');
      localStorage.removeItem('session_key'); // Clear session key on failure
    }
  }

  return (
    <>
      <div className="login-page">
        <div className="login-window">
          <h2>Login</h2>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={onclick}>Login</button>
        </div>
      </div>
    </>
  );
}

export default App;
