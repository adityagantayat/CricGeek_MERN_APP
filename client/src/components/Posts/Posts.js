import React from 'react'
import Post from './Post/Post'
import { useSelector } from 'react-redux'
import './styles.css'
import { Grid, CircularProgress } from '@mui/material'
const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts)
  if (!posts.length && !isLoading) return 'No posts available'
  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid className='container' container alignItems='stretch' spacing={3}>
      {posts?.map((post) => (
        <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
          <Post post={post} setCurrentId={setCurrentId}></Post>
        </Grid>
      ))}
    </Grid>
  )
}

export default Posts
