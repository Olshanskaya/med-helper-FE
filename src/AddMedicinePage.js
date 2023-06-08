import React, { useState, useEffect } from 'react';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

function AddMedicinePage() {
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

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/meds/all');
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchActiveSubstances = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/sub/all');
      const data = await response.json();
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

  const handleCreateButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/meds/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: medicineName,
          activeSubstanceId: selectedSubstance.value,
        }),
      });

      if (response.status === 404) {
        setCreateStatus('Такое лекарственное средство уже существует');
      } else {
        setCreateStatus('Лекарственное средство создано');
        //window.location.reload();
      }
    } catch (error) {
      console.error('Error creating medicine:', error);
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

      {createStatus && <p>{createStatus}</p>}

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
