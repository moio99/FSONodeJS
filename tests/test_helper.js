const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  { title: 'Título01', author: 'author A', url: 'umha direiçom 01', likes: 2 },
  { title: 'Título02', author: 'author B', url: 'umha direiçom 02', likes: 5 },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'TítuloXX', author: 'author X', url: 'umha direiçom XX' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}