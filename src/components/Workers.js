// src/components/Users.js

import { useState, useEffect } from 'react';
import { Card, Button, Space, Modal, Typography, Alert, Spin } from 'antd';
import { api } from '../services/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const Workers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

    const fetchUnapprovedWorkers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/user/user/users/workers`);
            setUsers(Array.isArray(response.data.data) ? response.data.data : []);
            setAlert(null);
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to fetch users' });
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnapprovedWorkers();
    }, []);

  

    const handleBan = async (userId) => {
        try {
            await api.put(`${API_BASE_URL}/user/unApprove/${userId}`);
            setAlert({ type: 'success', message: 'User deleted successfully!' });
            fetchUnapprovedWorkers();
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to delete user' });
        }
    };

    const showBanConfirm = (userId) => {
        Modal.confirm({
            title: 'Ban Worker',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to ban this worker? This action cannot be undone.',
            okText: 'Yes, Ban',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                handleBan(userId);
            },
        });
    };

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            {alert && (
                <Alert
                    style={{ marginBottom: 16 }}
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={() => setAlert(null)}
                />
            )}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>
                    Unapproved Workers ({users.length})
                </Title>
                <Button onClick={fetchUnapprovedWorkers} loading={loading}>
                    Refresh
                </Button>
            </div>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Text type="secondary">No unapproved workers found</Text>
                </div>
            ) : (
                users.map((item) => (
                    <Card
                        key={item.user.id}
                        style={{ marginBottom: 16 }}
                        title={item.user.firstName || item.user.email}
                        extra={
                            <Space>
                                <Button danger onClick={() => showBanConfirm(item.user.id)}>
                                    Ban
                                </Button>
                            </Space>
                        }
                    >
                        <Text>Email: {item.user.email || 'Not provided'}</Text>
                        <br />
                        <Text>Phone: {item.user.phoneNumber || 'Not provided'}</Text>
                        <br />
                        <Text>Country: {item.user.country || 'Not provided'}</Text>
                        <br />
                        <Text>User Type: {item.user.userType}</Text>
                        <br />
                        <Text>Approved: {item.user.userApproved ? 'Yes' : 'No'}</Text>
                        <br />
                        <Text>Years of Experience: {item.yearsOfExperience ?? 'Not provided'}</Text>
                        <br />
                        <Text>Previous Cities: {Array.isArray(item.previouseCities) ? item.previouseCities.join(', ') : (item.previouseCities || 'Not provided')}</Text>
                        <br />
                        <Text>
                            CV: {item.cv
                                ? (
                                    <a href={item.cv} target="_blank" rel="noopener noreferrer">
                                        View Document
                                    </a>
                                )
                                : 'Not provided'}
                        </Text>
                    </Card>
                ))
            )}
        </div>
    );
};