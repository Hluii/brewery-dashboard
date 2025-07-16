import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [minLength, setMinLength] = useState(0)
  const [randomBrewery, setRandomBrewery] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://api.openbrewerydb.org/v1/breweries?per_page=50');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData()
  }, [])

  const filtered = data.filter(brewery => {
    const nameMatch = (brewery.name || '').toLowerCase().includes(search.toLowerCase())
    const typeMatch = typeFilter ? brewery.brewery_type === typeFilter : true
    const nameLengthMatch = brewery.name?.length >= minLength
    return nameMatch && typeMatch && nameLengthMatch
  })

  const total = data.length
  const micro = data.filter(b => b.brewery_type === 'micro').length
  const averageNameLength = total ? (data.reduce((sum, b) => sum + (b.name?.length || 0), 0) / total).toFixed(1) : 0

  const getRandomBrewery = () => {
    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length)
      setRandomBrewery(filtered[randomIndex])
    }
  }

  return (
    <div className="container">
      <header>
        <img src="https://emojiapi.dev/api/v1/1f37a.svg" alt="beer" />
        <h1>Brewery Dashboard</h1>
      </header>

      <section className="stats">
        <div className="stat-card">
          <h2>Total Breweries</h2>
          <p>{total}</p>
        </div>
        <div className="stat-card">
          <h2>Micro Breweries</h2>
          <p>{micro}</p>
        </div>
        <div className="stat-card">
          <h2>Avg. Name Length</h2>
          <p>{averageNameLength}</p>
        </div>
      </section>

      <section className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value=''>All Types</option>
          <option value='micro'>Micro</option>
          <option value='regional'>Regional</option>
          <option value='brewpub'>Brewpub</option>
          <option value='large'>Large</option>
        </select>

        <input
          type="range"
          min="0"
          max="50"
          value={minLength}
          onChange={e => setMinLength(Number(e.target.value))}
        />
        <label>Min Name Length: {minLength}</label>

        <button onClick={getRandomBrewery}>Get Random Brewery</button>
      </section>

      {randomBrewery && (
        <div className="list-item">
          <h2>{randomBrewery.name}</h2>
          <p>Type: {randomBrewery.brewery_type}</p>
          <p>Location: {randomBrewery.city}, {randomBrewery.state}</p>
        </div>
      )}

      <ul className="list">
        {filtered.map(brewery => (
          <li key={brewery.id} className="list-item">
            <h2>{brewery.name}</h2>
            <p>Type: {brewery.brewery_type}</p>
            <p>Location: {brewery.city}, {brewery.state}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
