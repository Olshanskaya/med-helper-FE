import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//import 'moment/locale/en-gb'

const InteractionModal = ({ showModal, handleCloseModal, selectedSubstance }) => {
  const [substances, setSubstances] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [inputValues, setInputValues] = useState([
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false },
    { value: '', time: '', isTimeVisible: false }
  ]);

  useEffect(() => {
    // Отправка GET-запроса для получения списка веществ
    axios.get('http://localhost:8080/admin/sub/all')
      .then(response => setSubstances(response.data))
      .catch(error => console.error('Ошибка:', error));
  }, []);

  useEffect(() => {
    if (selectedSubstance && selectedSubstance.id) {
      fetch(`http://localhost:8080/admin/sub/interaction/${selectedSubstance.id}`)
        .then(response => response.json())
        .then(data => setInteractions(data))
        .catch(error => console.error(error));
    }
  }, [selectedSubstance]);

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

  const handleSaveClick = () => {
    const requestBody = inputValues.map(input => ({
      activeSubstanceId1: selectedSubstance.id,
      activeSubstanceName: input.value,
      interactionTime: input.isTimeVisible ? input.time : null
    }));

    axios
      .post('http://localhost:8080/admin/sub/interaction/new', requestBody)
      .then(response => {
        // Обработка успешного сохранения
        console.log('Сохранено:', response.data);
        window.location.reload();
        handleCloseModal();
      })
      .catch(error => {
        // Обработка ошибки сохранения
        console.error('Ошибка сохранения:', error);
      });
  };



  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSubstance ? `Добавить взаимодействия: ${selectedSubstance.name}` : 'Добавить взаимодействия'}
        </Modal.Title>
      </Modal.Header>


      <Modal.Body>
        {interactions.map(interaction => (
          <div key={interaction.activeSubstance2.id}>
            <p>Вещество: {interaction.activeSubstance2.name}</p>
            <p>
              Время взаимодействия: {interaction.interactionTime ? interaction.interactionTime : 'запрещено принимать вместе'}
            </p>
          </div>
        ))}


        {inputValues.map((input, index) => (
            <React.Fragment key={index}>
                <Form.Group>
                <Form.Label>Поле ввода {index + 1}:</Form.Label>
                <Form.Control
                    as="select"
                    value={input.value}
                    onChange={event => handleInputChange(index, 'value', event.target.value)}
                >
                    <option value="">Выберите вещество</option>
                    {substances.map(substance => {
                    const isExcluded = interactions.some(interaction => interaction.activeSubstance2.name === substance.name);
                    return (
                        <React.Fragment key={substance.id}>
                        {isExcluded ? null : (
                            <option value={substance.name} disabled={isExcluded}>
                            {substance.name}
                            </option>
                        )}
                        </React.Fragment>
                    );
                    })}
                    {input.value && (
                    <option value={input.value}>
                        {input.value} (удалить)
                    </option>
                    )}
                </Form.Control>
                </Form.Group>

                <Form.Group>
                <Form.Check
                    type="switch"
                    id={`custom-switch-${index}`}
                    label="Возможно совместное применение"
                    checked={input.isTimeVisible}
                    onChange={event => handleSwitchChange(index, event.target.checked)}
                />
                </Form.Group>

                {input.isTimeVisible && (
                <Form.Group>
                    <Form.Label> Время (в часах) для поля ввода {index + 1}: </Form.Label>
                    <DatePicker
                    selected={input.time}
                    onChange={date => handleInputChange(index, 'time', date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="HH:mm"
                    locale="en_GB"
                    className="form-control"
                    is24Hour
                    // minTime={new Date().setHours(0, 0)}
                    // maxTime={new Date().setHours(24, 0)}
                    />

                </Form.Group>
                )}
            </React.Fragment>
        ))}    

      </Modal.Body>


      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default InteractionModal;
