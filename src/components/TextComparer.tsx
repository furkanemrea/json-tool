import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Input, Card, Alert } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const TextComparer = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [comparison, setComparison] = useState<{
    match: boolean;
    position?: number;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ match: true, message: 'Enter text to compare', type: 'info' });

  useEffect(() => {
    if (!text1 && !text2) {
      setComparison({
        match: true,
        message: 'Enter text to compare',
        type: 'info'
      });
      return;
    }

    if (!text1 || !text2) {
      setComparison({
        match: false,
        message: 'Please enter text in both fields',
        type: 'info'
      });
      return;
    }

    let mismatchIndex = -1;
    const minLength = Math.min(text1.length, text2.length);

    for (let i = 0; i < minLength; i++) {
      if (text1[i] !== text2[i]) {
        mismatchIndex = i;
        break;
      }
    }

    if (mismatchIndex === -1 && text1.length !== text2.length) {
      mismatchIndex = minLength;
    }

    if (mismatchIndex === -1) {
      setComparison({
        match: true,
        message: 'Texts match perfectly!',
        type: 'success'
      });
    } else {
      const beforeMismatch = text1.slice(Math.max(0, mismatchIndex - 20), mismatchIndex);
      const afterMismatch = text1.slice(mismatchIndex, mismatchIndex + 20);
      const mismatchChar1 = text1[mismatchIndex] || '(end of text)';
      const mismatchChar2 = text2[mismatchIndex] || '(end of text)';

      setComparison({
        match: false,
        position: mismatchIndex,
        message: `Mismatch at position ${mismatchIndex + 1}: 
                 "${beforeMismatch}[${mismatchChar1}]${afterMismatch}" vs 
                 "${beforeMismatch}[${mismatchChar2}]${afterMismatch}"`,
        type: 'error'
      });
    }
  }, [text1, text2]);

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>Text Comparer</Title>
            <Text type="secondary">
              Compare two texts and find differences
            </Text>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="Text 1" style={{ marginBottom: 16 }}>
                <TextArea
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="Enter first text here..."
                  autoSize={{ minRows: 10, maxRows: 10 }}
                  style={{ 
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Text 2" style={{ marginBottom: 16 }}>
                <TextArea
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="Enter second text here..."
                  autoSize={{ minRows: 10, maxRows: 10 }}
                  style={{ 
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Alert
                message={comparison.type === 'error' ? 'Mismatch Found' : 'Comparison Result'}
                description={comparison.message}
                type={comparison.type}
                showIcon
              />
            </Col>
          </Row>

          {comparison.position !== undefined && comparison.type === 'error' && (
            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card size="small" title="Comparison Details">
                  <Text>
                    Character position: {comparison.position + 1}
                    <br />
                    Text 1 length: {text1.length} characters
                    <br />
                    Text 2 length: {text2.length} characters
                  </Text>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default TextComparer; 