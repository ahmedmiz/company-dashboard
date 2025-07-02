import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, Space, Modal, message, Typography, Spin, Row, Col, Tag, Image } from 'antd';
import { ExclamationCircleOutlined, CheckOutlined, DeleteOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;


export const CompanyCard = ({ company, onApprove, onDelete }) => {
    const { user } = company;

    const handleApprove = () => {
        confirm({
            title: 'Approve Company',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to approve this company?`,
            okText: 'Yes, Approve',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                onApprove(user.id);
            },
        });
    };

    const handleDelete = () => {
        confirm({
            title: 'Delete Company',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this company? This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                onDelete(user.id);
            },
        });
    };

    return (
        <Card
            hoverable
            style={{
                marginBottom: 16,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            actions={[
                <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleApprove}
                    style={{ color: '#52c41a', borderColor: '#52c41a' }}
                >
                    Approve
                </Button>,
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                >
                    Delete
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
};