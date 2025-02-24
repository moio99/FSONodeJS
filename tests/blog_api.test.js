const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('Total likes', () => {

  const blogList = [
    {
      title: 'Título01',
      author: 'Nome da pessoa para o 01',
      url: 'umha direiçom 01',
      likes: 2
    },
    {
      title: 'Título02',
      author: 'Nome da pessoa para o 02',
      url: 'umha direiçom 02',
      likes: 5
    }
  ]

  test('when list is null, return 0', () => {
    const result = listHelper.totalLikes(null)
    assert.strictEqual(result, 0)
  })

  test('when list has not blogs, return 0', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const newList = [blogList[0]]
    const result = listHelper.totalLikes(newList)
    assert.strictEqual(result, newList[0].likes)
  })

  test('when list has several blogs, return de sum', () => {
    const result = listHelper.totalLikes(blogList)
    assert.strictEqual(result, 7)
  })
})

describe('Favorite blog', () => {

  const blogList = [
    {
      title: 'Título01',
      author: 'Nome da pessoa para o 01',
      likes: 2
    },
    {
      title: 'Título02',
      author: 'Nome da pessoa para o 02',
      likes: 5
    },
    {
      title: 'Título03',
      author: 'Nome da pessoa para o 03',
      likes: 3
    }
  ]

  test('when list is null, return null', () => {
    const result = listHelper.favoriteBlog(null)
    assert.strictEqual(result, null)
  })

  test('when list has not blogs, return null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, return the same', () => {
    const newList = [blogList[0]]
    const result = listHelper.favoriteBlog(newList)
    assert.deepStrictEqual(result, newList[0])
  })

  test('When the list has multiple blogs, return the largest one', () => {
    const result = listHelper.favoriteBlog(blogList)
    console.log(result.title)
    console.log(blogList[1].title)
    assert.deepStrictEqual(result, blogList[1])
  })
})