const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash(helper.userRoot.password, 10)
  const user = new User({ username: helper.userRoot.username, name:helper.userRoot.name, passwordHash })
  const user2 = new User({ username: helper.userNoRoot.username, name:helper.userNoRoot.name, passwordHash })

  await user.save()
  await user2.save()

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({...blog, user: user.id})
    await blogObject.save()
  }
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
  })
})

describe('viewing a specific blog', () => {
  test('the identifier is called "id" and not "_id"', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert('id' in blog, 'Expected blog to have property "id"')
      assert(!('_id' in blog), 'Expected blog not to have property "_id"')
    })
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('segredo', 10)
    const user = new User({ username: helper.userRoot.username, name:'Iago Outeiro', passwordHash })

    await user.save()
  })

  test('a valid blog can be added', async () => {
    const usersAtEnd = await helper.usersInDb()
    const newBlog = { title: 'Título03', author: 'author C', url: 'umha direiçom 03', likes: 3, user: usersAtEnd[0].id }

    const token = await helper.getToken(api)
    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Título03'))
  })

  test('a blog without likes adds likes equal to 0', async () => {
    const usersAtEnd = await helper.usersInDb()
    const newBlog = { title: 'Título04', author: 'author D', url: 'umha direiçom 04', user: usersAtEnd[0].id }

    const token = await helper.getToken(api)
    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blog = response.body.find(b => b.title === newBlog.title)

    assert.strictEqual(blog.likes, 0)
  })

  test('a blog without title or url adds return 400', async () => {
    const usersAtEnd = await helper.usersInDb()
    const newBlog = { author: 'author E', url: 'umha direiçom 05', likes: 5, user: usersAtEnd[0].id }
    const newBlog2 = { title: 'Título05', author: 'author E', likes: 5, user: usersAtEnd[0].id }

    const token = await helper.getToken(api)
    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog2)
      .expect(400)

    const response2 = await api.get('/api/blogs')
    assert.strictEqual(response2.body.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id user is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const token = await helper.getToken(api)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('no the same user who created', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const token = await helper.getSecondToken(api)

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token, { type: 'bearer' })
      .expect(400)
    assert.strictEqual(response.error.text, 'The user is not the same one who created the blog')
  })

  test('no delete No token', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(400)
    assert(response.error.text.toString().includes('No token'))
  })
})

describe('updation of a blog', () => {
  test('a valid blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blog = blogsAtStart[0]
    blog.likes = blog.likes * 10

    await api
      .put(`/api/blogs/${blog.id}`)
      .send(blog)
      .expect(202)
      .expect('Content-Type', /application\/json/)

    const response = await api.get(`/api/blogs/${blog.id}`)
    const updatedBlog = response.body

    assert.strictEqual(blog.likes, updatedBlog.likes)
  })

  test('a blog without likes updates likes equal to 0', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const sendBlog = { id: blogsAtStart[0].id, title: blogsAtStart[0].title, author: blogsAtStart[0].author,
      url: blogsAtStart[0].url, user: blogsAtStart[0].user }

    await api
      .put(`/api/blogs/${sendBlog.id}`)
      .send(sendBlog)
      .expect(202)
      .expect('Content-Type', /application\/json/)

    const response = await api.get(`/api/blogs/${sendBlog.id}`)
    const updatedBlog = response.body

    assert.strictEqual(updatedBlog.likes, 0)
  })

  test('a blog without title or url updates return 400', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const sendBlog = { id: blogsAtStart[0].id, author: blogsAtStart[0].author, url: blogsAtStart[0].url,
      likes: blogsAtStart[0].likes, user: blogsAtStart[0].user }
    const sendBlog2 = { id: blogsAtStart[0].id, title: blogsAtStart[0].title, author: blogsAtStart[0].author,
      likes: blogsAtStart[0].likes, user: blogsAtStart[0].user }

    await api
      .put(`/api/blogs/${sendBlog.id}`)
      .send(sendBlog)
      .expect(400)

    await api
      .put(`/api/blogs/${sendBlog2.id}`)
      .send(sendBlog2)
      .expect(400)
  })
})

describe('when there is initially one user at db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'usuario01',
      name: 'Olaia Ferro',
      password: 'xxxxxx',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username or password less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: '12', name: 'Outro usuario', password: 'xxxxxxxx' }
    const newUser2 = { username: 'usuario', name: 'Outro usuario', password: '12' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('The username must be at least 3 characters long'))

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(result2.body.error.includes('The password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: helper.userRoot.username,
      name: 'Outro usuario root',
      password: 'supersuper',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('login tests', () => {
  test('login successful', async () => {
    const user = {
      username: helper.userRoot.username,
      password: helper.userRoot.password,
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(user.username, result.body.username)
    assert.ok(result.body.token.length > 0)
  })

  test('login failed no username', async () => {
    const user = {
      password: helper.userRoot.password,
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })

  test('login failed no password', async () => {
    const user = {
      username: helper.userRoot.username,
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })

  test('login failed wrong username', async () => {
    const user = {
      username: 'xxxxxx',
      password: helper.userRoot.password,
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })

  test('login failed wrong password', async () => {
    const user = {
      username: helper.userRoot.username,
      password: 'xxxxxxx',
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })
}) 

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})