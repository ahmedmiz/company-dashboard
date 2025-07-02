import { useState, useEffect } from 'react';
import { Layout, Button, message, Typography, Spin } from 'antd';

import { api } from '../services/api';
import { CompanyCard } from '../components/CompanyCard'
import { logout } from '../utils/auth';


const { Header, Content } = Layout;
const { Title, Text } = Typography;


export const Dashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
    console.log(API_BASE_URL);
    const fetchUnapprovedCompanies = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/company/unapproved/companies`);
            console.log("compaines is :::: ", companies, "        - > ", response)
            setCompanies(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            message.error('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnapprovedCompanies();
    }, []);

    const handleApprove = async (companyId) => {
        try {
            await api.put(`${API_BASE_URL}/company/approveUser/${companyId}`);
            message.success('Company approved successfully!');
            fetchUnapprovedCompanies(); // Refresh the list
        } catch (error) {
            message.error('Failed to approve company');
        }
    };

    const handleDelete = async (userId) => {
        try {
            await api.delete(`${API_BASE_URL}/user/delete/user/${userId}`);
            message.success('Company deleted successfully!');
            fetchUnapprovedCompanies(); // Refresh the list
        } catch (error) {
            message.error('Failed to delete company');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                background: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                    Company Management Dashboard
                </Title>
                <Button type="primary" danger onClick={logout}>
                    Logout
                </Button>
            </Header>

            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Unapproved Companies ({companies.length})
                        </Title>
                        <Button onClick={fetchUnapprovedCompanies} loading={loading}>
                            Refresh
                        </Button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : companies.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Text type="secondary">No unapproved companies found</Text>
                        </div>
                    ) : (
                        companies.map((company) => (
                            <CompanyCard
                                key={company.user?.id}
                                company={company}
                                onApprove={handleApprove}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </Content>
        </Layout>
    );
};