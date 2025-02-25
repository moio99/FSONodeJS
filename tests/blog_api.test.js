const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  { title: 'Título01', author: 'author A', url: 'umha direiçom 01', likes: 2 },
  { title: 'Título02', author: 'author B', url: 'umha direiçom 02', likes: 5 },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

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

test('the identifier is called "id" and not "_id"', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert('id' in blog, 'Expected blog to have property "id"')
    assert(!('_id' in blog), 'Expected blog not to have property "_id"')
  })
})

test('a valid blog can be added ', async () => {
  const newNote = { title: 'Título03', author: 'author C', url: 'umha direiçom 03', likes: 3 }

  await api
    .post('/api/blogs')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('Título03'))
})

after(async () => {
  await mongoose.connection.close()
})