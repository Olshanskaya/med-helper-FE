import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMedicinePage = () => {
  const [medicines, setMedicines] = useState([]);
  const [activeSubstances, setActiveSubstances] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [medicineName, setMedicineName] = useState('');
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  const [createStatus, setCreateStatus] = useState('');
  const [editedMedicineId, setEditedMedicineId] = useState(null);
  const [editedMedicineName, setEditedMedicineName] = useState(''); // Состояние изменяемого названия лекарства
  const [editedActiveSubstance, setEditedActiveSubstance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
    fetchActiveSubstances();
  }, []);

  const fetchMedicines = () => {
    try {
      fetch('http://localhost:8080/admin/meds/all')
        .then(response => response.json())
        .then(data => {
          const sortedMedicines = data.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка по алфавиту
          setMedicines(sortedMedicines);
        })
        .catch(error => console.error('Error fetching medicines:', error));
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchActiveSubstances = () => {
    try {
      fetch('http://localhost:8080/admin/sub/all')
        .then(response => response.json())
        .then(data => {
          const sortedSubstances = data
            .map(substance => ({ value: substance.id, label: substance.name }))
            .sort((a, b) => a.label.localeCompare(b.label)); // Сортировка по алфавиту
          setActiveSubstances(sortedSubstances);
        })
        .catch(error => console.error('Error fetching active substances:', error));
    } catch (error) {
      console.error('Error fetching active substances:', error);
    }
  };

  const handleSubstanceChange = selectedOption => {
    setSelectedSubstance(selectedOption);
  };

  const handleMedicineNameChange = event => {
    setMedicineName(event.target.value);
  };

  useEffect(() => {
    setIsCreateButtonDisabled(!(medicineName && selectedSubstance));
  }, [medicineName, selectedSubstance]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleCreateButtonClick = () => {
    const confirmCreate = window.confirm('Вы уверены, что хотите создать лекарственное средство?');
    if (confirmCreate) {
      const data = {
        name: medicineName,
        activeSubstanceId: selectedSubstance.value
      };

      axios
        .post('http://localhost:8080/admin/meds/new', data)
        .then(response => {
          if (response && response.data && response.data.id !== null) {
            window.alert('Лекарственное средство создано');
            // Очистить поля и обновить список лекарственных средств
            setMedicineName('');
            setSelectedSubstance(null);
            fetchMedicines();
          } else {
            window.alert('Такое лекарственное средство уже существует');
          }
        })
        .catch(error => {
          console.error('Ошибка при создании лекарственного средства:', error);
          window.alert('Ошибка при создании лекарственного средства.');
        });
    }
  };

  const handleDeleteButtonClick = medicineId => {
    console.log('Delete Medicine ID:', medicineId);
    // Отправка GET-запроса на удаление лекарственного средства
    axios
      .get(`http://localhost:8080/admin/meds/delete/${medicineId}`)
      .then(response => {
        if (response.status === 200) {
          window.alert('Лекарственное средство удалено успешно');
          window.location.reload();
        } else {
          window.alert('Ошибка при удалении лекарственного средства');
        }
      })
      .catch(error => {
        console.error('Error deleting medicine:', error);
        window.alert('Ошибка при удалении лекарственного средства');
      });
  };

  const handleEditButtonClick = (medicine) => {
    setEditedMedicineId(medicine.id);
    console.log('Edit Medicine ID:', medicine.id);
    setEditedMedicineName(medicine.name);
    setEditedActiveSubstance(activeSubstances.find((substance) => substance.label === medicine.activeSubstanceDto.name));
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    console.log('Изменение лекарственного средства');

    const editedData = {
      name: editedMedicineName,
      activeSubstanceId: editedActiveSubstance.value,
    };

    axios
      .put(`http://localhost:8080/admin/meds/edit/${editedMedicineId}`, editedData)
      .then((response) => {
        console.log('Лекарственное средство успешно изменено');
        window.alert('Название измененео успешно');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Ошибка при изменении лекарственного средства:', error);
      });

    setIsEditModalOpen(false); // Закрытие модального окна
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false); // Закрытие модального окна
  };

  const handleEditActiveSubstanceChange = (selectedOption) => {
    setEditedActiveSubstance(selectedOption);
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
      {medicines.map(medicine => (
        <div key={medicine.id}>
          {`${medicine.name} (${medicine.activeSubstanceDto.name})`}
          <div style={{ marginLeft: '10px' }}>
            <Button variant="info" onClick={() => handleEditButtonClick(medicine)}>
              Редактировать
            </Button>
            <Button variant="danger" onClick={() => handleDeleteButtonClick(medicine.id)}>
              Удалить
            </Button>
          </div>
        </div>
      ))}

     {/* Модальное окно редактирования */}
     <Modal show={isEditModalOpen} onHide={handleCancelEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать лекарственное средство</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="editMedicineName">
            <Form.Label>Название:</Form.Label>
            <Form.Control
              type="text"
              value={editedMedicineName}
              onChange={(event) => setEditedMedicineName(event.target.value)}
            />
          </Form.Group>

          {/* <Form.Group controlId="editActiveSubstance">
            <Form.Label>Активное вещество:</Form.Label>
            <Select
              options={activeSubstances}
              value={activeSubstances.find((substance) => substance.label === editedActiveSubstance)}
              onChange={(selectedOption) => handleEditActiveSubstanceChange(selectedOption)}
              isClearable
              isSearchable
            />
          </Form.Group> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
            Отменить
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default AddMedicinePage;
