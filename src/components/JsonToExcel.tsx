import React, { useState } from 'react';
import { Layout, Typography, Row, Col, Input, Card, Button, Select, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const JsonToExcel = () => {
  const [inputJson, setInputJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [exportType, setExportType] = useState<'excel' | 'csv'>('excel');

  const validateAndParseJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        // If it's not an array, wrap it in an array
        return [parsed];
      }
      return parsed;
    } catch (err) {
      throw new Error('Invalid JSON format');
    }
  };

  const flattenObject = (obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (
        typeof obj[key] === 'object' && 
        obj[key] !== null && 
        !Array.isArray(obj[key]) &&
        !(obj[key] instanceof Date)
      ) {
        // For nested objects
        Object.assign(acc, flattenObject(obj[key], pre + key));
      } else if (Array.isArray(obj[key])) {
        // For arrays, stringify each element properly
        acc[pre + key] = obj[key].map((item: any) => 
          typeof item === 'object' ? JSON.stringify(item) : item
        ).join(', ');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // For other objects (like Date)
        acc[pre + key] = JSON.stringify(obj[key]);
      } else {
        // For primitive values
        acc[pre + key] = obj[key];
      }
      return acc;
    }, {});
  };

  const handleExport = () => {
    try {
      if (!inputJson.trim()) {
        message.error('Please enter JSON data');
        return;
      }

      const jsonData = validateAndParseJSON(inputJson);
      
      // Flatten each object in the array
      const flattenedData = jsonData.map((item: any) => flattenObject(item));
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(flattenedData);
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `exported-data-${timestamp}`;

      // Export based on selected format
      if (exportType === 'excel') {
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        message.success('Excel file downloaded successfully');
      } else {
        XLSX.writeFile(workbook, `${filename}.csv`);
        message.success('CSV file downloaded successfully');
      }

      setError(null);
    } catch (err: any) {
      setError(err.message);
      message.error('Failed to convert JSON');
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>JSON to Excel/CSV</Title>
            <Text type="secondary">
              Convert your JSON data to Excel or CSV format
            </Text>
          </div>

          <Row gutter={16}>
            <Col span={24}>
              <Card 
                title="Input JSON" 
                style={{ marginBottom: 16 }}
                extra={
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Select
                      value={exportType}
                      onChange={setExportType}
                      style={{ width: 120 }}
                    >
                      <Option value="excel">
                        <FileExcelOutlined /> Excel
                      </Option>
                      <Option value="csv">
                        <FileTextOutlined /> CSV
                      </Option>
                    </Select>
                    <Button 
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                  </div>
                }
              >
                <TextArea
                  value={inputJson}
                  onChange={(e) => {
                    setInputJson(e.target.value);
                    setError(null);
                  }}
                  placeholder={`Paste your JSON here... Example:
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
]`}
                  autoSize={{ minRows: 15, maxRows: 15 }}
                  style={{ 
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}
                />
                {error && (
                  <div style={{ marginTop: 16 }}>
                    <Text type="danger">{error}</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Supported Formats</Title>
                <Text type="secondary">
                  Export your data to Excel (.xlsx) or CSV format
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Nested Objects</Title>
                <Text type="secondary">
                  Automatically flattens nested objects with dot notation
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Title level={5}>Array Handling</Title>
                <Text type="secondary">
                  Arrays are converted to comma-separated values
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default JsonToExcel; 