import express from 'express'
import {
  createPost,
  getPosts,
  getPostsBySearch,
  updatePost,
  deletePost,
  getPost,
  likePost,
  commentPost,
} from '../controllers/posts.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/search', getPostsBySearch)
router.get('/', getPosts)
router.get('/:id', getPost)

router.post('/:id/commentPost', auth, commentPost)
router.patch('/:id/likePost', auth, likePost)

router.post('/', auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)

export default router
