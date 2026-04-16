import InputButton from './components/InputButton';
import { useState } from 'react';
import './App.css'
import.meta.env.VITE_API_KEY


function App() {
  const [searchInput, setSearchInput] = useState("")
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setSearchInput(e.target.value);
  }

  function handleClick() {
    setError(null)
    
    if (!searchInput.trim()){
      setError("Please enter a valid city")
      return
    }
    
    setLoading(true)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${import.meta.env.VITE_API_KEY}&units=imperial`
  
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
      })
  }
    return (
      <>
        <h1>Weather Report</h1>
        <input value={searchInput} onChange={handleChange}/>
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