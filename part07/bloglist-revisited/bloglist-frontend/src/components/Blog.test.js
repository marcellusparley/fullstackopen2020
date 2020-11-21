import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('Renders title and author but not url and likes', () => {
  const blog = {
    title: 'John wuz here',
    author: 'John',
    url: 'www.ieatpizza.com',
    likes: 50
  }

  const component = render(
    <Blog blog={blog} liker={() => {}} remover={() => {}} />
  )

  const infoElem = component.container.querySelector('.hidableBlogInfo')

  expect(component.container).toHaveTextContent(
    'John wuz here by John'
  )

  expect(infoElem).toBeDefined()
  expect(infoElem).toHaveStyle('display: none')
})

test('Clicking the toggle button once shows the url and likes', () => {
  const blog = {
    title: 'John wuz here',
    author: 'John',
    url: 'www.ieatpizza.com',
    likes: 50
  }

  const component = render(
    <Blog blog={blog} liker={() => {}} remover={() => {}} />
  )

  const button = component.container.querySelector('.toggleButton')
  const infoElem = component.container.querySelector('.hidableBlogInfo')

  expect(infoElem).toHaveStyle('display: none')
  expect(button).toHaveTextContent('Show')
  fireEvent.click(button)
  expect(infoElem).not.toHaveStyle('display: none')
  expect(button).toHaveTextContent('Hide')
})

test('Clicking the the like button twice should call handler twice', () => {

  const blog = {
    title: 'John wuz here',
    author: 'John',
    url: 'www.ieatpizza.com',
    likes: 50
  }

  const mockLiker = jest.fn()

  const component = render(
    <Blog
      blog={blog}
      liker={mockLiker}
      remover={() => {console.log('remove')}}
    />
  )

  const toggleButton = component.container.querySelector('.toggleButton')
  expect(toggleButton).toBeDefined()
  fireEvent.click(toggleButton)

  const likeButton = component.container.querySelector('.likeButton')
  expect(likeButton).toBeDefined()
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockLiker.mock.calls).toHaveLength(2)
})
