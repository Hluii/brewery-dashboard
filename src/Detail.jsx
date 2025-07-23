import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

function Detail() {
  const { id } = useParams()
  const [brewery, setBrewery] = useState(null)

  useEffect(() => {
    fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`)
      .then(res => res.json())
      .then(setBrewery)
  }, [id])

  if (!brewery) return <p>Loading...</p>

  return (
    <div className="container">
      <header>
        <img src="https://emojiapi.dev/api/v1/1f37a.svg" alt="beer" />
        <h1>Brewery Details</h1>
      </header>

      <div className="list-item" style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: '1.5rem', borderRadius: '12px' }}>
        <h2>{brewery.name}</h2>
        <p>Type: {brewery.brewery_type}</p>
        <p>Location: {brewery.city}, {brewery.state}</p>
        <p>Street: {brewery.street}</p>
        <p>Postal Code: {brewery.postal_code}</p>
        <p>Phone: {brewery.phone || 'N/A'}</p>
        {brewery.website_url && (
          <p>
            Website: <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a>
          </p>
        )}
      </div>
    </div>
  )
}

export default Detail