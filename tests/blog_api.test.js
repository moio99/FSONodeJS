const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

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