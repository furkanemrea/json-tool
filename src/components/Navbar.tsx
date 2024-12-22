import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Nav = styled('nav')`
  background-color: #282828;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled('div')`
  display: flex;
  gap: 2rem;
`;

const StyledLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    color: #61dafb;
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <NavContainer>
        <StyledLink to="/">JSON Tools</StyledLink>
        <NavLinks>
          <StyledLink to="/json-beautifier">Beautifier</StyledLink>
          <StyledLink to="/json-map">JSON Map</StyledLink>
          <StyledLink to="/json-to-code">JSON to Code</StyledLink>
          <StyledLink to="/text-comparer">Text Comparer</StyledLink>
          <StyledLink to="/json-converter">Json Converter</StyledLink>
          <StyledLink to="/about">About</StyledLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 