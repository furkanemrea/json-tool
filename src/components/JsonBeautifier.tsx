import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Row, Col, Input, Card, Button, message, Checkbox } from 'antd';
import { CopyOutlined, CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { JSONTree } from 'react-json-tree';
import { Helmet } from 'react-helmet-async';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

// Add an error boundary component
class JsonViewerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('JsonViewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text type="danger">Something went wrong with the JSON viewer.</Text>;
    }
    return this.props.children;
  }
}

const JsonBeautifier = () => {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [useTreeView, setUseTreeView] = useState(false);
  const [parsedJson, setParsedJson] = useState<any>(null);

  // Memoize the JSON parsing function
  const parseJson = useCallback((input: string) => {
    if (!input) {
      setFormattedJson('');
      setError(null);
      setParsedJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const beautified = JSON.stringify(parsed, null, 2);
      setFormattedJson(beautified);
      setParsedJson(parsed);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
      setFormattedJson('');
      setParsedJson(null);
    }
  }, []);

  useEffect(() => {
    parseJson(inputJson);
    return () => {
      // Cleanup function
      setFormattedJson('');
      setParsedJson(null);
      setError(null);
    };
  }, [inputJson, parseJson]);

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

  const jsonTreeTheme = {
    scheme: 'default',
    base00: '#fff',
    base0B: '#064',  // strings & date values
    base0D: '#06f',  // boolean, number, null
    base08: '#c22',  // null, undefined
    base0A: '#999',  // float
    base0E: '#708'   // keys
  };

  return (
    <>
      <Helmet>
        <title>JSON Beautifier - Format & Validate JSON | FEKA Tools</title>
        <meta name="description" content="Free online JSON beautifier tool. Format, validate and make your JSON pretty with instant formatting, real-time error detection, and one-click copy feature." />
        <meta name="keywords" content="json beautifier, json formatter, json validator, pretty print json, format json online, json pretty printer" />
      </Helmet>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Checkbox
                        checked={useTreeView}
                        onChange={(e) => setUseTreeView(e.target.checked)}
                      >
                        Tree View
                      </Checkbox>
                      <Button
                        type="link"
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={handleCopy}
                        disabled={!formattedJson}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  }
                  style={{ marginBottom: 16 }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <JsonViewerErrorBoundary>
                    {useTreeView && parsedJson ? (
                      <div style={{ ...preStyle, backgroundColor: 'white' }}>
                        <JSONTree 
                          data={parsedJson}
                          theme={jsonTreeTheme}
                          invertTheme={false}
                          shouldExpandNode={() => true}
                        />
                      </div>
                    ) : (
                      <pre style={preStyle}>
                        {formattedJson || 'Formatted JSON will appear here'}
                      </pre>
                    )}
                  </JsonViewerErrorBoundary>
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
    </>
  );
};

export default JsonBeautifier;
