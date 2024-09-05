const About = () => {
  return (
    <div className="about">
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      <h1 style={{
        color: '#3B82F6',
        marginBottom: '30px',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'relative',
        padding: '15px 0',
      }}>
        About stockzrs
        <span style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '4px',
          backgroundColor: '#3B82F6',
          borderRadius: '2px',
        }}></span>
      </h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e', marginBottom: '20px' }}>
        Welcome to stockzrs! This website is a demo project created for <a href="https://www.linkedin.com/in/zachary-smith-4581141b2/" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none', borderBottom: '1px dotted #3498db' }}>my portfolio</a>.
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e', marginBottom: '20px' }}>
        The main features of this demo include:
      </p>
      <ul style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e', marginBottom: '20px', paddingLeft: '20px' }}>
        <li>Infrastructure managed via Terraform - <a href="https://github.com/zacharyrsmith99/stockzrs-terraform" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
        <li>Fully managed containerized services inside of an AWS Kubernetes Cluster - <a href="https://github.com/zacharyrsmith99/stockzrs-terraform" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
        <li>Real-time financial updates from multiple WebSocket financial vendors via a TypeScript NodeJS "relay service" - <a href="https://github.com/zacharyrsmith99/stockzrs-relay-service" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
        <li>Real-time financial updates pointing towards a TimescaleDB instance (WIP) with the help of Kafka and AWS Lambda functions - <a href="https://github.com/zacharyrsmith99/stockzrs-terraform" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
        <li>Interactive charts for visualizing trends pointing to a FastAPI Python backend service (WIP)</li>
        <li>A frontend website built in React for basic visualization - <a href="https://github.com/zacharyrsmith99/stockzrs-frontend" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
      </ul>
      <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e' }}>
        For any questions about this project, please use the contact information provided.
      </p>
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <p style={{ fontSize: '14px', lineHeight: '1.4', color: '#6c757d' }}>
          <strong>Disclaimer:</strong> The financial data displayed is purely for demonstration purposes. It should not be used for actual trading or investing. This project does not claim to provide accurate or up-to-date financial information.
        </p>
      </div>
    </div></div>
  );
};

export default About;