import React, { useEffect } from 'react'
import { Paper, Typography, CircularProgress, Divider } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import moment from 'moment'
import './styles.css'
import { getPost, getPostsBySearch } from '../../actions/posts'
import CommentsSection from './CommentsSection'

const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const openRecommendedPost = (id) => {
    navigate(`/posts/${id}`)
  }
  useEffect(() => {
    dispatch(getPost(id))
  }, [id])
  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }))
    }
  }, [post])
  if (!post) return null
  if (isLoading)
    return (
      <Paper elevation={6} className='loadingPaper'>
        <CircularProgress size='7em' />
      </Paper>
    )
  const recommendedPosts = posts.filter(({ _id }) => _id !== id)
  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className='cardDetails'>
        <div className='section'>
          <Typography variant='h3' component='h2'>
            {post?.title}
          </Typography>
          <Typography
            gutterBottom
            variant='h6'
            color='textSecondary'
            component='h2'
          >
            {post?.tags?.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant='body1' component='p'>
            {post?.message}
          </Typography>
          <Typography variant='h6'>Created by: {post?.name}</Typography>
          <Typography variant='body1'>
            {moment(post?.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant='body1'>
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentsSection post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className='imageSection'>
          <img
            className='mediaDetails'
            src={post?.selectedFile}
            alt={post?.title}
          />
        </div>
      </div>
      {recommendedPosts?.length && (
        <div className='section'>
          <Typography gutterBottom variant='h5'>
            You might also like:
          </Typography>
          <Divider />
          <div className='recommendedPosts'>
            {recommendedPosts?.map(
              ({ title, message, name, likes, selectedFile, _id }) => (
                <Paper
                  style={{ margin: '20px', padding: '20px', cursor: 'pointer' }}
                  onClick={() => openRecommendedPost(_id)}
                  key={_id}
                  elevation={5}
                  className='paperRecommended'
                >
                  <Typography
                    gutterBottom
                    variant='h6'
                    style={{ fontWeight: 700 }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant='subtitle2'
                    color='textSecondary'
                  >
                    {name}
                  </Typography>
                  <Typography gutterBottom variant='subtitle2'>
                    {message}
                  </Typography>
                  <Typography gutterBottom variant='subtitle1'>
                    Likes: {likes.length}
                  </Typography>
                  <div className='imgEnd'>
                    <img src={selectedFile} alt='' width='200px' />
                  </div>
                </Paper>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  )
}

export default PostDetails
