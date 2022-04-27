import React, { useEffect, useState } from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@mui/material'
// import useStyles from './styles'
import cricgeek from '../../images/cricgeek.png'
import './styles.css'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import decode from 'jwt-decode'
const Navbar = () => {
  // const classes = useStyles()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const token = user?.token
    //jwt
    if (token) {
      const decodedToken = decode(token)
      if (decodedToken.exp * 1000 < new Date().getTime()) logout()
    }
    setUser(JSON.parse(localStorage.getItem('profile')))
  }, [location])

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    setUser(null)
    navigate('/auth')
  }

  return (
    <AppBar className='appBar' position='static' color='inherit'>
      <div className='brandContainer'>
        {/* <Link className='sidebarLink' to='/'> */}
        <Typography
          className='heading'
          style={{ fontWeight: '900' }}
          variant='h2'
          align='center'
          component={Link}
          to='/'
        >
          CricGeek
        </Typography>
        <img src={cricgeek} className='image' alt='cricgeek' height='60' />
        {/* </Link> */}
      </div>
      <Toolbar className='toolbar'>
        {user?.result?.name ? (
          <div className='profile'>
            <Avatar
              className='purple'
              style={{ marginRight: '10px' }}
              alt={user.result.name}
              src={user.result.imageUrl}
            >
              {user.result.name[0]}
            </Avatar>
            <Typography className='userName' variant='h6'>
              {user.result.name}
            </Typography>
            <Button
              variant='contained'
              className='logout'
              color='error'
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to='/auth'
            variant='contained'
            color='primary'
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
