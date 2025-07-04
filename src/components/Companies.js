import { useState, useEffect } from 'react';
import { Card, Button, Space, Modal, Typography, Alert, Spin, Row, Col, Tag, Image } from 'antd';
import { ExclamationCircleOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Title, Text } = Typography;

export const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
    
    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/user/user/users/companies`);  
            setCompanies(Array.isArray(response.data.data) ? response.data.data : []);
            setAlert(null);
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to fetch companies' });
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

   

   
    const handleBan = async (userId) => { 
         try {
            await api.put(`${API_BASE_URL}/user/unApprove/${userId}`);
            setAlert({ type: 'success', message: 'Company Ban successfully!' });
            fetchCompanies(); // Refresh the list
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to Ban company' });
        }

    }
    return (
        <>
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
                            Companies ({companies.length})
                        </Title>
                        <Button onClick={fetchCompanies} loading={loading}>
                            Refresh
                        </Button>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : companies.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Text type="secondary">No  companies found</Text>
                        </div>
                    ) : (
                        companies.map((company) => {
                            const { user } = company;
                            const handleBan = () => {
                                Modal.confirm({
                                    title: 'Ban Company',
                                    icon: <ExclamationCircleOutlined />,
                                    content: 'Are you sure you want to Ban this company? This action cannot be undone.',
                                    okText: 'Yes, Ban',
                                    okType: 'danger',
                                    cancelText: 'Cancel',
                                    onOk() {
                                        handleBan(user.id);
                                    },
                                });
                            };

                            return (
                                <Card
                                    key={user.id}
                                    hoverable
                                    style={{
                                        marginBottom: 16,
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    actions={[
                                        <Button
                                            onClick={handleBan}
                                        >
                                            Ban
                                        </Button>
                                    ]}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                <div>
                                                    <Text strong>Company Name:</Text>
                                                    <br />
                                                    <Text>{company.companyName || 'Not provided'}</Text>
                                                </div>
                                                <div>
                                                    <Text strong>Owner Name:</Text>
                                                    <br />
                                                    <Text>{company.ownerName || 'Not provided'}</Text>
                                                </div>
                                                <div>
                                                    <Text strong>Email:</Text>
                                                    <br />
                                                    <Text>{company.officialEmail || user.email || 'Not provided'}</Text>
                                                </div>
                                                <div>
                                                    <Text strong>Phone:</Text>
                                                    <br />
                                                    <Text>{company.officePhoneNumber || user.phoneNumber || 'Not provided'}</Text>
                                                </div>
                                                <div>
                                                    <Text strong>Status:</Text>
                                                    <br />
                                                    <Tag color="orange">Pending Approval</Tag>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                <div>
                                                    <Text strong>Registration Number:</Text>
                                                    <br />
                                                    <Text>{company.commercialRegistrationNumber || 'Not provided'}</Text>
                                                </div>
                                                <div>
                                                    <Text strong>License Number:</Text>
                                                    <br />
                                                    <Text>{company.licenseNumber || 'Not provided'}</Text>
                                                </div>
                                                <div>
                                                    <Text strong>Website:</Text>
                                                    <br />
                                                    <Text>{company.websiteUrl || 'Not provided'}</Text>
                                                </div>
                                                <div>
                                                    <Text strong>City:</Text>
                                                    <br />
                                                    <Text>{company.officeCity || company.city || 'Not provided'}</Text>
                                                </div>
                                                {(company.licenseImage || company.idImage) && (
                                                    <div>
                                                        <Text strong>Documents:</Text>
                                                        <br />
                                                        <Space>
                                                            {company.licenseImage && (
                                                                <Image
                                                                    width={50}
                                                                    height={50}
                                                                    src={company.licenseImage}
                                                                    placeholder="License"
                                                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                                />
                                                            )}
                                                            {company.idImage && (
                                                                <Image
                                                                    width={50}
                                                                    height={50}
                                                                    src={company.idImage}
                                                                    placeholder="ID"
                                                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                                />
                                                            )}
                                                        </Space>
                                                    </div>
                                                )}
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })
                    )}
            </div>
            </>
        
    )
};