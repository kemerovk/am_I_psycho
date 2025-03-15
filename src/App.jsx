import React, { useState, useEffect } from 'react';
import { Button, Card, Descriptions, Menu, message, Form, Input, Modal } from 'antd';
import axios from 'axios';

const App = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  // Проверяем, есть ли данные о входе в localStorage при загрузке компонента
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');

    if (savedUsername && savedPassword) {
      // Восстанавливаем состояние авторизации без вывода сообщения
      setIsLoggedIn(true);
      setUsername(savedUsername);
      setPassword(savedPassword);
      fetchClients(savedUsername, savedPassword); // Загружаем данные клиентов
    }
  }, []);

  // Функция для создания заголовка Authorization
  const createAuthHeader = (username, password) => {
    const token = btoa(`${username}:${password}`);
    return { Authorization: `Basic ${token}` };
  };

  // Функция для входа и загрузки данных
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.get('http://localhost:8080/clients', {
        headers: createAuthHeader(username, password),
      });

      if (response.status === 200 || response.status === 201) {
        setClients(response.data);
        setIsLoggedIn(true);
        setUsername(username);
        setPassword(password);

        // Сохраняем данные о входе в localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        message.success('Вход выполнен успешно'); // Сообщение только при новом входе
      } else {
        message.error('Ошибка при входе');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      if (error.response && error.response.status === 401) {
        message.error('Неверные логин или пароль');
      } else {
        message.error('Ошибка при входе');
      }
    }
  };

  // Функция для выхода
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setClients([]);
    setSelectedClient(null);

    // Удаляем данные о входе из localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    message.success('Выход выполнен успешно');
  };

  // Функция для загрузки списка клиентов
  const fetchClients = async (username, password) => {
    try {
      const response = await axios.get('http://localhost:8080/clients', {
        headers: createAuthHeader(username, password),
      });

      if (response.status === 200 || response.status === 201) {
        setClients(response.data);
      } else {
        message.error('Ошибка при загрузке клиентов');
      }
    } catch (error) {
      message.error('Ошибка при загрузке клиентов');
    }
  };

  return (
      <div>
        {!isLoggedIn ? (
            <div style={{ maxWidth: 300, margin: 'auto', marginTop: 100 }}>
              <Form
                  onFinish={(values) => {
                    handleLogin(values.username, values.password);
                  }}
              >
                <Form.Item label="Логин" name="username">
                  <Input />
                </Form.Item>
                <Form.Item label="Пароль" name="password">
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Войти
                  </Button>
                </Form.Item>
                <Button
                    type="link"
                    style={{ width: '100%' }}
                    onClick={() => setRegisterModalOpen(true)}
                >
                  Зарегистрироваться
                </Button>
              </Form>
            </div>
        ) : (
            <div style={{ display: 'flex' }}>
              <Menu
                  onClick={(e) => {
                    const selected = clients.find((client) => client.id === parseInt(e.key));
                    setSelectedClient(selected);
                  }}
                  style={{ width: 256 }}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                  items={[
                    {
                      key: 'sub1',
                      label: 'Список пользователей',
                      children: clients.map((client) => ({
                        key: client.id,
                        label: `${client.login} (${client.age} лет)`,
                      })),
                    },
                  ]}
              />

              <div style={{ flex: 1, padding: '20px' }}>
                {selectedClient ? (
                    <Card title="Информация о клиенте" style={{ width: '100%' }}>
                      <Descriptions bordered column={1}>
                        <Descriptions.Item label="ID">{selectedClient.id}</Descriptions.Item>
                        <Descriptions.Item label="Логин">{selectedClient.login}</Descriptions.Item>
                        <Descriptions.Item label="Возраст">{selectedClient.age}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '20%' }}>
                      <h2>Выберите клиента из меню</h2>
                    </div>
                )}
                <div style={{ marginTop: 20 }}>
                  <Button onClick={() => setDeleteModalOpen(true)}>Удалить пользователя</Button>
                  <Button onClick={() => setUpdateModalOpen(true)} style={{ marginLeft: 10 }}>
                    Обновить данные
                  </Button>
                  <Button onClick={handleLogout} style={{ marginLeft: 10 }}>
                    Выйти
                  </Button>
                </div>
              </div>
            </div>
        )}

        {/* Модальные окна для регистрации, удаления и обновления данных */}
        {/* ... */}
      </div>
  );
};

export default App;