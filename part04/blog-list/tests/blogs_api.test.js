const mongoose = require('mongoose')
const helper = require('./api_test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs need an id property', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('adding a valid blog', async () => {
  const newBlog = {
    title: 'Eternal COPE',
    author: 'Chuck',
    url: 'www.ramran.ch',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterAdd = await helper.blogsInDb()
  expect(blogsAfterAdd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAfterAdd.map(b => b.title)
  expect(titles).toContain('Eternal COPE')
})

test('adding a blog without like param, should have 0 likes', async () => {
  const newBlog = {
    title: 'Feed and Sneed',
    author: 'Homer',
    url: 'fomerlychucks.io'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterAdd =await helper.blogsInDb()
  expect(blogsAfterAdd.length).toBe(helper.initialBlogs.length + 1)

  const addedBlog = blogsAfterAdd.find(b => b.title === 'Feed and Sneed')
  expect(addedBlog).toBeDefined()
  if (addedBlog)
    expect(addedBlog.likes).toBe(0)
})

test('blog without author and title not added', async () => {
  const newBlog ={
    url: 'johny.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfter = await helper.blogsInDb()
  expect(blogsAfter.length).toBe(helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsStart = await helper.blogsInDb()
  const blogToView = blogsStart[0]

  const resultBlog = await api.get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body).toEqual(blogToView)
})

test('a blog can be deleted', async () => {
  const blogsStart = await helper.blogsInDb()
  const blogToDelete = blogsStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsEnd = await helper.blogsInDb()

  expect(blogsEnd.length).toBe(helper.initialBlogs.length - 1)
  const titles = blogsEnd.map(b => b.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const blogsStart = await helper.blogsInDb()
  const blogToUpdate = blogsStart[0]

  const blogUpdate = {
    title: 'AAAAAAAAAAAAAAH',
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogUpdate)
    .expect(200)

  const blogsEnd = await helper.blogsInDb()
  const targetBlog = blogsEnd.find(b => b.id === blogToUpdate.id)
  expect(targetBlog.title).toBe(blogUpdate.title)
})

afterAll(() => {
  mongoose.connection.close()
})