//check authorization
//redirect authorized user to profile page
//print error if user is not authorized
//print error if user does not exist

describe("Check login", () => {
    it("Checks user Authorized", () => {
        // Arrange
        cy.visit("http://localhost:8080/")
        cy.get(('#loginEmail')).type("userfernanda@noroff.no", { delay: 20 });
        cy.get('#loginPassword').type("UserProfile874", { delay: 20 });
        cy.intercept('/profile/index.html').as('profile-page')

        // Act
        cy.get('#login-form button').click();

        // Assert
        cy.wait("@profile-page")
    })

    it("Checks user not Authorized", () => {
        // Arrange
        cy.visit("http://localhost:8080/")
        cy.get(('#loginEmail')).type("userfederica@noroff.no", { delay: 20 });
        cy.get('#loginPassword').type("wrong-password", { delay: 20 });
        cy.intercept("POST", "https://v2.api.noroff.dev/auth/login").as("POST-login");

        // Act
        cy.get('#login-form button').click();
        cy.wait("@POST-login");

        // Assert
        cy.get('#error').should('have.text', 'Invalid username or password or you do not have an account yet!')
    })
})
