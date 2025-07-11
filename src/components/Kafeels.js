// src/components/Kafeels.js

import { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Alert, Spin, Modal } from 'antd';
import { api } from '../services/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const Kafeels = () => {
    const [kafeels, setKafeels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

    const fetchKafeels = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/user/user/users/kafeels`); // Adjust endpoint if needed
            setKafeels(Array.isArray(response.data.data) ? response.data.data : []);
            setAlert(null);
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to fetch kafeels' });
            setKafeels([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKafeels();
    }, []);

    const handleBan = async (userId) => {
        try {
            await api.put(`${API_BASE_URL}/user/unApprove/${userId}`);
            setAlert({ type: 'success', message: 'Kafeel deleted successfully!' });
            fetchKafeels();
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to delete kafeel' });
        }
    };

    const showBanConfirm = (userId) => {
        Modal.confirm({
            title: 'Ban Kafeel',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to ban this kafeel? This action cannot be undone.',
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
                    Unapproved Kafeels ({kafeels.length})
                </Title>
                <Button onClick={fetchKafeels} loading={loading}>
                    Refresh
                </Button>
            </div>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : kafeels.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Text type="secondary">No unapproved kafeels found</Text>
                </div>
            ) : (
                kafeels.map((item) => (
                    <Card
                        key={item.user.id}
                        style={{ marginBottom: 16 }}
                        title={item.userName || item.user.firstName || item.user.email}
                        extra={
                            <Space>
                                <Button danger onClick={() => showBanConfirm(item.user.id)}>
                                    Ban
                                </Button>
                            </Space>
                        }
                    >
                        <Text>Job Title: {item.JobTitle || 'Not provided'}</Text>
                        <br />
                        <Text>City: {item.city || 'Not provided'}</Text>
                        <br />
                        <Text>Preferred: {item.preferred || 'Not provided'}</Text>
                        <br />
                        <Text>Phone: {item.user.phoneNumber || 'Not provided'}</Text>
                        <br />
                        <Text>User Type: {item.user.userType}</Text>
                        <br />
                        <Text>Approved: {item.user.userApproved ? 'Yes' : 'No'}</Text>
                    </Card>
                ))
            )}
        </div>
    );
};