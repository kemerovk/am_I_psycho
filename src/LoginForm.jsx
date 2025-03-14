import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onLogin(username, password); // Передаем логин и пароль в родительский компонент
    };

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item label="Логин" name="username">
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>
            <Form.Item label="Пароль" name="password">
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;