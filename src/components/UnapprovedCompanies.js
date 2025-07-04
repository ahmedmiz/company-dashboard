 

import { useState, useEffect } from 'react';


import { Card, Button, Space, Modal, Typography, Alert , Spin } from 'antd';


import { api } from '../services/api';
import { CompanyCard } from './CompanyCard'
const { Title, Text } = Typography;


export const UnapprovedCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
    


    const fetchUnapprovedCompanies = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/company/unapproved/companies`);  
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
        fetchUnapprovedCompanies(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApprove = async (companyId) => {
        try {

            await api.put(`${API_BASE_URL}/company/approveUser/${companyId}`);
            setAlert({ type: 'success', message: 'Company approved successfully!' });
            fetchUnapprovedCompanies(); // Refresh the list
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to approve company' });
        }
    };

    const handleDelete = async (userId) => {
        try {
            await api.delete(`${API_BASE_URL}/user/delete/user/${userId}`);
            setAlert({ type: 'success', message: 'Company deleted successfully!' });
            fetchUnapprovedCompanies(); // Refresh the list
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to delete company' });
        }
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
        
    )
};