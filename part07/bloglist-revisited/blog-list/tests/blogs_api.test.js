const mongoose = require('mongoose')
const helper = require('./api_test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog = require('../models/blog')

describe('Initally some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const owner = await User.findOne({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    blogObjects.forEach(b => {
      b.user = owner._id
    })
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('Blogs need an id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('A specific blog is in returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('React patterns')
  })

  describe('Viewing a specific blog', () => {
    test('A specific blog can be viewed with valid id, success 200', async () => {
      const blogsStart = await helper.blogsInDb()
      const blogToView = blogsStart[0]

      const resultBlog = await api.get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body.title).toBe(blogToView.title)
    })

    test('Fails with 404 if does not exist', async () => {
      const validNonExId = await helper.nonExistingId()
      console.log(validNonExId)

      await api
        .get(`/api/blogs/${validNonExId}`)
        .expect(404)
    })

    test('Fails with 400 if id is invalid', async () => {
      const invalidId = '123456789'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('Adding a new blog', () => {
    test('Valid blog succeeds with code 200', async () => {
      const Owner = {
        username: 'root',
        password: 'sekret'
      }

      const loginResult = await api
        .post('/api/login')
        .send(Owner)
        .expect(200)

      const newBlog = {
        title: 'Eternal COPE',
        author: 'Chuck',
        url: 'www.ramran.ch',
        likes: 2
      }

      const authString = `bearer ${loginResult.body.token}`

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: authString })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterAdd = await helper.blogsInDb()
      expect(blogsAfterAdd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAfterAdd.map(b => b.title)
      expect(titles).toContain('Eternal COPE')
    })

    test('Missing likes param defaults to 0', async () => {
      const Owner = {
        username: 'root',
        password: 'sekret'
      }

      const loginResult = await api
        .post('/api/login')
        .send(Owner)
        .expect(200)

      const newBlog = {
        title: 'Feed and Sneed',
        author: 'Homer',
        url: 'fomerlychucks.io'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'bearer ' + loginResult.body.token })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterAdd =await helper.blogsInDb()
      expect(blogsAfterAdd.length).toBe(helper.initialBlogs.length + 1)

      const addedBlog = blogsAfterAdd.find(b => b.title === 'Feed and Sneed')
      expect(addedBlog).toBeDefined()
      if (addedBlog)
        expect(addedBlog.likes).toBe(0)
    })

    test('Invalid fails with 400', async () => {
      const Owner = {
        username: 'root',
        password: 'sekret'
      }

      const loginResult = await api
        .post('/api/login')
        .send(Owner)
        .expect(200)

      const newBlog ={
        url: 'johny.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'bearer ' + loginResult.body.token })
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter.length).toBe(helper.initialBlogs.length)
    })

    test('Unauthorized token fails with code 401', async () => {
      const newBlog = {
        title: "Cant add this",
        author: "MC Hammer",
        url: "www.coupon.com",
        likes: 1
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'bearer 123456789' })
        .expect(401)
    })
  })

  describe('Deletion of a blog', () => {
    test('Succeeds with code 204', async () => {
      const Owner = {
        username: 'root',
        password: 'sekret'
      }

      const loginResult = await api
        .post('/api/login')
        .send(Owner)
        .expect(200)

      const blogsStart = await helper.blogsInDb()
      const blogToDelete = blogsStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: 'bearer ' + loginResult.body.token })
        .expect(204)

      const blogsEnd = await helper.blogsInDb()

      expect(blogsEnd.length).toBe(helper.initialBlogs.length - 1)
      const titles = blogsEnd.map(b => b.title)
      expect(titles).not.toContain(blogToDelete.title)
    })

  })

  describe('Updating a blog', () => {
    test('Valid update ucceeds with code 200', async () => {
      const Owner = {
        username: 'root',
        password: 'sekret'
      }

      const loginResult = await api
        .post('/api/login')
        .send(Owner)
        .expect(200)

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
        .set({ Authorization: 'bearer ' + loginResult.body.token })
        .expect(200)

      const blogsEnd = await helper.blogsInDb()
      const targetBlog = blogsEnd.find(b => b.id === blogToUpdate.id)
      expect(targetBlog.title).toBe(blogUpdate.title)
    })
  })
})

describe('Initialized with one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('Creation succeeds with a fresh username', async () => {
    const usersStart = await helper.usersInDb()

    const newUser = {
      username: 'johnc',
      name: 'John C',
      password: 'BIGJOHN'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersEnd = await helper.usersInDb()
    expect(usersEnd).toHaveLength(usersStart.length + 1)

    const usernames = usersEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('Creation fails with code 400 if username is taken', async () => {
    const usersStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Steve',
      password: 'hello'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toBeDefined()

    const usersEnd = await helper.usersInDb()
    expect(usersEnd.length).toBe(usersStart.length)
  })

  test('Creation fails with code 400 if password is too short', async () => {
    const usersStart = await helper.usersInDb()

    const newUser = {
      username: 'badpassword',
      name: 'Joe',
      password: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toBeDefined()

    const usersEnd = await helper.usersInDb()
    expect(usersEnd.length).toBe(usersStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})