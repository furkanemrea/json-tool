import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Input, Card, Button, message, Select } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const JsonToXml = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputXml, setOutputXml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState<number>(2);

  const jsonToXml = (obj: any, rootName: string = 'root', level: number = 0): string => {
    const indent = ' '.repeat(indentSize * level);
    
    const convertValue = (value: any, key: string, currentLevel: number): string => {
      if (value === null) return `${' '.repeat(indentSize * currentLevel)}<${key}/>`;
      
      if (Array.isArray(value)) {
        return value.map(item => jsonToXml(item, key, currentLevel)).join('\n');
      }
      
      if (typeof value === 'object') {
        return jsonToXml(value, key, currentLevel);
      }
      
      const escapedValue = String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      
      return `${' '.repeat(indentSize * currentLevel)}<${key}>${escapedValue}</${key}>`;
    };

    if (typeof obj !== 'object' || obj === null) {
      return `${indent}<${rootName}>${obj}</${rootName}>`;
    }

    let xml = `${indent}<${rootName}>`;
    const nextLevel = level + 1;

    if (Object.keys(obj).length > 0) {
      xml += '\n';
      for (const [key, value] of Object.entries(obj)) {
        xml += convertValue(value, key, nextLevel) + '\n';
      }
      xml += indent;
    }
    
    xml += `</${rootName}>`;
    return xml;
  };

  useEffect(() => {
    if (!inputJson) {
      setOutputXml('');
      setError(null);
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      const xml = jsonToXml(parsedJson);
      setOutputXml(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`);
      setError(null);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputXml('');
    }
  }, [inputJson, indentSize]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputXml);
      setCopied(true);
      message.success('XML copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error('Failed to copy XML');
    }
  };

  const handleIndentChange = (value: number) => {
    setIndentSize(value);
  };

  const textAreaStyle = {
    height: '500px',
    fontFamily: 'monospace',
    fontSize: '13px',
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>JSON to XML Converter</Title>
            <Text type="secondary">
              Convert your JSON data to XML format with proper formatting
            </Text>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="Input JSON"
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
                title="Output XML"
                extra={
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Select
                      value={indentSize}
                      onChange={handleIndentChange}
                      style={{ width: 100 }}
                    >
                      <Select.Option value={2}>2 spaces</Select.Option>
                      <Select.Option value={4}>4 spaces</Select.Option>
                      <Select.Option value={8}>8 spaces</Select.Option>
                    </Select>
                    <Button
                      type="text"
                      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={handleCopy}
                      disabled={!outputXml}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                }
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: '12px' }}
              >
                <pre
                  style={{
                    ...textAreaStyle,
                    margin: 0,
                    padding: '8px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    overflow: 'auto',
                  }}
                >
                  {outputXml || 'XML output will appear here'}
                </pre>
              </Card>
            </Col>
          </Row>

          {/* Features Section */}
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Real-time Conversion</Title>
                <Text type="secondary">
                  See your XML output instantly as you type
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Proper Formatting</Title>
                <Text type="secondary">
                  Automatically formats XML with customizable indentation
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Special Character Handling</Title>
                <Text type="secondary">
                  Properly escapes special XML characters
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default JsonToXml; 