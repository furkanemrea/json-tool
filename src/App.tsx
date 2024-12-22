import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Navbar from './components/Navbar.tsx';
import About from './components/About.tsx';
import JsonMap from './components/JsonMap.tsx';
import JsonBeautifier from './components/JsonBeautifier.tsx';
import 'antd/dist/reset.css';
import JsonToCode from './components/JsonToCode.tsx';
import TextComparer from './components/TextComparer.tsx';
import JsonToExcel from './components/JsonToExcel.tsx';
import JsonToXml from './components/JsonToXml.tsx';

const AppContainer = styled.div`
  min-height: 100vh;
  background: rgb(248, 250, 252);
  color: #ffffff;
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/json-beautifier" element={<JsonBeautifier />} />
        <Route path="/json-map" element={<JsonMap />} />
        <Route path="/json-to-code" element={<JsonToCode />} />
        <Route path="/text-comparer" element={<TextComparer />} />
        <Route path="/json-converter" element={<JsonToExcel />} />
        <Route path="/json-to-xml" element={<JsonToXml />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
