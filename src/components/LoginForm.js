import { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;


export const LoginForm = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
    console.log(API_BASE_URL);
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signin`, values);
            console.log("response is :: ", response)
            if (response.data.code === 'SUCCESS') {
                const { data } = response.data;

                // Check if user is ADMIN
                if (data.userType !== 'ADMIN') {
                    message.error('Access denied. Only ADMIN users are allowed.');
                    return;
                }

                // Store access token
                localStorage.setItem('accessToken', data.Accesstoken);
                message.success('Login successful!');
                onLogin();
            } else {
                message.error('Login failed. Please try again.');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Card
                style={{
                    width: 400,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    borderRadius: '12px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
                        Admin Dashboard
                    </Title>
                    <Text type="secondary">Sign in to manage companies</Text>
                </div>

                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                            style={{ borderRadius: '6px' }}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};