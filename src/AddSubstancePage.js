import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

const AddSubstancePage = () => {
  const [substances, setSubstances] = useState([]);
  const [newSubstance, setNewSubstance] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Отправка GET-запроса для получения списка веществ
    axios.get('http://localhost:8080/admin/sub/all')
      .then(response => setSubstances(response.data))
      .catch(error => console.error('Ошибка:', error));
  }, []);

  const handleSave = () => {
    // Отправка POST-запроса для сохранения нового вещества
    axios.post('http://localhost:8080/admin/sub', { name: newSubstance })
      .then(response => {
        // Обновление списка веществ после успешного сохранения
        setSubstances([...substances, response.data]);
        setNewSubstance('');
      })
      .catch(error => console.error('Ошибка:', error));
  };

  const handleDelete = (id) => {
    // Отправка DELETE-запроса для удаления вещества
    axios.delete(`http://localhost:8080/admin/sub/${id}`)
      .then(() => {
        // Обновление списка веществ после успешного удаления
        setSubstances(substances.filter(substance => substance.id !== id));
      })
      .catch(error => console.error('Ошибка:', error));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <h1>Внести новое действующее вещество</h1>

      <Form.Group>
        <Form.Label>Название нового действующего вещества:</Form.Label>
        <Form.Control
          type="text"
          value={newSubstance}
          onChange={event => setNewSubstance(event.target.value)}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleSave}>Сохранить</Button>

      <h2>Существующие действующие вещества</h2>

      <ul>
        {substances.map(substance => (
          <li key={substance.id}>
            <div>
              {substance.name}
            </div>
            <div>
              <Button variant="secondary">Добавить взаимодействия</Button>
              <Button variant="info">Редактировать</Button>
              <Button variant="danger" onClick={() => handleDelete(substance.id)}>Удалить</Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить взаимодействия</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Содержимое модального окна для добавления взаимодействий */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Закрыть</Button>
          <Button variant="primary">Сохранить</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddSubstancePage;
