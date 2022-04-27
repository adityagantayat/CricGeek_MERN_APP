import React from 'react'
import './styles.css'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
} from '@mui/material'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import app from '../../../firebase'
import { deletePost, likePost } from '../../../actions/posts'
import { Edit, ThumbUpAltOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router'

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('profile'))
  const navigate = useNavigate()
  const isPostLiked =
    post.likes.includes(user?.result?._id) ||
    post.likes.includes(user?.result?.googleId)
  const openPost = (e) => {
    e.preventDefault()
    navigate(`/posts/${post._id}`)
  }
  return (
    <Card className='card' raised elevation={6}>
      <ButtonBase className='cardAction' onClick={openPost}>
        <CardMedia
          className='cardImage'
          component='img'
          style={{ height: '200px' }}
          src={post.selectedFile}
          title={post.title}
        />
        <div className='overlay'>
          <Typography variant='h6'>{post.name}</Typography>
          <Typography variant='body2'>
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <div className='overlay2'>
            <div
              style={{ color: 'white', display: 'none' }}
              size='small'
              className='btn btn-edit'
              onClick={(e) => {
                e.preventDefault()
                setCurrentId(post._id)
              }}
            >
              <Edit fontSize='medium' className='icon' />
            </div>
          </div>
        )}
        <div className='details'>
          <Typography variant='body2' color='textSecondary'>
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
        </div>
        <Typography className='title' variant='h5' gutterBottom>
          {post.title}
        </Typography>
        <CardContent>
          <Typography variant='body2' color='textSecondary'>
            {post.message}
          </Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className='cardActions'>
        <Button
          size='small'
          color='primary'
          disabled={!user?.result}
          className='btn'
          onClick={() => dispatch(likePost(post._id))}
        >
          {isPostLiked ? (
            <ThumbUpAltIcon
              fontSize='small'
              className='icon'
              style={{ marginRight: '5px' }}
            />
          ) : (
            <ThumbUpAltOutlined
              fontSize='small'
              className='icon'
              style={{ marginRight: '5px' }}
            />
          )}
          {post.likes?.length ? post.likes?.length : ''} &nbsp;{''}
          {post.likes?.length > 1 ? 'Likes' : 'Like'}
        </Button>

        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <Button
            size='small'
            color='primary'
            className='btn'
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize='small' className='icon' />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default Post
