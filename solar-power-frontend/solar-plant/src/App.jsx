import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [data, setData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
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
                <div className="hero-content">
                    <h1>Powering the Future with Solar Energy</h1>
                    <p>Sustainable. Renewable. Efficient.</p>
                </div>
            </section>

            <section id="about" className="about-section">
    <div className="about-content">
        <h2>About Tata Power Solar</h2>
        <div className="about-grid">
            <div className="about-item">
                <h3>Company Overview</h3>
                <p>Tata Power Solar, a wholly owned subsidiary of Tata Power, is India's largest integrated solar company with 35 years of experience in providing clean energy solutions. We have commissioned several landmark projects including one of the world's largest rooftop solar power plants of 16MW at Punjab.</p>
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
            </section>
        </div>
    );
}

export default App;