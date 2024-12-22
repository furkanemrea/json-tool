import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Input, Card, Button, message, Select } from 'antd';
import { CopyOutlined, CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const JsonToCode = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('csharp');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getJavaType = (value: any): string => {
    if (value === null || value === undefined) return "String";
    
    switch (typeof value) {
      case 'string':
        if (/^\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2}/.test(value)) {
          return "LocalDateTime";
        }
        return "String";
      case 'number':
        return Number.isInteger(value) ? "Integer" : "Double";
      case 'boolean':
        return "Boolean";
      case 'object':
        if (Array.isArray(value)) {
          if (value.length === 0) return "List<Object>";
          return `List<${getJavaType(value[0])}>`;
        }
        return "Object";
      default:
        return "Object";
    }
  };

  const getCSharpType = (value: any): string => {
    if (value === null || value === undefined) return "string";
    
    switch (typeof value) {
      case 'string':
        if (/^\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2}/.test(value)) {
          return "DateTime";
        }
        return "string";
      case 'number':
        return Number.isInteger(value) ? "int" : "decimal";
      case 'boolean':
        return "bool";
      case 'object':
        if (Array.isArray(value)) {
          if (value.length === 0) return "List<object>";
          return `List<${getCSharpType(value[0])}>`;
        }
        return "object";
      default:
        return "object";
    }
  };

  const convertJsonToJava = (json: string): string => {
    try {
      const processedClasses = new Set<string>();
      let allClasses = '';

      const generateClass = (obj: any, className: string): string => {
        if (processedClasses.has(className)) {
          return '';
        }
        processedClasses.add(className);

        let classContent = `public class ${className} {\n`;
        const fields: string[] = [];
        const gettersSetters: string[] = [];
        
        Object.entries(obj).forEach(([key, value]) => {
          const propertyName = key.charAt(0).toLowerCase() + key.slice(1);
          const capitalizedName = key.charAt(0).toUpperCase() + key.slice(1);
          
          if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
              const itemClassName = `${capitalizedName}Item`;
              fields.push(`    private List<${itemClassName}> ${propertyName};`);
              const nestedClass = generateClass(value[0], itemClassName);
              if (nestedClass) {
                allClasses += nestedClass;
              }
            } else {
              const itemType = value.length > 0 ? getJavaType(value[0]) : "Object";
              fields.push(`    private List<${itemType}> ${propertyName};`);
            }
            // Generate getter and setter
            gettersSetters.push(`    public List<${value.length > 0 && typeof value[0] === 'object' && value[0] !== null ? `${capitalizedName}Item` : getJavaType(value[0])}> get${capitalizedName}() {\n        return ${propertyName};\n    }`);
            gettersSetters.push(`    public void set${capitalizedName}(List<${value.length > 0 && typeof value[0] === 'object' && value[0] !== null ? `${capitalizedName}Item` : getJavaType(value[0])}> ${propertyName}) {\n        this.${propertyName} = ${propertyName};\n    }\n`);
          } else if (typeof value === 'object' && value !== null) {
            const nestedClassName = `${capitalizedName}Type`;
            fields.push(`    private ${nestedClassName} ${propertyName};`);
            const nestedClass = generateClass(value, nestedClassName);
            if (nestedClass) {
              allClasses += nestedClass;
            }
            // Generate getter and setter
            gettersSetters.push(`    public ${nestedClassName} get${capitalizedName}() {\n        return ${propertyName};\n    }`);
            gettersSetters.push(`    public void set${capitalizedName}(${nestedClassName} ${propertyName}) {\n        this.${propertyName} = ${propertyName};\n    }\n`);
          } else {
            const type = getJavaType(value);
            fields.push(`    private ${type} ${propertyName};`);
            // Generate getter and setter
            gettersSetters.push(`    public ${type} get${capitalizedName}() {\n        return ${propertyName};\n    }`);
            gettersSetters.push(`    public void set${capitalizedName}(${type} ${propertyName}) {\n        this.${propertyName} = ${propertyName};\n    }\n`);
          }
        });
        
        classContent += fields.join('\n') + '\n\n';
        classContent += gettersSetters.join('\n');
        classContent += '}\n\n';
        return classContent;
      };

      let parsedJson = JSON.parse(json);
      
      // If the root is an array, wrap it in an object with 'items' property
      if (Array.isArray(parsedJson)) {
        parsedJson = {
          items: parsedJson
        };
      }

      const mainClass = generateClass(parsedJson, 'Root');
      return `import java.time.LocalDateTime;\nimport java.util.List;\n\n${mainClass}${allClasses}`;
    } catch (error) {
      console.error('Error converting JSON to Java:', error);
      throw new Error('Failed to convert JSON to Java classes');
    }
  };

  const convertJsonToCSharp = (json: string): string => {
    try {
      const processedClasses = new Set<string>();
      let allClasses = '';

      const generateClass = (obj: any, className: string): string => {
        if (processedClasses.has(className)) {
          return '';
        }
        processedClasses.add(className);

        let classContent = `    public class ${className}\n    {\n`;
        
        Object.entries(obj).forEach(([key, value]) => {
          const propertyName = key.charAt(0).toUpperCase() + key.slice(1);
          
          if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
              const itemClassName = `${propertyName}Item`;
              classContent += `        public List<${itemClassName}> ${propertyName} { get; set; }\n`;
              const nestedClass = generateClass(value[0], itemClassName);
              if (nestedClass) {
                allClasses += nestedClass;
              }
            } else {
              const itemType = value.length > 0 ? getCSharpType(value[0]) : "object";
              classContent += `        public List<${itemType}> ${propertyName} { get; set; }\n`;
            }
          } else if (typeof value === 'object' && value !== null) {
            const nestedClassName = `${propertyName}Type`;
            classContent += `        public ${nestedClassName} ${propertyName} { get; set; }\n`;
            const nestedClass = generateClass(value, nestedClassName);
            if (nestedClass) {
              allClasses += nestedClass;
            }
          } else {
            const type = getCSharpType(value);
            classContent += `        public ${type} ${propertyName} { get; set; }\n`;
          }
        });
        
        classContent += `    }\n\n`;
        return classContent;
      };

      let parsedJson = JSON.parse(json);
      
      // If the root is an array, wrap it in an object with 'items' property
      if (Array.isArray(parsedJson)) {
        parsedJson = {
          items: parsedJson
        };
      }

      const mainClass = generateClass(parsedJson, 'Root');
      return `using System;\nusing System.Collections.Generic;\n\nnamespace JsonGeneratedModels\n{\n${mainClass}${allClasses}}`;
    } catch (error) {
      console.error('Error converting JSON to C#:', error);
      throw new Error('Failed to convert JSON to C# classes');
    }
  };

  useEffect(() => {
    if (!inputJson) {
      setOutputCode('');
      setError(null);
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      if (selectedLanguage === 'csharp') {
        const csharpCode = convertJsonToCSharp(inputJson);
        setOutputCode(csharpCode);
      } else if (selectedLanguage === 'java') {
        const javaCode = convertJsonToJava(inputJson);
        setOutputCode(javaCode);
      }
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
      setOutputCode('');
    }
  }, [inputJson, selectedLanguage]);

  const handleCopy = async () => {
    if (outputCode) {
      await navigator.clipboard.writeText(outputCode);
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
    <>
      <Helmet>
        <title>JSON to Code Converter - Generate C# & Java Classes | FEKA Tools</title>
        <meta name="description" content="Convert JSON to C# or Java classes instantly. Automatic type detection, proper naming conventions, and nested class generation for your development needs." />
        <meta name="keywords" content="json to c#, json to java, json to class converter, json to code generator, convert json to class, json to c# class, json to java class, json2code" />
      </Helmet>
      <Layout>
        <Content style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={2} style={{ marginBottom: 8 }}>JSON to Code</Title>
              <Text type="secondary">
                Convert your JSON to C# or Java classes
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
                  title="Generated Code"
                  extra={
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Select
                        value={selectedLanguage}
                        onChange={setSelectedLanguage}
                        style={{ width: 120 }}
                      >
                        <Option value="csharp">C#</Option>
                        <Option value="java">Java</Option>
                      </Select>
                      <Button
                        type="text"
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={handleCopy}
                        disabled={!outputCode}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  }
                  style={{ marginBottom: 16 }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <pre style={preStyle}>
                    {outputCode || 'Generated code will appear here'}
                  </pre>
                </Card>
              </Col>
            </Row>

            {/* Features Section */}
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={8}>
                <Card size="small">
                  <Title level={5}>Multiple Languages</Title>
                  <Text type="secondary">
                    Support for C# and Java class generation
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Title level={5}>Proper Formatting</Title>
                  <Text type="secondary">
                    Generated code follows language conventions
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Title level={5}>Type Detection</Title>
                  <Text type="secondary">
                    Automatically detects and assigns proper data types
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

export default JsonToCode; 