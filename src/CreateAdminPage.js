import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleCreateAdmin = () => {
    const confirmCreate = window.confirm(`Вы уверены, что хотите создать администратора с email ${email}?`);
    if (confirmCreate) {
      const data = {
        email: email,
        password: '123',
        authority: {
          id: 2,
          authority: 'ADMIN'
        }
      };

      axios.post('http://localhost:8080/register', data)
        .then(response => {
          // Обработка успешного создания администратора
          window.alert(`Администратор с email ${email} успешно создан.`);
          window.location.reload();
        })
        .catch(error => {
          // Обработка ошибки при создании администратора
          console.error(error);
          window.alert('Ошибка при создании администратора.');
        });
    }
  };

  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm(`Вы уверены, что хотите удалить пользователя ${userId}?`);
    if (confirmDelete) {
      axios.get(`http://localhost:8080/admin/admins/delete/${userId}`)
        .then(response => {
          if (response.status === 200) {
            setUsers(users.filter((user) => user.id !== userId));
            window.alert(`Пользователь ${userId} удален.`);
          } else {
            window.alert('Возникла ошибка при удалении.');
          }
        })
        .catch(error => {
          console.error(error);
          window.alert('Возникла ошибка при удалении.');
        });
    }
  };
  
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/admins/all');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Container>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" className="me-2" onClick={handleGoBack}>
          Назад
        </Button>
      </div>
      <h1>Страница создания администратора</h1>

      <div>
        <h2>Создание администратора:</h2>
        <Form>
          <InputGroup className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="primary" onClick={handleCreateAdmin}>
              Создать администратора
            </Button>
          </InputGroup>
        </Form>
      </div>

      <div>
        <h2>Существующие админимтраторы:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email}{' '}
              <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                Удалить
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default CreateAdminPage;
