import { useState } from 'react';
import { Layout, Button, Typography } from 'antd';


import { logout } from '../utils/auth';
import { UnapprovedCompanies } from '../components/UnapprovedCompanies';
import { Companies } from '../components/Companies';    
import { Workers } from '../components/Workers';
import { Kafeels } from '../components/Kafeels';

const { Header, Content } = Layout;
const { Title } = Typography;

export const Dashboard = () => {
    const [viewType, setViewType] = useState('Companies');
    
    
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

            {/* FLEX CONTAINER: side widget and content side by side */}
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                {/* Side widget */}
                <div style={{
                    width: 200,
                    background: '#f7f7f7',
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    borderRight: '1px solid #eee'
                }}>
                    <Button
                        type={viewType === 'Companies' ? 'primary' : 'default'}
                        onClick={() => setViewType('Companies')}
                        block
                    >
                        Companies
                    </Button>
                    <Button
                        type={viewType === 'UnapprovedCompanies' ? 'primary' : 'default'}
                        onClick={() => setViewType('UnapprovedCompanies')}
                        block
                    >
                        Companies to approve
                    </Button>
                    <Button
                        type={viewType === 'Workers' ? 'primary' : 'default'}
                        onClick={() => setViewType('Workers')}
                        block
                    >
                        Workers
                    </Button>
                    <Button
                        type={viewType === 'kafeels' ? 'primary' : 'default'}
                        onClick={() => setViewType('kafeels')}
                        block
                    >
                        Kafeels
                    </Button>
                </div>
                {/* Main content */}
                <Content style={{ padding: '24px', background: '#f0f2f5', flex: 1 }}>
                    {viewType === 'UnapprovedCompanies' && <UnapprovedCompanies />}
                    {viewType === 'Companies' && <Companies />}
                    {viewType === 'Workers' && <Workers />}
                    {viewType === 'kafeels' && <Kafeels />}
                </Content>
            </div>
        </Layout>
    );
};