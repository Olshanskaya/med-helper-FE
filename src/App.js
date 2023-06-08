import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import CreateAdminPage from './CreateAdminPage';
import AddMedicinePage from './AddMedicinePage';
import AddSubstancePage from './AddSubstancePage';
import LoginPage from './LoginPage';



function HomePage({ onLogout }) {
  const navigate = useNavigate();

  const navigateToCreateAdmin = () => {
    navigate('/create-admin');
  };

  const navigateToAddMedicine = () => {
    navigate('/add-medicine');
  };

  const navigateToAddSubstance = () => {
    navigate('/add-substance');
  };

  const handleLogout = () => {
    // Дополнительная логика выхода
    onLogout();
  };

  return (
    <Container>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleLogout}>
          Выход
        </Button>
      </div>
      <h1>Домашняя страница</h1>
      <div className="d-grid gap-2">
        <Button variant="primary" className="mb-2" onClick={navigateToCreateAdmin}>
          Создать нового администратора
        </Button>
        <Button variant="primary" className="mb-2" onClick={navigateToAddMedicine}>
          Внести новый лекарственный препарат
        </Button>
        <Button variant="primary" className="mb-2" onClick={navigateToAddSubstance}>
          Внести новое действующее вещество
        </Button>
      </div>
    </Container>
  );
}

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={isLoggedIn ? <HomePage onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/create-admin" element={<CreateAdminPage />} />
          <Route path="/add-medicine" element={<AddMedicinePage />} />
          <Route path="/add-substance" element={<AddSubstancePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
