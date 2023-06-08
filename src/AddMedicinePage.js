import React, { useState, useEffect } from 'react';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';

const AddMedicinePage = () => {
  const [medicines, setMedicines] = useState([]);
  const [activeSubstances, setActiveSubstances] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [medicineName, setMedicineName] = useState('');
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  const [createStatus, setCreateStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
    fetchActiveSubstances();
  }, []);

  const fetchMedicines = () => {
    try {
      const response = fetch('http://localhost:8080/admin/meds/all');
      const data = response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchActiveSubstances = () => {
    try {
      const response = fetch('http://localhost:8080/admin/sub/all');
      const data = response.json();
      const sortedSubstances = data
        .map((substance) => ({ value: substance.name, label: substance.name }))
        .sort((a, b) => a.label.localeCompare(b.label)); // Сортировка по алфавиту
      setActiveSubstances(sortedSubstances);
    } catch (error) {
      console.error('Error fetching active substances:', error);
    }
  };

  const handleSubstanceChange = (selectedOption) => {
    setSelectedSubstance(selectedOption);
  };

  const handleMedicineNameChange = (event) => {
    setMedicineName(event.target.value);
  };

  useEffect(() => {
    setIsCreateButtonDisabled(!(medicineName && selectedSubstance));
  }, [medicineName, selectedSubstance]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleCreateButtonClick = () => {
    const confirmCreate = window.confirm(`Вы уверены, что хотите создать лекарственное средство?`);
    if (confirmCreate) {
      const data = {
        email: 'asdlefnekjfn',
        password: '123',
        authority: {
          id: 2,
          authority: 'ADMIN'
        }
      };

      axios.post('http://localhost:8080/register', data)
        .then(response => {
          // Обработка успешного создания администратора
          window.alert(`Администратор успешно создан.`);
          //window.location.reload();
        })
        .catch(error => {
          // Обработка ошибки при создании администратора
          console.error(error);
          window.alert('Ошибка при создании администратора.');
        });
    }
  };


  return (
    <Container>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" className="me-2" onClick={handleGoBack}>
          Назад
        </Button>
      </div>

      <h1>Внести новый лекарственный препарат</h1>

      <h2>Ввести новое лекарственное средство</h2>
      <Form>
        <Form.Group controlId="medicineName">
          <Form.Label>Название:</Form.Label>
          <Form.Control type="text" value={medicineName} onChange={handleMedicineNameChange} />
        </Form.Group>

        <Form.Group controlId="activeSubstance">
          <Form.Label>Активное вещество:</Form.Label>
          <Select
            options={activeSubstances}
            value={selectedSubstance}
            onChange={handleSubstanceChange}
            isClearable
            isSearchable
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ marginTop: '10px' }} onClick={handleCreateButtonClick} disabled={isCreateButtonDisabled}>
            Создать
        </Button>
      </Form>

      <h2>Все лекарственные средства</h2>
      {medicines.map((medicine) => (
        <div key={medicine.id}>
          {`${medicine.name} (${medicine.activeSubstanceDto.name})`}
          <div style={{ marginLeft: '10px' }}>
            <Button variant="info">Редактировать</Button>
            <Button variant="danger">Удалить</Button>
          </div>
        </div>
      ))}
    </Container>
  );
}

export default AddMedicinePage;
