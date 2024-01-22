import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './style/index.css'

// const sweden = {
//   pop: 11000000,
//   capital: 'stockholm'
// }
// let capital = sweden.capital
// let { capital } = sweden
/*
  candles.com/#/login

  app.get('/products', (req, res) => {

  })

  app.get('*', (req, res) => {
    res.sendFile('myReactApp.html')
  })
*/

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
