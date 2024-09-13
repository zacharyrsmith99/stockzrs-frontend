import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles/App.css';
import TopInstruments from './components/TopInstruments';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="content-wrapper">
            <h1>stockzrs</h1>
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/about">About</Link>
            </nav>
          </div>
        </header>
        <main className="app-main">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={
                <div className="dashboard">
                  <TopInstruments />
                </div>
              } />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>
        <footer className="app-footer">
          <div className="content-wrapper">
            <div className="footer-content">
              <div className="footer-left">
                <p>2024 stockzrs - A portfolio project demonstrating real-time financial data processing.</p>
              </div>
              <div className="footer-right">
                <a href="mailto:zachary.r.smith99@gmail.com">Email</a>
                <a href="https://www.linkedin.com/in/zachary-smith-4581141b2/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/zacharyrsmith99" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;