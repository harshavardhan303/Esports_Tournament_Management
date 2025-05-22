import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.$fullPage ? '3rem' : '1rem'};
  height: ${props => props.$fullPage ? '70vh' : 'auto'};
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #1a2a6c;
  width: ${props =>
    props.$size === 'small' ? '20px' :
    props.$size === 'large' ? '60px' : '40px'};
  height: ${props =>
    props.$size === 'small' ? '20px' :
    props.$size === 'large' ? '60px' : '40px'};
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #1a2a6c;
  font-weight: 500;
  margin: 0;
`;

const Loader = ({ text = 'Loading...', size = 'medium', fullPage = false }) => {
  return (
    <LoaderContainer $fullPage={fullPage}>
      <SpinnerWrapper>
        <Spinner $size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </SpinnerWrapper>
    </LoaderContainer>
  );
};

export default Loader;
