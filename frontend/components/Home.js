import React from 'react'
import pizza from './images/pizza.jpg'
import {Link} from 'react-router-dom'

function Home() {
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      <Link to = '/order'>  
      <img alt="order-pizza" style={{ cursor: 'pointer' }} src={pizza} />
      </Link>
    </div>
  )
}

export default Home
