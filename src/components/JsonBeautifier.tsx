import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Row, Col, Input, Card, Button, message } from 'antd';
import { CopyOutlined, CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const JsonBeautifier = () => {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputJson) {
      setFormattedJson('');
      setError(null);
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      const beautified = JSON.stringify(parsedJson, null, 2);
      setFormattedJson(beautified);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
      setFormattedJson('');
    }
  }, [inputJson]);

  const handleCopy = async () => {
    if (formattedJson) {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      message.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const textAreaStyle = {
    height: '500px',
    fontFamily: 'monospace',
    fontSize: '13px',
  };

  const preStyle = {
    height: '500px',
    margin: 0,
    padding: '8px',
    backgroundColor: '#fafafa',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '13px',
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>JSON Beautifier</Title>
            <Text type="secondary">
              Transform your JSON into a clean, readable format instantly
            </Text>
          </div>

          {/* Main Content */}
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="Input JSON"
                extra={
                  <Link to="/json-map">
                    <Button type="link" icon={<ArrowRightOutlined />}>
                      View as Map
                    </Button>
                  </Link>
                }
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: '12px' }}
              >
                <TextArea
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  placeholder="Paste your JSON here..."
                  style={textAreaStyle}
                />
                {error && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="danger">{error}</Text>
                  </div>
                )}
              </Card>
            </Col>

            <Col span={12}>
              <Card
                title="Formatted JSON"
                extra={
                  <Button
                    type="link"
                    icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={handleCopy}
                    disabled={!formattedJson}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                }
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: '12px' }}
              >
                <pre style={preStyle}>
                  {formattedJson || 'Formatted JSON will appear here'}
                </pre>
              </Card>
            </Col>
          </Row>

          {/* Features Section */}
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Instant Formatting</Title>
                <Text type="secondary">
                  Your JSON is formatted in real-time as you type
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Validation</Title>
                <Text type="secondary">
                  Invalid JSON is detected automatically with helpful error messages
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Visualization</Title>
                <Text type="secondary">
                  Switch to Map view to visualize your JSON structure
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default JsonBeautifier;
