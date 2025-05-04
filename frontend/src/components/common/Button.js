import React from 'react';
import styled, { css } from 'styled-components';

const ButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.small ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  border-radius: 4px;
  font-weight: 600;
  font-size: ${props => props.small ? '0.875rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const PrimaryButton = styled.button`
  ${ButtonStyles}
  background: ${props => props.outline ? 'transparent' : '#1a2a6c'};
  color: ${props => props.outline ? '#1a2a6c' : 'white'};
  border: ${props => props.outline ? '2px solid #1a2a6c' : 'none'};
  
  &:hover:not(:disabled) {
    background: ${props => props.outline ? 'rgba(26, 42, 108, 0.1)' : '#15225a'};
  }
`;

const SecondaryButton = styled.button`
  ${ButtonStyles}
  background: ${props => props.outline ? 'transparent' : '#b21f1f'};
  color: ${props => props.outline ? '#b21f1f' : 'white'};
  border: ${props => props.outline ? '2px solid #b21f1f' : 'none'};
  
  &:hover:not(:disabled) {
    background: ${props => props.outline ? 'rgba(178, 31, 31, 0.1)' : '#9a1b1b'};
  }
`;

const SuccessButton = styled.button`
  ${ButtonStyles}
  background: ${props => props.outline ? 'transparent' : '#28a745'};
  color: ${props => props.outline ? '#28a745' : 'white'};
  border: ${props => props.outline ? '2px solid #28a745' : 'none'};
  
  &:hover:not(:disabled) {
    background: ${props => props.outline ? 'rgba(40, 167, 69, 0.1)' : '#218838'};
  }
`;

const DangerButton = styled.button`
  ${ButtonStyles}
  background: ${props => props.outline ? 'transparent' : '#dc3545'};
  color: ${props => props.outline ? '#dc3545' : 'white'};
  border: ${props => props.outline ? '2px solid #dc3545' : 'none'};
  
  &:hover:not(:disabled) {
    background: ${props => props.outline ? 'rgba(220, 53, 69, 0.1)' : '#c82333'};
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  outline = false, 
  small = false, 
  onClick, 
  disabled = false,
  type = 'button',
  ...props 
}) => {
  switch (variant) {
    case 'secondary':
      return (
        <SecondaryButton 
          outline={outline} 
          small={small} 
          onClick={onClick} 
          disabled={disabled}
          type={type}
          {...props}
        >
          {children}
        </SecondaryButton>
      );
    case 'success':
      return (
        <SuccessButton 
          outline={outline} 
          small={small} 
          onClick={onClick} 
          disabled={disabled}
          type={type}
          {...props}
        >
          {children}
        </SuccessButton>
      );
    case 'danger':
      return (
        <DangerButton 
          outline={outline} 
          small={small} 
          onClick={onClick} 
          disabled={disabled}
          type={type}
          {...props}
        >
          {children}
        </DangerButton>
      );
    default:
      return (
        <PrimaryButton 
          outline={outline} 
          small={small} 
          onClick={onClick} 
          disabled={disabled}
          type={type}
          {...props}
        >
          {children}
        </PrimaryButton>
      );
  }
};

export default Button;
