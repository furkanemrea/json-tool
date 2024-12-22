import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  CodeOutlined,
  FileTextOutlined,
  NodeIndexOutlined,
  CompassOutlined,
  FileExcelOutlined,
  FormatPainterOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About = () => {
  const features = [
    {
      title: 'JSON Beautifier',
      icon: <FormatPainterOutlined style={{ fontSize: '28px', color: '#2563eb' }} />,
      path: '/json-beautifier',
      description: 'Format and validate your JSON data with ease.',
      features: [
        'Instant JSON formatting and validation',
        'Real-time error detection',
        'Copy formatted JSON with one click',
        'Clean and readable output format'
      ],
      gradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'JSON Map Visualizer',
      icon: <NodeIndexOutlined style={{ fontSize: '28px', color: '#7c3aed' }} />,
      path: '/json-map',
      description: 'Visualize your JSON structure as an interactive diagram.',
      features: [
        'Interactive visualization of JSON structure',
        'Expandable/collapsible JSON panel',
        'Visual representation of nested objects and arrays',
        'Zoom and pan controls for large structures'
      ],
      gradient: 'from-purple-50 to-purple-100'
    },
    {
      title: 'JSON to Code',
      icon: <CodeOutlined style={{ fontSize: '28px', color: '#059669' }} />,
      path: '/json-to-code',
      description: 'Convert JSON to C# or Java classes.',
      features: [
        'Support for multiple programming languages',
        'Automatic type detection',
        'Proper naming conventions',
        'Nested class generation'
      ],
      gradient: 'from-green-50 to-green-100'
    },
    {
      title: 'JSON to XML',
      icon: <FileTextOutlined style={{ fontSize: '28px', color: '#dc2626' }} />,
      path: '/json-to-xml',
      description: 'Convert JSON to properly formatted XML.',
      features: [
        'Customizable indentation',
        'Special character handling',
        'Array and object support',
        'Real-time conversion'
      ],
      gradient: 'from-red-50 to-red-100'
    },
    {
      title: 'Text Comparer',
      icon: <CompassOutlined style={{ fontSize: '28px', color: '#0891b2' }} />,
      path: '/text-comparer',
      description: 'Compare two texts and find differences.',
      features: [
        'Character-by-character comparison',
        'Difference highlighting',
        'Position tracking',
        'Length comparison'
      ],
      gradient: 'from-cyan-50 to-cyan-100'
    },
    {
      title: 'JSON to Excel/CSV',
      icon: <FileExcelOutlined style={{ fontSize: '28px', color: '#047857' }} />,
      path: '/json-to-excel',
      description: 'Convert JSON to Excel or CSV format.',
      features: [
        'Support for both Excel and CSV formats',
        'Nested object flattening',
        'Array handling',
        'Automatic column generation'
      ],
      gradient: 'from-emerald-50 to-emerald-100'
    }
  ];

  return (
    <div style={{ 
      padding: '80px 24px',
      maxWidth: '1400px',
      margin: '0 auto',
      background: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '80px'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 0'
      }}>
        <Title style={{ 
          fontSize: '3rem',
          fontWeight: '600',
          color: '#334155',
          marginBottom: '24px',
          letterSpacing: '-0.025em'
        }}>
          JSON Tools Suite
        </Title>
        <Paragraph style={{ 
          fontSize: '1.25rem',
          color: '#64748b',
          lineHeight: '1.75',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          A modern collection of tools designed to streamline your JSON workflow.
          Transform, visualize, and convert your data with just a few clicks.
        </Paragraph>
      </div>

      <Row 
        gutter={[32, 32]}
        style={{
          margin: '0 auto',
          width: '100%',
          padding: '40px 0'
        }}
      >
        {features.map((feature) => (
          <Col xs={24} sm={12} lg={8} key={feature.path}>
            <Card
              hoverable
              style={{ 
                height: '100%',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                background: '#ffffff',
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ 
                marginBottom: '12px',
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                display: 'inline-block',
                alignSelf: 'flex-start'
              }}>
                {feature.icon}
              </div>
              <Title level={4} style={{ 
                marginBottom: '0',
                color: '#334155',
                fontSize: '1.5rem',
                fontWeight: '600',
                letterSpacing: '-0.025em'
              }}>
                {feature.title}
              </Title>
              <Text style={{ 
                color: '#64748b',
                display: 'block',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </Text>
              <ul style={{ 
                paddingLeft: '20px',
                margin: '0',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {feature.features.map((item, index) => (
                  <li key={index} style={{ 
                    color: '#64748b',
                    fontSize: '1rem',
                    lineHeight: '1.5'
                  }}>
                    <Text>{item}</Text>
                  </li>
                ))}
              </ul>
              <Link to={feature.path} style={{ marginTop: 'auto' }}>
                <Button 
                  type="primary"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '1.05rem',
                    border: 'none',
                    background: feature.icon.props.style.color,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Try it now
                  <ArrowRightOutlined />
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ padding: '40px 0' }} />
    </div>
  );
};

export default About; 