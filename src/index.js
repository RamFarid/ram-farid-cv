import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Home from './routes/Home'
import About from './routes/About'
import Experience from './routes/Experience'
import Services from './routes/Services'
import Portfolio from './routes/Portfolio'
import Contact from './routes/Contact'
import Testmonials from './routes/Testmonials'
// Roures
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './routes/ErrorPage'

const route = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home title='Home' />,
      },
      {
        path: 'about',
        element: <About title='About' />,
      },
      {
        path: 'experience',
        element: <Experience title='Experience' />,
      },
      {
        path: 'services',
        element: <Services title='Services' />,
      },
      {
        path: 'portfolio',
        element: <Portfolio title='Portfolio' />,
      },
      {
        path: 'contact',
        element: <Contact title='Contact' />,
      },
      {
        path: 'testmonials',
        element: <Testmonials title='Testmonials' />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<RouterProvider router={route} />)
