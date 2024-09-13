import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div style={{
      backgroundColor: '#FEE2E2',
      border: '1px solid #FCA5A5',
      borderRadius: '8px',
      padding: '16px',
      margin: '20px auto',
      maxWidth: '400px',
      textAlign: 'center',
      color: '#DC2626',
      fontSize: '14px',
      lineHeight: '1.5',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>Oops! Something went wrong</h3>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
