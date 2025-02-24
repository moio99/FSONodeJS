const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogList) => {
  let result = 0
  if (blogList) {
    result = blogList.reduce((sum, blog) => sum + blog.likes, 0)
  }
  return result
}

const favoriteBlog = (blogList) => {
  if (blogList && blogList.length > 0) {
    /* let max = blogList[0]
    for (let i = 1; i < blogList.length; i++) {
      if (max.likes < blogList[i].likes) {
        max = blogList[i]
      }
    }
    return max */
    const topAuthor = lodash.maxBy(blogList, 'likes')
    return topAuthor
  }
  return null
}

const mostBlogs = (blogList) => {
  if (blogList && blogList.length > 0) {
    const grouped = lodash.countBy(blogList, 'author')
    const authors = lodash.map(grouped, (blogs, author) => ({ author, blogs }))
    const topAuthor = lodash.maxBy(authors, 'blogs')
    return topAuthor
  }
  return null
}

const mostLikes = (blogList) => {
  if (blogList && blogList.length > 0) {
    const grouped = lodash.groupBy(blogList, 'author')
    const authors = lodash.map(grouped, (blogs, author) => ({
      author,
      likes: lodash.sumBy(blogs, 'likes'),
    }))

    const topAuthor = lodash.maxBy(authors, 'likes')

    console.log(topAuthor)
    return topAuthor
  }
  return null
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}