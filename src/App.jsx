import InputButton from './components/InputButton';
import { useState } from 'react';
import './App.css'
import.meta.env.VITE_API_KEY


function App() {
  const [searchInput, setSearchInput] = useState("")

  function handleChange(e) {
    setSearchInput(e.target.value);
  }
  function handleClick() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${import.meta.env.VITE_API_KEY}`
    fetch(url)
      .then(response => response.json())
      .then(data => console.log(data));
  }
    return (
      <div>
        <h1>Weather Report</h1>
        <input value={searchInput} onChange={handleChange}/>
        <InputButton onClick={handleClick}>SEARCH</InputButton>
      </div>
    );
  }

  export default App;