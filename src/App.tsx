import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import TopInstruments from './components/TopInstruments'
import About from './About'

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
            <p>&copy; 2024 stockzrs portfolio project</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App