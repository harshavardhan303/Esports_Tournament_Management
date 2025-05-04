import React from 'react';
import styled from 'styled-components';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const AlertContainer = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#d4edda';
      case 'danger': return '#f8d7da';
      case 'warning': return '#fff3cd';
      default: return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'danger': return '#721c24';
      case 'warning': return '#856404';
      default: return '#0c5460';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#c3e6cb';
      case 'danger': return '#f5c6cb';
      case 'warning': return '#ffeeba';
      default: return '#bee5eb';
    }
  }};
`;

const IconWrapper = styled.div`
  margin-right: 0.75rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const Alert = ({ children, type = 'info' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'danger':
        return <FaTimesCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <AlertContainer type={type}>
      <IconWrapper>{getIcon()}</IconWrapper>
      <AlertContent>{children}</AlertContent>
    </AlertContainer>
  );
};

export default Alert;
