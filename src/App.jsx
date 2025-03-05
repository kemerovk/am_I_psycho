import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
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
    console.log('click ', e);
  };

  // Рендерим меню
  return (
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
  );
};

export default App;