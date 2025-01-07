import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      ) {
        setSelectedFile(file);
      } else {
        alert('Please upload only Excel files (.xlsx or .xls)');
        e.target.value = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedFile) {
        throw new Error('Please select a file');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('incrementalDcCapacity', incrementalDcCapacity);
      formData.append('startDate', startDate.toLocaleDateString('en-GB'));
      formData.append('endDate', endDate.toLocaleDateString('en-GB'));

      const response = await axios.post(
        'http://localhost:5000/api/generate-curve',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setGraphData(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h1>Solar Plant</h1>
        </div>
        <div
          className="menu-icon"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </div>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#statistics">Statistics</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Home Section */}
      <section id="home" className="home-section">
        <h2>Welcome to Solar Plant Analysis</h2>
        <p>
          This platform allows you to upload solar plant data and analyze energy
          generation performance. Navigate through the sections to explore
          features and insights.
        </p>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          We are dedicated to optimizing solar energy generation by providing
          advanced tools for performance analysis and loss estimation. Our
          mission is to empower solar plant operators with actionable insights
          to maximize energy output.
        </p>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="stats-section">
        <h2>Solar Plant Analysis</h2>
        <form onSubmit={handleSubmit} className="solar-input-form">
          <div className="form-group">
            <label htmlFor="file">Upload Excel File</label>
            <input
              type="file"
              id="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="incrementalDcCapacity">
              Incremental DC Capacity (MW)
            </label>
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
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={startDate}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Curve'}
          </button>
        </form>

        {graphData && (
          <div>
            {graphData.results.map((result, index) => (
              <div key={index}>
                <h3>Results for Incremental Generation: {result.incremental_gen} MW</h3>
                <Line
                  data={{
                    labels: graphData.time_intervals,
                    datasets: [
                      {
                        label: 'Reference Curve (Energy, MWh)',
                        data: result.energy_reference,
                        borderColor: 'blue',
                        fill: false,
                      },
                      {
                        label: 'Incremental Curve (Energy, MWh)',
                        data: result.energy_incremental,
                        borderColor: 'red',
                        fill: false,
                      },
                      {
                        label: 'Clipped Incremental Curve (Energy, MWh)',
                        data: result.energy_clipped,
                        borderColor: 'orange',
                        borderDash: [5, 5],
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>
          Have questions or need support? Feel free to reach out to our team:
        </p>
        <ul>
          <li>Email: support@solarplantanalysis.com</li>
          <li>Phone: +1 800 555 1234</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
