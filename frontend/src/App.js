import "./App.css";

function App() {
  return (
    <LoginPage />
  )
}

function LoginPage() {
  return (
    <>
      <div className="login-page">
        <div className="login-window">
          <h2>Login</h2>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button>Login</button>
        </div>
      </div>
    </>
  );
}

export default App;
