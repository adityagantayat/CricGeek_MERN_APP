import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'

export const getPosts = async (req, res) => {
  const { page } = req.query
  try {
    const limit = 8
    const startIndex = (Number(page) - 1) * limit //get starting index of every page
    const total = await PostMessage.countDocuments({})
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex)
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query
  try {
    const title = new RegExp(searchQuery, 'i')
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    })
    res.status(200).json({ data: posts })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await PostMessage.findById(id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const { title, message, selectedFile, name, tags } = req.body
  const newPostMessage = new PostMessage({
    title,
    message,
    selectedFile,
    name,
    tags,
    creator: req.userId,
    createdAt: new Date().toString(),
  })
  try {
    await newPostMessage.save()
    res.status(201).json(newPostMessage)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const post = req.body
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send('No posts match the given id!')
  }
  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    })
    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deletePost = async (req, res) => {
  const { id: _id } = req.params
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send('No posts match the given id!')
  }
  try {
    await PostMessage.findByIdAndRemove(_id)
    res.status(200).json('Post deleted successfully')
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const likePost = async (req, res) => {
  const { id: _id } = req.params
  if (!req.userId)
    return res
      .status(401)
      .json({ message: 'You are not authenticated. Please Log in.' })
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send('No posts match the given id!')
  }
  try {
    const post = await PostMessage.findById(_id)
    const index = post.likes.findIndex((id) => id === String(req.userId))
    if (index === -1) {
      post.likes.push(req.userId)
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    })
    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const commentPost = async (req, res) => {
  const { id } = req.params
  const { value } = req.body
  if (!req.userId)
    return res
      .status(401)
      .json({ message: 'You are not authenticated. Please Log in.' })
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No posts match the given id!')
  }
  try {
    const post = await PostMessage.findById(id)
    post.comments.push(value)
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    })
    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
