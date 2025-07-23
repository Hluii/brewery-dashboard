import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

function Dashboard() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [minLength, setMinLength] = useState(0)
  const [randomBrewery, setRandomBrewery] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://api.openbrewerydb.org/v1/breweries?per_page=50')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Error fetching data:', err)
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

  const typeData = Object.entries(
    data.reduce((acc, b) => {
      acc[b.brewery_type] = (acc[b.brewery_type] || 0) + 1
      return acc
    }, {})
  ).map(([type, count]) => ({ type, count }))

  const stateData = Object.entries(
    data.reduce((acc, b) => {
      acc[b.state] = (acc[b.state] || 0) + 1
      return acc
    }, {})
  ).map(([state, count]) => ({ state, count }))

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#d0ed57', '#a4de6c']

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

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff' }}>Brewery Types</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeData}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#fdd835" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff' }}>Breweries by State</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stateData.slice(0, 6)}
              dataKey="count"
              nameKey="state"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {stateData.slice(0, 6).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <ul className="list">
        {filtered.map(brewery => (
          <li key={brewery.id} className="list-item">
            <Link to={`/brewery/${brewery.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>{brewery.name}</h2>
              <p>Type: {brewery.brewery_type}</p>
              <p>Location: {brewery.city}, {brewery.state}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard