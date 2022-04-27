import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  TextField,
  IconButton,
} from '@mui/material'
import './styles.css'
import { LockOutlined } from '@mui/icons-material'
import Input from './Input'
import { GoogleLogin } from 'react-google-login'
import Icon from './icon'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { signin, signup } from '../../actions/auth'
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}
const Auth = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSignUp) {
      dispatch(signup(formData, navigate))
    } else {
      dispatch(signin(formData, navigate))
    }
  }
  useEffect(() => {
    setFormData(initialState)
  }, [isSignUp])
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const googleSuccess = async (res) => {
    const result = res?.profileObj
    const token = res?.tokenId
    try {
      dispatch({ type: 'AUTH', data: { result, token } })
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }
  const googleFailure = (error) => {
    console.log(error)
    console.log('Goggle log in failed.')
  }
  const switchMode = () => {
    setIsSignUp(!isSignUp)
    setShowPassword(false)
  }
  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <Container component='main' maxWidth='xs'>
      <Paper className='paper-auth' elevation={3}>
        <Avatar className='avatar'>
          <LockOutlined />
        </Avatar>
        <Typography variant='h5'>{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
        <form className='form' onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name='firstName'
                  label='First Name'
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name='lastName'
                  label='Last Name'
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name='email'
              label='Email Address'
              handleChange={handleChange}
              type='email'
            />
            <Input
              name='password'
              label='Password'
              handleChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              handleShowPassword={handleShowPassword}
            />
            {isSignUp && (
              <Input
                name='confirmPassword'
                label='Confirm Password'
                handleChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                handleShowPassword={handleShowPassword}
              />
            )}
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className='submit'
          >
            {isSignUp ? 'Sign up' : 'Sign in'}
          </Button>
          <GoogleLogin
            clientId='932932084048-b03vj9941u3fl1el17ulgnr7dbff648i.apps.googleusercontent.com'
            render={(renderProps) => (
              <Button
                className='googleButton'
                fullWidth
                color='primary'
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant='contained'
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={'single_host_origin'}
          />
          <Grid container justify='flex-end'>
            <Button onClick={switchMode}>
              {isSignUp
                ? 'Already have an account? Sign in!'
                : "Don't have an account? Sign up!"}
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth
