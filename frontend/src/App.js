import React, { useState, useEffect } from 'react';
import "./App.css";
import "./LoginPage.css";
import arkControllerLogo from './ark_controller_logo.png';

function App() {
  const [sessionKey, setSessionKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use useEffect to handle async session check
  useEffect(() => {
    const checkSession = async () => {
      const result = await TrySessionKey();
      setSessionKey(result);
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  console.log('Session Key:', sessionKey);

  // Show loading while checking session
  if (isLoading) {
    return (
      <div className="loading-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (sessionKey) {
    // If session key exists, redirect to the main application
    return (
      <div className="app">
        <ServerCard server={{
          name: "Example Server",
          status: "Online",
          players: 10,
          maxPlayers: 20,
          map: "The Island",
          uptime: "2 days",
          version: "1.0.0"
        }} />
        <button onClick={() => {
          localStorage.removeItem('session_key');
          setSessionKey(null);
        }}>
          Logout
        </button>
        {/* Main application components can be added here */}
      </div>
    );
  } else {
    // If no session key, show the login page
    return (
      <LoginPageNice onLoginSuccess={setSessionKey} />
    );
  }
}

const TrySessionKey = async () => {
  const sessionKey = localStorage.getItem('session_key');

  if (sessionKey) 
  {
    const response = await fetch('https://ark.darkyon.com/api/check_credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_key: sessionKey })
    });

    const data = await response.json();

    console.log('Session Key Check Response:', data);

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

function LoginPageNice({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onclick = async() => {
    const response = await fetch('https://ark.darkyon.com/api/check_credentials', {
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
      onLoginSuccess(data.session_key); 
      setUsername('');
      setPassword('');
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
    <div className="login_page_background">
      <div className='login_page_header'>
        <img src={arkControllerLogo} alt="ArkController Logo" className="login_page_logo" />
      </div>
      <div className="login_page_container">
        <p className="login_page_username_p">Username</p>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <p className="login_page_password_p">Password</p>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="login_button" onClick={onclick}>LOG IN</button>
      </div>
    </div>
  );
}

export default App;
