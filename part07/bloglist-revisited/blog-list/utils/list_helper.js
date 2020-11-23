// A collection of functions specifically for use in testing
const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0)
    return 0
  else
    return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return {}

  let max = blogs[0]
  blogs.forEach((cur) => {
    if (max.likes < cur.likes)
      max = cur
  })
  return max
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return {}

  let authors = {}
  let maxBlogsAuthor = blogs[0].author
  blogs.forEach((cur) => {
    if (!(cur.author in authors))
      authors[cur.author] = 0

    authors[cur.author]++
  })

  for (const a in authors) {
    if (authors[maxBlogsAuthor] < authors[a])
      maxBlogsAuthor = a
  }

  return { author: maxBlogsAuthor, blogs: authors[maxBlogsAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0 )
    return {}

  let authors = {}
  let maxLikesAuthor = blogs[0].author

  blogs.forEach((cur) => {
    if ( !(cur.author in authors) )
      authors[cur.author] = 0

    authors[cur.author] += cur.likes
  })

  for (const author in authors) {
    if (authors[maxLikesAuthor] < authors[author])
      maxLikesAuthor = author
  }

  return { author: maxLikesAuthor, likes: authors[maxLikesAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}