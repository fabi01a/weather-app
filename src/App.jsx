import InputButton from './components/InputButton';
import { useState } from 'react';
import './App.css'

function App() {
  const [searchInput, setSearchInput] = useState("")

  function handleChange(e) {
    setSearchInput(e.target.value);
  }
  function handleClick() {
    console.log(searchInput)
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