import React, { useState } from 'react';
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

  // Функция для создания заголовка Authorization
  const createAuthHeader = (username, password) => {
    const token = btoa(`${username}:${password}`); // Кодируем логин и пароль в Base64
    return { Authorization: `Basic ${token}` };
  };

  // Функция для входа и загрузки данных
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.get('http://localhost:8080/clients', {
        headers: createAuthHeader(username, password),
      });

      if (response.status === 200 || response.status === 201) {
        setClients(response.data); // Устанавливаем список клиентов
        setIsLoggedIn(true); // Устанавливаем статус входа
        setUsername(username); // Сохраняем логин
        setPassword(password); // Сохраняем пароль
        message.success('Вход выполнен успешно');
      } else {
        message.error('Ошибка при входе');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error); // Вывод ошибки в консоль
      if (error.response && error.response.status === 401) {
        message.error('Неверные логин или пароль');
      } else {
        message.error('Ошибка при входе');
      }
    }
  };

  // Функция для регистрации
  const handleRegister = async (username, password, age) => {
    try {
      const response = await axios.post('http://localhost:8080/register', {
        login: username,
        password: password,
      }, {
        params: { age },
      });

      if (response.status === 201) {
        message.success('Пользователь успешно зарегистрирован');
        setRegisterModalOpen(false);
      } else {
        message.error('Ошибка при регистрации');
      }
    } catch (error) {
      message.error('Ошибка при регистрации');
    }
  };

  // Функция для удаления
  const handleDelete = async (username) => {
    try {
      const response = await axios.delete('http://localhost:8080/register', {
        params: { login: username },
        headers: createAuthHeader(username, password),
      });

      if (response.status === 200) {
        message.success('Пользователь успешно удален');
        setDeleteModalOpen(false);
        fetchClients(); // Обновляем список клиентов
      } else {
        message.error('Ошибка при удалении пользователя');
      }
    } catch (error) {
      message.error('Ошибка при удалении пользователя');
    }
  };

  // Функция для обновления
  const handleUpdate = async (newPassword) => {
    try {
      const response = await axios.patch('http://localhost:8080/register', {
        login: username,
        password: newPassword,
      }, {
        headers: createAuthHeader(username, password),
      });

      if (response.status === 200) {
        message.success('Данные пользователя успешно обновлены');
        setUpdateModalOpen(false);
        fetchClients(); // Обновляем список клиентов
      } else {
        message.error('Ошибка при обновлении данных');
      }
    } catch (error) {
      message.error('Ошибка при обновлении данных');
    }
  };

  // Функция для загрузки списка клиентов
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/clients', {
        headers: createAuthHeader(username, password),
      });

      if (response.status === 200 || response.status === 201) {
        setClients(response.data); // Устанавливаем список клиентов
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
              {/* Меню */}
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

              {/* Основной интерфейс */}
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
                </div>
              </div>
            </div>
        )}

        {/* Модальное окно для регистрации */}
        <Modal
            title="Регистрация"
            open={isRegisterModalOpen}
            onCancel={() => setRegisterModalOpen(false)}
            footer={null}
        >
          <Form
              onFinish={(values) => {
                handleRegister(values.username, values.password, values.age);
              }}
          >
            <Form.Item label="Логин" name="username">
              <Input />
            </Form.Item>
            <Form.Item label="Пароль" name="password">
              <Input.Password />
            </Form.Item>
            <Form.Item label="Возраст" name="age">
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
          </Form>
        </Modal>

        {/* Модальное окно для удаления */}
        <Modal
            title="Удаление пользователя"
            open={isDeleteModalOpen}
            onCancel={() => setDeleteModalOpen(false)}
            footer={null}
        >
          <Form
              onFinish={(values) => {
                handleDelete(values.username);
              }}
          >
            <Form.Item label="Логин" name="username">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Удалить
            </Button>
          </Form>
        </Modal>

        {/* Модальное окно для обновления данных */}
        <Modal
            title="Обновление данных"
            open={isUpdateModalOpen}
            onCancel={() => setUpdateModalOpen(false)}
            footer={null}
        >
          <Form
              onFinish={(values) => {
                handleUpdate(values.newPassword);
              }}
          >
            <Form.Item label="Новый пароль" name="newPassword">
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Обновить
            </Button>
          </Form>
        </Modal>
      </div>
  );
};

export default App;