import React, { useEffect, useState } from 'react'
import { TextField, Button, Typography, Paper } from '@mui/material'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import app from '../../firebase.js'
import './styles.css'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, updatePost } from '../../actions/posts'
import { useNavigate } from 'react-router'

const Form = ({ currentId, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const post = useSelector((state) =>
    currentId
      ? state.posts.posts.find((message) => message._id === currentId)
      : null
  )
  const fileRef = React.createRef()
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (post) setPostData(post)
  }, [post])
  const clear = () => {
    setCurrentId(0)
    setPostData({
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    })
    fileRef.current.value = ''
  }
  // const handleSubmit = (e) => {
  //   console.log(postData)
  //   e.preventDefault()
  //   dispatch(createPost(postData))
  // }
  const handleClick = (e) => {
    e.preventDefault()
    if (file) {
      const fileName = new Date().getTime() + file.name
      const storage = getStorage(app)
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
            default:
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const data = { ...postData, selectedFile: downloadURL }
            // dispatch(createPost(data))
            if (currentId === 0) {
              dispatch(
                createPost({ ...data, name: user?.result?.name }, navigate)
              )
            } else {
              dispatch(
                updatePost(currentId, { ...data, name: user?.result?.name })
              )
              setFile(null)
            }
            clear()
          })
        }
      )
    } else {
      if (currentId === 0) {
        dispatch(createPost(postData))
        clear()
      } else {
        dispatch(updatePost(currentId, postData))
        clear()
      }
    }
  }
  // const clear = () => {}
  const [postData, setPostData] = useState({
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  })

  if (!user?.result?.name) {
    return (
      <Paper className='paper'>
        <Typography variant='h6' align='center'>
          Please Sign In to create your memories.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className='paper' elevation={6}>
      <form autoComplete='off' noValidate className='form'>
        <Typography variant='h6'>Tell us your favourite memory</Typography>
        <TextField
          name='title'
          variant='outlined'
          label='Title'
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />

        <TextField
          name='message'
          variant='outlined'
          label='Message'
          fullWidth
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />

        <TextField
          name='tags'
          variant='outlined'
          label='Tags'
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(',') })
          }
        />
        {/* <div className='fileInput'>
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) => {
              setPostData({ ...postData, selectedFile: base64 })
            }}
          />
        </div> */}
        <div className='fileInput'>
          <input
            type='file'
            id='file'
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <Button
          className='buttonSubmit'
          variant='contained'
          color='primary'
          size='large'
          onClick={handleClick}
          fullWidth
        >
          {!currentId ? 'Submit' : 'Update'}
        </Button>
        <Button
          variant='contained'
          color='secondary'
          size='small'
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  )
}

export default Form
