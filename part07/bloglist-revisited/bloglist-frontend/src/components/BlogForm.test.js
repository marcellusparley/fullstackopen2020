import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('Event handler for submit is called', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm blogAppend={createBlog} />
  )

  const inputTitle = component.container.querySelector('.blogTitle')
  const inputAuthor = component.container.querySelector('.blogAuthor')
  const inputURL = component.container.querySelector('.blogURL')
  const form = component.container.querySelector('.blogForm')

  fireEvent.change(inputTitle, {
    target: { value: 'This is the title' }
  })
  fireEvent.change(inputAuthor, {
    target: { value: 'Author McAuthor' }
  })
  fireEvent.change(inputURL, {
    target: { value: 'www.author.com' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('This is the title')
  expect(createBlog.mock.calls[0][0].author).toBe('Author McAuthor')
  expect(createBlog.mock.calls[0][0].url).toBe('www.author.com')
})