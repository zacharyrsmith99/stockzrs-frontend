import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles/App.css';
import TopInstruments from './components/TopInstruments';
import About from './pages/About';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { TimezoneProvider } from './contexts/TimezoneContext';

function App() {
  return (
    <WebSocketProvider>
      <TimezoneProvider>
        <Router>
          <div className="App min-h-screen flex flex-col bg-gray-100">
            <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="content-wrapper py-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">stockzrs</h1>
                  <nav className="space-x-4">
                    <Link to="/" className="text-white hover:text-blue-200 px-4 py-2 rounded-full bg-blue-500 bg-opacity-30 hover:bg-opacity-50 transition-colors duration-200">Dashboard</Link>
                    <Link to="/about" className="text-white hover:text-blue-200 px-4 py-2 rounded-full bg-blue-500 bg-opacity-30 hover:bg-opacity-50 transition-colors duration-200">About</Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-grow">
              <div className="content-wrapper py-8">
                <Routes>
                  <Route path="/" element={<TopInstruments />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </div>
            </main>
            <footer className="bg-gray-800 text-white">
              <div className="content-wrapper py-6">
                <div className="footer-content flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="footer-left">
                    <p className="text-gray-300">2024 stockzrs - A portfolio project demonstrating real-time financial data processing.</p>
                  </div>
                  <div className="footer-right space-x-4">
                    <a href="mailto:zachary.r.smith99@gmail.com" className="text-blue-300 hover:text-blue-100">Email</a>
                    <a href="https://www.linkedin.com/in/zachary-smith-4581141b2/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-100">LinkedIn</a>
                    <a href="https://github.com/zacharyrsmith99" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-100">GitHub</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </TimezoneProvider>
    </WebSocketProvider>
  );
}

export default App;