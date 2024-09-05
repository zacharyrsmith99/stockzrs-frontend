import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import TopInstruments from './TopInstruments'
import About from './About'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

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
                  <div className="chart-container">
                    <h2>Placeholder</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              } />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>
        <footer className="app-footer">
          <div className="content-wrapper">
            <p>2024 stockzrs portfolio project</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App