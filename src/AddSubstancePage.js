import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InteractionModal from './InteractionModal';



const AddSubstancePage = () => {
  const [substances, setSubstances] = useState([]);
  const [newSubstance, setNewSubstance] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSubstance, setSelectedSubstance] = useState(null); // New state for selected substance ID
  const [inputValues, setInputValues] = useState([
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false }
  ]);

  useEffect(() => {
    axios.get('http://localhost:8080/admin/sub/all')
      .then(response => {
        const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setSubstances(sortedData);
      })
      .catch(error => console.error('Ошибка:', error));
  }, []);
  

  const handleSave = () => {
    // Create the request body
    const requestBody = {
      name: newSubstance
    };
  
    // Send the POST request
    axios.post('http://localhost:8080/admin/sub/new', requestBody)
      .then(response => {
        // Handle the response
        console.log('Success:', response.data);
        // Reset the input field
        setNewSubstance('');
        window.location.reload();
      })
      .catch(error => {
        // Handle the error
        console.error('Error:', error);
      });
  };

  const handleDelete = (id) => {
    console.log('Delete AS:', id);
    // Отправка GET-запроса на удаление лекарственного средства
    axios
      .get(`http://localhost:8080/admin/sub/interaction/delete/${id}`)
      .then(response => {
        if (response.status === 200) {
          window.alert('Действующее вещество удалено успешно');
          window.location.reload();
        } else {
          window.alert('Ошибка при удалении');
        }
      })
      .catch(error => {
        console.error('Error deleting as:', error);
        window.alert('Ошибка при удалении');
      });
  };

  const handleShowModal = (substance) => {
    setSelectedSubstance(substance); // Store the selected substance ID
    setShowModal(true);
  };

  const handleInputChange = (index, field, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index][field] = value;
    setInputValues(updatedValues);
  };

  const handleSwitchChange = (index, checked) => {
    const updatedValues = [...inputValues];
    updatedValues[index].isTimeVisible = checked;
    setInputValues(updatedValues);
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


      <Button variant="primary" onClick={handleSave} disabled={!newSubstance}>
        Сохранить
      </Button>

      <h2>Существующие действующие вещества</h2>

      <ul>
        {substances.map(substance => (
          <li key={substance.id}>
            <div>{substance.name}</div>
            <div>
              <Button variant="secondary" onClick={() => handleShowModal(substance)}>Добавить взаимодействия</Button>
              <Button variant="danger" onClick={() => handleDelete(substance.id)}>
                Удалить
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <InteractionModal showModal={showModal} handleCloseModal={handleCloseModal} selectedSubstance={selectedSubstance}/>

    </Container>

  );
};

export default AddSubstancePage;
