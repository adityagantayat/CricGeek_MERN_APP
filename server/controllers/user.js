import mongoose from 'mongoose'
import User from '../models/user.js'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'

export const signin = async (req, res) => {
  const { email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" })
    const OriginalPassword = CryptoJS.AES.decrypt(
      existingUser.password,
      process.env.PASS_KEY
    ).toString(CryptoJS.enc.Utf8)
    if (OriginalPassword !== password) {
      res.status(401).json({ message: 'Invalid Credentials' })
      return
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.PASS_KEY,
      { expiresIn: '1h' }
    )
    res.status(200).json({ result: existingUser, token: token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'User with this email already exists' })
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" })
    const hashedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_KEY
    ).toString()
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    })
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.PASS_KEY,
      { expiresIn: '1h' }
    )
    res.status(200).json({ result, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
