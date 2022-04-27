import { Container } from '@mui/material'
import Form from './components/Form/Form'
import Posts from './components/Posts/Posts'
import cricgeek from './images/cricgeek.png'
import useStyles from './components/Home/styles'
import { useDispatch } from 'react-redux'
import './App.css'
import { useEffect, useState } from 'react'
import { getPosts } from './actions/posts'
import { ThemeProvider, createTheme, makeStyles } from '@mui/material/styles'
import Navbar from './components/Navbar/Navbar'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Home from './components/Home/Home'
import Auth from './components/Auth/Auth'
import PostDetails from './components/PostDetails/PostDetails'

function App() {
  const user = JSON.parse(localStorage.getItem('profile'))

  return (
    <Router>
      <Container maxWidth='xl'>
        <Navbar />
        <Routes>
          {/* <Home /> */}
          <Route exact path='/' element={<Navigate to='/posts' />} />
          <Route
            exact
            path='/auth'
            element={!user?.result?.name ? <Auth /> : <Navigate to='/posts' />}
          />
          <Route exact path='/posts' element={<Home />} />
          <Route exact path='/posts/search' element={<Home />} />
          <Route exact path='/posts/:id' element={<PostDetails />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
