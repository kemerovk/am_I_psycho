import React, { useEffect, useState } from 'react';
import { Menu, Card, Descriptions } from 'antd'; // Добавляем компоненты для отображения данных
import axios from 'axios';

// Вспомогательная функция для создания элементов меню
const getItem = (label, key, icon, children) => {
  return {
    key,
    label,
    icon,
    children,
  };
};

const App = () => {
  const [clients, setClients] = useState([]); // Состояние для хранения списка клиентов
  const [selectedClient, setSelectedClient] = useState(null); // Состояние для хранения выбранного клиента

  // Функция для получения данных клиентов
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/clients');
      setClients(response.data); // Сохраняем данные клиентов в состояние
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchClients();
  }, []);

  // Формируем элементы меню на основе данных клиентов
  const menuItems = [
    getItem(
        'Список пользователей',
        'sub1',
        null,
        clients.map(client => getItem(`${client.name} (${client.age} лет)`, client.id)) // Объединяем имя и возраст
    ),
  ];

  // Обработчик клика по пункту меню
  const onClick = (e) => {
    const selected = clients.find(client => client.id === parseInt(e.key)); // Находим выбранного клиента
    setSelectedClient(selected); // Сохраняем выбранного клиента в состояние
  };

  return (
      <div style={{ display: 'flex' }}>
        {/* Меню */}
        <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={menuItems}
        />

        {/* Блок для отображения данных клиента */}
        <div style={{ flex: 1, padding: '20px' }}>
          {selectedClient ? (
              <Card title="Информация о клиенте" style={{ width: '100%' }}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="ID">{selectedClient.id}</Descriptions.Item>
                  <Descriptions.Item label="Имя">{selectedClient.name}</Descriptions.Item>
                  <Descriptions.Item label="Возраст">{selectedClient.age}</Descriptions.Item>
                  {/* Добавьте другие поля, если они есть */}
                </Descriptions>
              </Card>
          ) : (
              <div style={{ textAlign: 'center', marginTop: '20%' }}>
                <h2>Выберите клиента из меню</h2>
              </div>
          )}
        </div>
      </div>
  );
};

export default App;