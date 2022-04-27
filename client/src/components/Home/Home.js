import React from 'react'
import {
  Container,
  AppBar,
  TextField,
  Button,
  Grow,
  Grid,
  Paper,
  Chip,
} from '@mui/material'
import Form from '../Form/Form'
import Posts from '../Posts/Posts'
import { useDispatch } from 'react-redux'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router'
import useStyles from './styles'
import Pagination from '../Pagination'
// import Chip from 'material-ui-chip-input'
import { useEffect, useState } from 'react'
import { getPosts, getPostsBySearch } from '../../actions/posts'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Home = () => {
  const [currentId, setCurrentId] = useState(0)
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState([])
  const classes = useStyles()
  const query = useQuery()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const page = query.get('page') || 1
  const searchQuery = query.get('searchQuery')
  const tagRef = React.createRef()

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost()
    }
  }
  const handleAdd = (e) => {
    if (e.keyCode === 13) {
      setTags([...tags, e.target.value])
      tagRef.current.value = ''
    }
  }
  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete))
  }
  const searchPost = (e) => {
    e.preventDefault()
    if (search.trim() || tags.length) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }))
      navigate(
        `/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`
      )
    } else {
      navigate('/')
    }
  }
  // useEffect(() => {
  //   dispatch(getPosts())
  // }, [dispatch])
  return (
    <Grow in>
      <Container maxWidth='xl'>
        <Grid
          className='main-Container'
          container
          justify='space-between'
          alignContent='stretch'
          spacing={3}
        >
          <Grid item xs={12} sm={7} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className='appBarSearch' position='static' color='inherit'>
              <TextField
                name='search'
                variant='outlined'
                label='Search Memories'
                fullWidth
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
                onKeyDown={handleKeyPress}
              />
              <TextField
                inputRef={tagRef}
                fullWidth
                variant='outlined'
                label='Search Tags'
                onKeyUp={handleAdd}
              ></TextField>
              <div className='chipTags' style={{ marginLeft: '0.6rem' }}>
                {tags.map((data) => (
                  <Chip
                    key={data}
                    label={data}
                    style={{ width: 'fit-content' }}
                    size='small'
                    clickable
                    variant='outlined'
                    color='info'
                    onDelete={(e) => handleDelete(data)}
                  />
                ))}
              </div>
              <Button
                onClick={searchPost}
                className='searchButton'
                variant='contained'
                color='primary'
                fullWidth
                style={{ margin: '0.6rem' }}
              >
                Search
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {!searchQuery && !tags.length && (
              <Paper className='pagination' elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}

export default Home
