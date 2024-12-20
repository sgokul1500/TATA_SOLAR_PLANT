import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './App.css';
// At the top of App.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

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
    const [data, setData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [acCapacity, setAcCapacity] = useState('');
    const [dcCapacity, setDcCapacity] = useState('');
    const [incrementalDcCapacity, setIncrementalDcCapacity] = useState('');
    const [timeInterval, setTimeInterval] = useState('15');
    const [graphData, setGraphData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          // Get original curve data
          const response = await axios.post('http://localhost:5000/api/generate-curve', {
              acCapacity: parseFloat(acCapacity),
              dcCapacity: parseFloat(dcCapacity),
              timeInterval: parseInt(timeInterval)
          });
  
          // Get incremental curve data
          const incrementalResponse = await axios.post('http://localhost:5000/api/generate-curve', {
              acCapacity: parseFloat(acCapacity),
              dcCapacity: parseFloat(dcCapacity) + parseFloat(incrementalDcCapacity),
              timeInterval: parseInt(timeInterval)
          });
  
          const combinedData = {
              labels: response.data.labels,
              datasets: [
                  {
                      label: 'Original DC Output',
                      data: response.data.values,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                      fill: false
                  },
                  {
                      label: 'Original AC Output (Clipped)',
                      data: response.data.clippedValues,
                      borderColor: 'rgb(255, 99, 132)',
                      tension: 0.1,
                      fill: false
                  },
                  {
                      label: 'Incremental DC Output',
                      data: incrementalResponse.data.values,
                      borderColor: 'rgb(153, 102, 255)',
                      tension: 0.1,
                      fill: false
                  },
                  {
                      label: 'Incremental AC Output (Clipped)',
                      data: incrementalResponse.data.clippedValues,
                      borderColor: 'rgb(255, 159, 64)',
                      tension: 0.1,
                      fill: false
                  }
              ]
          };
  
          setGraphData(combinedData);
      } catch (error) {
          console.error('Error:', error);
          alert('Error generating curves');
      } finally {
          setIsLoading(false);
      }
  };
    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="logo">
                    <i className="fas fa-solar-panel"></i>
                    <span style={{ marginLeft: '10px' }}>TATA Solar Plant</span>
                </div>
                
                <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                </div>

                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li><a onClick={() => scrollToSection('home')}>Home</a></li>
                    <li><a onClick={() => scrollToSection('about')}>About</a></li>
                    <li><a onClick={() => scrollToSection('statistics')}>Statistics</a></li>
                    <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
                </ul>
            </nav>

            <section id="home" className="hero-section">
    <div className="hero-slider">
        <div className="slide"></div>
        <div className="slide"></div>
        <div className="slide"></div>
        <div className="slide"></div>
    </div>
    <div className="hero-content">
        <h1>Powering the Future with Solar Energy</h1>
        <p>Harnessing the Sun's Power Today, for a Brighter Tomorrow</p>
    </div>
</section>

            <section id="about" className="about-section">
                <div className="about-content">
                    <h2>About Tata Power Solar</h2>
                    <div className="about-grid">
                        <div className="about-item">
                            <h3>Company Overview</h3>
                            <p>Tata Power Solar, a wholly owned subsidiary of Tata Power, is India's largest integrated solar company with 35 years of experience in providing clean energy solutions.</p>
                        </div>
                        <div className="about-item">
                            <h3>Solar Power Process</h3>
                            <p>Our solar power generation process involves:</p>
                            <ol>
                                <li>Photovoltaic cells absorb sunlight, converting solar energy into DC electricity</li>
                                <li>Inverters convert DC power to AC power for grid compatibility</li>
                                <li>Transformed electricity is distributed through the power grid</li>
                                <li>Smart meters track energy production and consumption</li>
                            </ol>
                        </div>
                        <div className="about-item">
                            <h3>Our Achievements</h3>
                            <p>• Over 3.8GW of solar projects executed
                               • India's largest solar EPC company
                               • First company to achieve 1GW solar manufacturing
                               • Pioneered India's first solar cell and module manufacturing facility</p>
                        </div>
                    </div>
                </div>
            </section>

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

    {isLoading ? (
    <div className="loading-container">
        <p>Generating curves...</p>
    </div>
) : graphData && (
    <div className="graph-container">
        <Line 
            data={graphData}
            options={{
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Solar Power Generation Comparison'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Power Output (MW)'
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
        <div className="graph-stats">
            <h3>Graph Statistics</h3>
            <p>Original Shoulder Area: {graphData.shoulder_area_original?.toFixed(2)} MW-min</p>
            <p>Incremented Shoulder Area: {graphData.shoulder_area_incremented?.toFixed(2)} MW-min</p>
            <p>AC Capacity: {acCapacity} MW</p>
            <p>DC Capacity: {dcCapacity} MW</p>
            <p>Incremental DC: {incrementalDcCapacity} MW</p>
        </div>
    </div>
)}


    
</section>

<section id="contact" className="contact-section">
                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>Contact Us</h4>
                            <p>Email: info@tatasolar.com</p>
                            <p>Phone: +91 123 456 7890</p>
                        </div>
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a onClick={() => scrollToSection('about')}>About Us</a></li>
                                <li><a href="#careers">Careers</a></li>
                                <li><a href="#news">News</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                    <a href="https://www.facebook.com/TataPower/" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://twitter.com/TataPower" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/tata-power/" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 TATA Solar Plant. All rights reserved.</p>
                    </div>
                </footer>
            </section>
        </div>
    );
}

export default App;