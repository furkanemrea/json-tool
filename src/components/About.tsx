import React from 'react';
import styled from '@emotion/styled';

const Container = styled('div')`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Section = styled('div')`
  margin-bottom: 2rem;
`;

const Title = styled('h1')`
  color: #61dafb;
  margin-bottom: 1.5rem;
`;

const SubTitle = styled('h2')`
  color: #61dafb;
  margin-bottom: 1rem;
`;

const About = () => {
  return (
    <Container>
      <Title>JSON Tools</Title>
      
      <Section>
        <SubTitle>JSON Beautifier</SubTitle>
        <ul>
          <li>Instant JSON formatting and validation</li>
          <li>Real-time error detection</li>
          <li>Copy formatted JSON with one click</li>
          <li>Clean and readable output format</li>
        </ul>
      </Section>

      <Section>
        <SubTitle>JSON Map Visualizer</SubTitle>
        <ul>
          <li>Interactive visualization of JSON structure</li>
          <li>Easy navigation through complex JSON data</li>
          <li>Visual representation of nested objects and arrays</li>
          <li>Helps understand data hierarchies</li>
        </ul>
      </Section>
    </Container>
  );
};

export default About; 