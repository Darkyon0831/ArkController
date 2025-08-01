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
      <ServerCard server={{name: "The Island - PvP", status: "Online", players: 15, maxPlayers: 50, map: "The Island", uptime: "2d 14h 23m", version: "v346.32"}} />
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

function ServerCard({ server })
{
  return (
    <div className="server-card">
      <div className="server-image">
        <img 
          src={"/var/www/html/ArkController/frontend/resources/images/ark-server-default.jpg"} 
          alt={server.name}
        />
      </div>
      <div className="server-info">
        <div className="server-header">
          <h3 className="server-name">{server.name}</h3>
          <span className={`server-status ${server.status.toLowerCase()}`}>
            {server.status}
          </span>
        </div>
        <div className="server-details">
          <div className="detail-item">
            <span className="label">Players:</span>
            <span className="value">{server.players}/{server.maxPlayers}</span>
          </div>
          <div className="detail-item">
            <span className="label">Map:</span>
            <span className="value">{server.map}</span>
          </div>
          <div className="detail-item">
            <span className="label">Uptime:</span>
            <span className="value">{server.uptime}</span>
          </div>
          <div className="detail-item">
            <span className="label">Version:</span>
            <span className="value">{server.version}</span>
          </div>
        </div>
        <div className="server-actions">
          <button className="btn btn-primary">
            Manage
          </button>
          <button className="btn btn-secondary">
            Restart
          </button>
          <button className="btn btn-danger">
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
