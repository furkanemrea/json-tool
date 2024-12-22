import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  FormatPainterOutlined,
  NodeIndexOutlined,
  CodeOutlined,
  FileTextOutlined,
  CompassOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/about',
      icon: <HomeOutlined />,
      label: 'FEKA',
    },
    {
      key: '/json-beautifier',
      icon: <FormatPainterOutlined />,
      label: 'Beautifier',
    },
    {
      key: '/json-map',
      icon: <NodeIndexOutlined />,
      label: 'JSON Map',
    },
    {
      key: '/json-to-code',
      icon: <CodeOutlined />,
      label: 'JSON to Code',
    },
    {
      key: '/text-comparer',
      icon: <CompassOutlined />,
      label: 'Text Comparer',
    },
    {
      key: '/json-converter',
      icon: <FileExcelOutlined />,
      label: 'JSON to Excel',
    },
    {
      key: '/json-to-xml',
      icon: <FileTextOutlined />,
      label: 'JSON to XML',
    },
  ];

  return (
    <Header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        padding: 0,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: '46px',
        lineHeight: '46px'
      }}
    >
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems.map(item => ({
          ...item,
          key: item.key,
          icon: React.cloneElement(item.icon, {
            style: { fontSize: '18px' }
          }),
          label: (
            <Link to={item.key}>
              {item.label}
            </Link>
          )
        }))}
        style={{
          justifyContent: 'center',
          border: 'none',
          height: '46px',
          lineHeight: '46px'
        }}
        theme="light"
      />
    </Header>
  );
};

export default Navbar; 