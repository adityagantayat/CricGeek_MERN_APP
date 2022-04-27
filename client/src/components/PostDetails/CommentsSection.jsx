import React, { useRef, useState } from 'react'
import { TextField, Typography, Button, Divider } from '@mui/material'
import './styles.css'
import { useDispatch } from 'react-redux'
import { commentPost } from '../../actions/posts'
const CommentsSection = ({ post }) => {
  const [comments, setComments] = useState(post?.comments)
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('profile'))
  const commentsRef = useRef()
  const handleClick = async (e) => {
    e.preventDefault()
    const finalComment = `${user.result.name}: ${comment}`
    const newComments = await dispatch(commentPost(finalComment, post._id))
    setComments(newComments)
    setComment('')
    commentsRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div>
      <div className='commentsOuterContainer'>
        <div className='commentsInnerContainer'>
          <Typography gutterBottom variant='h6' style={{ fontWeight: 700 }}>
            Comments
          </Typography>
          {comments.map((c, i) => (
            <>
              <div key={i} style={{ display: 'flex' }}>
                <Typography
                  gutterBottom
                  color='primary'
                  width='maxContent'
                  variant='subtitle1'
                  style={{ flex: 2 }}
                >
                  {c.split(':')[0]}
                </Typography>

                <Typography
                  gutterBottom
                  variant='subtitle1'
                  style={{ flex: 2 }}
                >
                  {c.split(':')[1]}
                </Typography>
              </div>
              <Divider />
            </>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div style={{ width: '70%' }}>
            <Typography gutterBottom variant='h6'>
              Write a comment
            </Typography>
            <TextField
              fullWidth
              rows={4}
              variant='outlined'
              label='Comment'
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ margin: '10px' }}
              fullWidth
              disabled={!comment}
              variant='contained'
              color='primary'
              onClick={handleClick}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentsSection
