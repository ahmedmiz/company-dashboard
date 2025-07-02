import { useState, useEffect } from "react";
import { isAuthenticated } from './utils/auth'
import { Dashboard } from './pages/Dashboard.js'
import { LoginForm } from './components/LoginForm.js';
import 'antd/dist/reset.css'; // or 'antd/dist/antd.css' for older versions
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;