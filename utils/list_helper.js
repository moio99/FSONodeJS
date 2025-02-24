const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let result = 0
  if (blogs) {
    result = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  return result
}

const favoriteBlog = (blogs) => {
  if (blogs && blogs.length > 0) {
    let max = blogs[0]
    for (let i = 1; i < blogs.length; i++) {
      if (max.likes < blogs[i].likes) {
        max = blogs[i]
      }
    }
    return max
  }
  return null
}

const mostBlogs = (blogs) => {
  if (blogs && blogs.length > 0) {
    const grouped = lodash.countBy(blogs, 'author')
    const authors = lodash.map(grouped, (blogs, author) => ({ author, blogs }))
    const topAuthor = lodash.maxBy(authors, 'blogs')
    return topAuthor
  }
  return null
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}