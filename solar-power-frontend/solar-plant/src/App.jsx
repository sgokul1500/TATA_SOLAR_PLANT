import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [acCapacity, setAcCapacity] = useState('');
  const [dcCapacity, setDcCapacity] = useState('');
  const [incrementalDcCapacity, setIncrementalDcCapacity] = useState('');
  const [timeInterval, setTimeInterval] = useState('15');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const formattedStartDate = startDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
        const formattedEndDate = endDate.toLocaleDateString('en-GB');

        const response = await axios.post('http://localhost:5000/api/generate-curve', {
            acCapacity: parseFloat(acCapacity),
            dcCapacity: parseFloat(dcCapacity),
            incrementalDcCapacity: parseFloat(incrementalDcCapacity),
            timeInterval: parseInt(timeInterval),
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });

        setGraphData(response.data);
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating curves. Please check your inputs and try again.');
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="app-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="logo">
          <h1>Solar Plant</h1>
        </div>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#statistics">Statistics</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-slider">
          <div className="slide"></div>
          <div className="slide"></div>
          <div className="slide"></div>
          <div className="slide"></div>
        </div>
        <div className="hero-content">
          <h1>Welcome to Solar Plant Analysis</h1>
          <p>Optimize your solar power generation with our advanced analytics</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About Our Solar Plant Analysis</h2>
        <div className="about-grid">
          <div className="about-item">
            <h3>Our Mission</h3>
            <p>To provide accurate and reliable solar power generation analysis tools that help optimize renewable energy systems.</p>
          </div>
          <div className="about-item">
            <h3>How It Works</h3>
            <ol>
              <li>Input your plant specifications</li>
              <li>Select your desired time interval</li>
              <li>Generate detailed power curves</li>
              <li>Analyze the results</li>
            </ol>
          </div>
          <div className="about-item">
            <h3>Benefits</h3>
            <p>Optimize your solar plant performance, predict power generation, and make informed decisions based on data-driven insights.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="stats-section">
        <h2>Solar Plant Analysis</h2>
        <div className="input-form-container">
          <form onSubmit={handleSubmit} className="solar-input-form">
            <div className="form-group">
              <label htmlFor="acCapacity">Enter AC Capacity (MW)</label>
              <input
                type="number"
                id="acCapacity"
                value={acCapacity}
                onChange={(e) => setAcCapacity(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dcCapacity">Enter DC Capacity (MW)</label>
              <input
                type="number"
                id="dcCapacity"
                value={dcCapacity}
                onChange={(e) => setDcCapacity(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="incrementalDcCapacity">Enter Incremental DC Capacity (MW)</label>
              <input
                type="number"
                id="incrementalDcCapacity"
                value={incrementalDcCapacity}
                onChange={(e) => setIncrementalDcCapacity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                minDate={startDate}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="timeInterval">Select Time Interval</label>
              <select
                id="timeInterval"
                value={timeInterval}
                onChange={(e) => setTimeInterval(e.target.value)}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
            
            <button type="submit" className="generate-btn" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Curve'}
            </button>
          </form>
        </div>

        {isLoading && (
          <div className="loading-container">
            <p>Generating curves...</p>
          </div>
        )}

        {graphData && (
          <div className="graph-container">
            <Line data={graphData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Solar Power Generation Curve'
                }
              }
            }} />
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>Get in touch for more information about our solar plant analysis tools.</p>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Leading provider of solar plant analysis tools and solutions.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#statistics">Statistics</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@solarplant.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Solar Plant Analysis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;