import InputButton from './components/InputButton';
import { useState } from 'react';
import './App.css'
import.meta.env.VITE_API_KEY


function App() {
  const [searchInput, setSearchInput] = useState("")
  const [weatherData, setWeatherData] = useState(null)

  function handleChange(e) {
    setSearchInput(e.target.value);
  }
  function handleClick() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${import.meta.env.VITE_API_KEY}&units=imperial`
    fetch(url)
      .then(response => response.json())
      .then(data => setWeatherData(data));
  }
    return (
      <div>
        <h1>Weather Report</h1>
        <input value={searchInput} onChange={handleChange}/>
        <InputButton onClick={handleClick}>SEARCH</InputButton>
        {weatherData && weatherData.weather && (
          <div>
            <p>{weatherData.name}</p>
            <p>{weatherData.main.temp}</p>
            <p>{weatherData.weather[0].main}</p>
            <p>{weatherData.weather[0].description}</p>
            </div>
        )}
      </div>
    );
  }

  export default App;