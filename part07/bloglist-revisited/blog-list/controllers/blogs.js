// Controlls the routing for blogs
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

// Gets all the blogs and embed their user in the data
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('users', { name: 1, username: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

// Creating a new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // Checks if there is a token and it could be decoded
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Checks for user in the user db and if user doesn't exist throw error
  const user = await User.findById(decodedToken.id)
  if (!user)
    return response.status(400).json({ error: 'unauthorized user' })


  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    comments: [],
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

// Gets a specific blog by id param
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog)
    response.json(blog)
  else
    response.status(404).end()
})

// Updates a blog, requires user to be owner of blog
blogsRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // Checking token
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Checking user authorization
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== decodedToken.id.toString())
    return response.status(400).json({ error: 'unauthorized user' })

  const body = request.body

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    comments: body.comments,
    likes: body.likes
  }

  const opts = { new: true, runValidators: true, context: 'query' }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, opts)
  response.json(updatedBlog.toJSON())
})

// Put route for liking a blog
blogsRouter.put('/:id/likes', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const body = request.body

  // Only updates the like count
  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    comments: blog.comments,
    likes: body.likes
  }

  const opts = { new: true, runValidators: true, context: 'query' }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, opts)
  response.json(updatedBlog.toJSON())
})

// Put for adding a comment
blogsRouter.put('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const body = request.body

  // Check to make sure comment isn't empty or null
  if (body.comment === '' || body.comment === null)
    return response.status(400).json({ error: 'Empty or null comments not allowed' })

  // Only updates the comments
  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    comments: body.comments,
    likes: blog.likes
  }

  const opts = { new: true, runValidators: true, context: 'query' }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, opts)
  response.json(updatedBlog.toJSON())
})

// Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // Checks token
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Checks user authorization
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== decodedToken.id.toString())
    return response.status(400).json({ error: 'unauthorized user' })

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter