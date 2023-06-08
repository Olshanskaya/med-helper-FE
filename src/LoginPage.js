import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authority && data.authority.authority === "ADMIN" && data.status === "ACTIVE") {
          onLogin();
        } else {
          alert('Ошибка авторизации. Проверьте email и пароль.');
        }
      })
      .catch((error) => {
        console.error('Ошибка:', error);
      });
  };
  

  return (
    <Container>
      <h1>Страница авторизации</h1>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email адрес</Form.Label>
          <Form.Control type="email" placeholder="Введите email" value={email} onChange={handleEmailChange} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control type="password" placeholder="Введите пароль" value={password} onChange={handlePasswordChange} />
        </Form.Group>

        <Button variant="primary" onClick={handleLogin}>
          Войти
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
