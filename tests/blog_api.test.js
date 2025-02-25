const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
const { title } = require('node:process')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
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
  test('a valid blog can be added', async () => {
    const newBlog = { title: 'Título03', author: 'author C', url: 'umha direiçom 03', likes: 3 }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Título03'))
  })

  test('a blog without likes adds likes equal to 0', async () => {
    const newBlog = { title: 'Título04', author: 'author D', url: 'umha direiçom 04' }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blog = response.body.find(b => b.title === newBlog.title)

    assert.strictEqual(blog.likes, 0)
  })

  test('a blog without title or url adds return 400', async () => {
    const newBlog = { author: 'author E', url: 'umha direiçom 05', likes: 5 }
    const newBlog2 = { title: 'Título05', author: 'author E', likes: 5 }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .expect(400)

    const response2 = await api.get('/api/blogs')
    assert.strictEqual(response2.body.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
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
    const sendBlog = { id: blogsAtStart[0].id, title: blogsAtStart[0].title, author: blogsAtStart[0].author, url: blogsAtStart[0].url }

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
      likes: blogsAtStart[0].likes }
    const sendBlog2 = { id: blogsAtStart[0].id, title: blogsAtStart[0].title, author: blogsAtStart[0].author,
      likes: blogsAtStart[0].likes }

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

after(async () => {
  await mongoose.connection.close()
})