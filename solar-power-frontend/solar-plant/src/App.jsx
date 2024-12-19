import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="app-container">
            {/* Navigation Bar */}
            <nav className="navbar">
            <div className="logo">
    <i className="fas fa-solar-panel"></i>
    <span>TATA Solar Plant</span>
</div>
                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#statistics">Statistics</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Powering the Future with Solar Energy</h1>
                    <p>Sustainable. Renewable. Efficient.</p>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats-section">
                <h2>Plant Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-card animate-on-scroll">
                        <h3>Power Generated</h3>
                        {data ? <p>{data.powerGenerated} MW</p> : <p>Loading...</p>}
                    </div>
                    <div className="stat-card animate-on-scroll">
                        <h3>Efficiency</h3>
                        <p>98.5%</p>
                    </div>
                    <div className="stat-card animate-on-scroll">
                        <h3>CO2 Saved</h3>
                        <p>1250 Tons</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#news">News</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 TATA Solar Plant. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );

    
}

export default App;