describe('Blog app', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    const user = {
      name: 'Root Rooterson',
      username: 'root',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3000/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Front page can be opened', function() {
    cy.contains('Blogs')
    cy.contains('Blog App')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
  })

  it('User can log in', function() {
    cy.get('#login-username').type('root')
    cy.get('#login-password').type('sekret')
    cy.get('#login-submit').click()

    cy.contains('root logged in')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'sekret' })
    })

    it('A blog can be added', function() {
      cy.get('#toggle-blog-on').click()
      cy.get('#blog-title').type('A blog by cypress')
      cy.get('#blog-author').type('Cypress Johnson')
      cy.get('#blog-url').type('www.couponbug.com')
      cy.get('#blog-submit').click()
    })

    describe('A blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Another blog by cypress',
          author: 'Cypress Johnson',
          url: 'www.couponbug.com'
        })
      })

      it('Can be liked', function() {
        cy.contains('Another blog by cypress by Cypress Johnson')
          .contains('Show')
          .click()

        cy.contains('Another blog by cypress by Cypress Johnson')
          .parent()
          .contains('Like')
          .click()

        cy.contains('Liked \'Another blog by cypress\'')
      })

      it('Can be deleted', function() {
        cy.contains('Another blog by cypress by Cypress Johnson')
          .contains('Show')
          .click()

        cy.contains('Another blog by cypress by Cypress Johnson')
          .parent()
          .contains('Delete')
          .click()

        cy.on('window:confirm', () => true)

        cy.contains('Deleted \'Another blog by cypress\'')
      })
    })

    describe('Multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Blog with 5',
          author: 'Cypress Johnson',
          url: 'www.couponbug.com',
          likes: 5
        })
        cy.createBlog({
          title: 'Blog with 1',
          author: 'Cypress Johnson',
          url: 'www.couponbug.com',
          likes: 1
        })
        cy.createBlog({
          title: 'Blog with 20',
          author: 'Cypress Johnson',
          url: 'www.couponbug.com',
          likes: 20
        })
      })

      it('Blogs are displayed in the right order', function() {
        /*var blogs = []
        cy.get('#blog-list').should('contain', 'Show')
        cy.get('#blog-list').children().each(element => {
          blogs.push(element.find('.likes-label').text().split(' ')[1].slice(0, -4))
        })
        cy.wrap(blogs).should('equal', ['20', '5', '1'])*/

        cy.get('.blogItem')
          .eq(0)
          .should('contain.text', 'Likes: 20')
        cy.get('.blogItem')
          .eq(1)
          .should('contain.text', 'Likes: 5')
        cy.get('.blogItem')
          .eq(2)
          .should('contain.text', 'Likes: 1')
      })
    })
  })

  it('Login fails with wrong credentials', function() {
    cy.get('#login-username').type('root')
    cy.get('#login-password').type('secret')
    cy.get('#login-submit').click()

    cy.get('.error')
      .should('contain', 'invalid username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      //.and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Root Rooterson logged in')
  })
})