import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const [selectedFile, setSelectedFile] = useState(null);
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [incrementalDcCapacity, setIncrementalDcCapacity] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const formData = new FormData();
            if (!selectedFile) {
                throw new Error('Please select a file');
            }
            formData.append('file', selectedFile);
            formData.append('incrementalDcCapacity', incrementalDcCapacity);
            formData.append('startDate', startDate.toLocaleDateString('en-GB'));
            formData.append('endDate', endDate.toLocaleDateString('en-GB'));
    
            const response = await axios.post('http://localhost:5000/api/generate-curve', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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
              <li>Upload your Excel file</li>
              <li>Input incremental DC capacity</li>
              <li>Select your desired time interval</li>
              <li>Generate detailed power curves</li>
            </ol>
          </div>
          <div className="about-item">
            <h3>Benefits</h3>
            <p>Optimize your solar plant performance, predict power generation, and make informed decisions based on data-driven insights.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {/* Statistics Section */}
<section id="statistics" className="stats-section">
    <h2>Solar Plant Analysis</h2>
    <div className="input-form-container">
        <form onSubmit={handleSubmit} className="solar-input-form">
            <div className="form-group">
                <label htmlFor="file">Upload Excel File</label>
                <input
                    type="file"
                    id="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required
                    className="file-input"
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="incrementalDcCapacity">Incremental DC Capacity (MW)</label>
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
                    calendarClassName="react-datepicker"
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
                    calendarClassName="react-datepicker"
                />
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

    {graphData && graphData.results && graphData.results.map((result, index) => (
        <div key={index} className="graph-container">
            <h3>Results for Incremental Generation: {result.incremental_gen} MW</h3>
            <Line 
                data={{
                    labels: graphData.time_intervals,
                    datasets: [
                        {
                            label: 'Reference Curve (Energy, MWh)',
                            data: result.energy_reference,
                            borderColor: 'blue',
                            fill: false
                        },
                        {
                            label: 'Incremental Curve (Energy, MWh)',
                            data: result.energy_incremental,
                            borderColor: 'red',
                            fill: false
                        },
                        {
                            label: 'Clipped Incremental Curve (Energy, MWh)',
                            data: result.energy_clipped,
                            borderColor: 'orange',
                            borderDash: [5, 5],
                            fill: false
                        }
                    ]
                }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Solar Power Generation Curve'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Energy (MWh)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        }
                    }
                }}
            />
            <div className="losses-info">
                <p>Total Loss (Without Clipping): {result.losses.without_clipping.toFixed(2)} MWh</p>
                <p>Total Loss (With Clipping): {result.losses.with_clipping.toFixed(2)} MWh</p>
            </div>
        </div>
    ))}
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
}}

export default App;