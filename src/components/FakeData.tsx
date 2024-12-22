import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Card, Select, InputNumber, Button, Space, Radio, message } from 'antd';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';

const { Option } = Select;

interface FakeDataConfig {
  type: 'person' | 'company' | 'product' | 'user' | 'blog' | 'transaction' | 'vehicle' | 'job';
  count: number;
  format: 'json' | 'csv';
}

// Define types for each data structure
interface PersonData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

interface CompanyData {
  id: string;
  name: string;
  catchPhrase: string;
  address: string;
  website: string;
  employee_count: number;
}

interface ProductData {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  stock: number;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  registeredAt: string;
  lastLogin: string;
  isActive: boolean;
  role: string;
}

interface BlogData {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  publishDate: string;
  readTime: number;
  comments: number;
  likes: number;
}

interface TransactionData {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  date: string;
  description: string;
  sender: string;
  recipient: string;
  reference: string;
}

interface VehicleData {
  id: string;
  manufacturer: string;
  model: string;
  type: string;
  fuel: string;
  color: string;
  year: number;
  vin: string;
  price: string;
  mileage: number;
}

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: string;
  department: string;
}

type GeneratedData = PersonData | CompanyData | ProductData | UserData | BlogData | 
                    TransactionData | VehicleData | JobData;

const FakeData: React.FC = () => {
  const [config, setConfig] = useState<FakeDataConfig>({
    type: 'person',
    count: 10,
    format: 'json'
  });
  const [generatedData, setGeneratedData] = useState<GeneratedData[]>([]);

  const generatePersonData = (): PersonData => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode()
    }
  });

  const generateCompanyData = (): CompanyData => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    catchPhrase: faker.company.catchPhrase(),
    address: faker.location.streetAddress(),
    website: faker.internet.url(),
    employee_count: faker.number.int({ min: 10, max: 1000 })
  });

  const generateProductData = (): ProductData => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    stock: faker.number.int({ min: 0, max: 100 })
  });

  const generateUserData = (): UserData => ({
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    registeredAt: faker.date.past().toISOString(),
    lastLogin: faker.date.recent().toISOString(),
    isActive: faker.datatype.boolean(),
    role: ['admin', 'user', 'editor', 'moderator'][faker.number.int({ min: 0, max: 3 })]
  });

  const generateBlogData = (): BlogData => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: faker.person.fullName(),
    tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => faker.word.sample()),
    category: ['Tech', 'Lifestyle', 'Business', 'Travel', 'Food'][faker.number.int({ min: 0, max: 4 })],
    publishDate: faker.date.recent().toISOString(),
    readTime: faker.number.int({ min: 3, max: 15 }),
    comments: faker.number.int({ min: 0, max: 100 }),
    likes: faker.number.int({ min: 0, max: 1000 })
  });

  const generateTransactionData = (): TransactionData => ({
    id: faker.string.uuid(),
    amount: parseFloat(faker.finance.amount()),
    currency: faker.finance.currencyCode(),
    type: ['deposit', 'withdrawal', 'transfer', 'payment'][faker.number.int({ min: 0, max: 3 })],
    status: ['completed', 'pending', 'failed', 'processing'][faker.number.int({ min: 0, max: 3 })],
    date: faker.date.recent().toISOString(),
    description: faker.finance.transactionDescription(),
    sender: faker.finance.accountName(),
    recipient: faker.finance.accountName(),
    reference: faker.finance.transactionDescription()
  });

  const generateVehicleData = (): VehicleData => ({
    id: faker.string.uuid(),
    manufacturer: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    type: faker.vehicle.type(),
    fuel: faker.vehicle.fuel(),
    color: faker.vehicle.color(),
    year: faker.number.int({ min: 2015, max: 2024 }),
    vin: faker.vehicle.vin(),
    price: faker.commerce.price({ min: 5000, max: 50000 }),
    mileage: faker.number.int({ min: 0, max: 150000 })
  });

  const generateJobData = (): JobData => ({
    id: faker.string.uuid(),
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    salary: `$${faker.number.int({ min: 40, max: 200 })}k - $${faker.number.int({ min: 201, max: 300 })}k`,
    type: ['Full-time', 'Part-time', 'Contract', 'Remote'][faker.number.int({ min: 0, max: 3 })],
    description: faker.lorem.paragraphs(2),
    requirements: Array.from({ length: 5 }, () => faker.lorem.sentence()),
    postedDate: faker.date.recent().toISOString(),
    department: faker.commerce.department()
  });

  const generateData = () => {
    const generators = {
      person: generatePersonData,
      company: generateCompanyData,
      product: generateProductData,
      user: generateUserData,
      blog: generateBlogData,
      transaction: generateTransactionData,
      vehicle: generateVehicleData,
      job: generateJobData
    };

    const data = Array.from(
      { length: config.count }, 
      () => generators[config.type]()
    );
    
    setGeneratedData(data);
  };

  const copyToClipboard = () => {
    const text = JSON.stringify(generatedData, null, 2);
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  const downloadData = () => {
    let content = '';
    let filename = `fake-${config.type}-data`;

    if (config.format === 'json') {
      content = JSON.stringify(generatedData, null, 2);
      filename += '.json';
    } else {
      // Convert to CSV
      const headers = Object.keys(generatedData[0]).join(',');
      const rows = generatedData.map(item => 
        Object.values(item).map(value => 
          typeof value === 'object' ? JSON.stringify(value) : value
        ).join(',')
      );
      content = [headers, ...rows].join('\n');
      filename += '.csv';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Helmet>
        <title>Fake Data Generator - Create Sample Data | FEKA Tools</title>
        <meta name="description" content="Generate fake data for testing and development. Create sample person, company, product, user, blog, transaction, vehicle, and job data in JSON or CSV format." />
        <meta name="keywords" content="fake data generator, sample data, test data generator, mock data, dummy data creator" />
      </Helmet>

      <Card title="Fake Data Generator" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space>
            <Select 
              value={config.type}
              onChange={type => setConfig({ ...config, type })}
              style={{ width: 200 }}
            >
              <Option value="person">Person</Option>
              <Option value="company">Company</Option>
              <Option value="product">Product</Option>
              <Option value="user">User</Option>
              <Option value="blog">Blog Post</Option>
              <Option value="transaction">Transaction</Option>
              <Option value="vehicle">Vehicle</Option>
              <Option value="job">Job Listing</Option>
            </Select>

            <InputNumber
              min={1}
              max={100}
              value={config.count}
              onChange={count => setConfig({ ...config, count: count || 1 })}
              placeholder="Count"
            />

            <Radio.Group 
              value={config.format}
              onChange={e => setConfig({ ...config, format: e.target.value })}
            >
              <Radio.Button value="json">JSON</Radio.Button>
              <Radio.Button value="csv">CSV</Radio.Button>
            </Radio.Group>

            <Button type="primary" onClick={generateData}>
              Generate
            </Button>
          </Space>

          {generatedData.length > 0 && (
            <>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '4px',
                maxHeight: '500px',
                overflow: 'auto'
              }}>
                {JSON.stringify(generatedData, null, 2)}
              </pre>

              <Space>
                <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
                  Copy to Clipboard
                </Button>
                <Button icon={<DownloadOutlined />} onClick={downloadData}>
                  Download
                </Button>
              </Space>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default FakeData; 