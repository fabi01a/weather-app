import InputButton from './components/InputButton';
import { useState, useEffect } from 'react';
import './App.css'
import.meta.env.VITE_API_KEY


function App() {
  const [searchInput, setSearchInput] = useState("")
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function fetchWeather(url) {
    setLoading(true)
    setError(null)

    fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        setError("City not found")
      } else {
        setWeatherData(data)
      }
    })
    .catch(() => {
      setError("Something went wrong - please try again")
    })
    .finally( () => {
      setLoading(false)
    });
  }


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=imperial`;
        fetchWeather(url);
      },
      () => {
        setError("Location access denied. Please search for a city");
      }
    );
  }, []);


  function handleChange(e) {
    setSearchInput(e.target.value);
  }

  function handleClick() {
    if (!searchInput.trim()){
      setError("Please enter a valid city")
      return
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${import.meta.env.VITE_API_KEY}&units=imperial`;
    
    fetchWeather(url);
  }

    return (
      <>
        <h1>Weather Report</h1>
        <input value={searchInput} onChange={handleChange} />
        <InputButton onClick={handleClick}>SEARCH</InputButton>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {weatherData && weatherData.weather && (
          <>
            <p>{weatherData.name}</p>
            <p>{weatherData.main.temp}</p>
            <p>{weatherData.weather[0].main}</p>
            <p>{weatherData.weather[0].description}</p>
          </>
        )}
      </>
    );
  }

  export default App;