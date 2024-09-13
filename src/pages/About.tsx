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
          Welcome to stockzrs! This website showcases a comprehensive, end-to-end financial data processing and visualization system. It's a demonstration of modern cloud-native architecture and real-time data handling capabilities, created by <a href="https://www.linkedin.com/in/zachary-smith-4581141b2/" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none', borderBottom: '1px dotted #3498db' }}>Zachary Smith</a>.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e', marginBottom: '20px' }}>
          The project demonstrates expertise in cloud infrastructure, containerization, real-time data processing, and full-stack development. Key features include:
        </p>
        <ul style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e', marginBottom: '20px', paddingLeft: '20px' }}>
          <li>Infrastructure as Code (IaC) with Terraform - <a href="https://github.com/zacharyrsmith99/stockzrs-terraform" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
          <li>Containerized microservices architecture deployed on AWS EKS (Elastic Kubernetes Service) - <a href="https://github.com/zacharyrsmith99/stockzrs-terraform" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
          <li>Real-time financial data integration from multiple WebSocket vendors (Coinbase, TwelveData) via a TypeScript Node.js relay service - <a href="https://github.com/zacharyrsmith99/stockzrs-relay-service" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
          <li>Event-driven architecture using Kafka for reliable data streaming and processing</li>
          <li>Data aggregation service for processing financial updates into minute intervals - <a href="https://github.com/zacharyrsmith99/stockzrs-financial-aggregator-service" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
          <li>Persistent storage solution using AWS RDS (PostgreSQL) for historical data retention - <a href="https://github.com/zacharyrsmith99/stockzrs-sql-migrations" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
          <li>FastAPI-powered Python backend for efficient data retrieval and analytics - <a href="https://github.com/zacharyrsmith99/stockzrs-metrics-service" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
          <li>Modern, responsive React frontend for intuitive data visualization - <a href="https://github.com/zacharyrsmith99/stockzrs-frontend" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>View on GitHub</a></li>
        </ul>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e', marginBottom: '20px' }}>
          This project showcases a full-stack approach to building a scalable, real-time financial data platform. It demonstrates proficiency in cloud services, containerization, microservices architecture, event streaming, and both frontend and backend development.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#34495e' }}>
          For any questions about this project or to discuss potential collaborations, please use the contact information provided.
        </p>
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ fontSize: '14px', lineHeight: '1.4', color: '#6c757d' }}>
            <strong>Disclaimer:</strong> The financial data displayed is purely for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;