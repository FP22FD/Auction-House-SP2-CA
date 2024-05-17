# Auction-House-SP2-CA

<!-- A simple overview of use/purpose. -->

Noroff Course Assignment for Semester Project 2.

![figma]()

- [Brief](docs/SP2-brief.pdf)
- [Criteria](docs/SP2-criteria.pdf)

- [Design Prototype](https://www.figma.com/proto/VT0PmzsvgFgwQ1kLojZyuy/5.Semester-project-SP2?page-id=4755%3A981&node-id=9076-360306&viewport=-447%2C388%2C0.32&t=LqidkfQt2smkSLWH-1&scaling=scale-down&starting-point-node-id=9068%3A102840)
- [Style Guide](https://www.figma.com/proto/VT0PmzsvgFgwQ1kLojZyuy/5.Semester-project-SP2?page-id=9046%3A70050&node-id=9046-97385&viewport=185%2C-580%2C0.24&t=yZK5KSGQy5cTOhDV-1&scaling=scale-down&starting-point-node-id=9046%3A97385)
- [Kanban Board](https://github.com/users/FP22FD/projects/7)
- [Gantt Chart](https://github.com/users/FP22FD/projects/7/views/4)
- [Repository](https://github.com/FP22FD/Auction-House-SP2-CA)
- [Hosted Demo](https://fp22fd.github.io/Auction-House-SP2-CA/)

NB. There is a slight difference between the prototype and the implemented website due to some improvements.

## Live app

This project is deployed on [Pages](https://fp22fd.github.io/Auction-House-SP2-CA/).

## Description

<!-- An in-depth paragraph about your project and overview of use. -->

The main purpose of this CA is to take the skills learned over the past three semesters and create an auction website.

- CSS framework `Bootstrap`, `SASS`,
- REST API advanced features like GET, POST, PUT, DELETE
- array functions: `filter`, `map`, `forEach`
- destructuring
- `JWT` token and API authorization concepts
- usage of `local storage`
- `Vite` bundler
- effective workflow via `Eslint`, `Prettier`, commit hooks (`Husky`)
- security concepts (`Dompurify`)
- `.env` file to manage secrets for local development

- documentation via `JsDocs`
- examine informal `test set`, `formal testing` strategies, and the use of tools to automate and improve the quality of testing process:
  - `Manual testing` using devTools as console statements, breakpoints, network tab, etc
  - `Unit testing` using `Vitest`
  - `End-to-end testing` (e2e testing) or Integration test using `Cypress` framework
- usage of `Hotjar`

- CI/CD pipeline within Github:

  - `GitHub Actions`
  - `Environment Secrets`

- responsive design (concepts, media queries, etc)
- semantic html 5
- DRY (sass variables, structured code, etc)
- accessibility concepts (WCAG)
- developer tools (VS Code, Prettier, DevTools, Github, Github Pages, Postman, etc)
- code validation tools

## API

- The API used in this project can be found under Auction House Endpoints in the Noroff API documentation. [v2](https://docs.noroff.dev/docs/v2).
- Auction House API routes require both a JWT token and an API Key.

## Feature implemented

- unregistered user can view and search through Listings
- user can register (only @stud.noroff.no email can register a new profile)
- user can login and logout
- a logged-in user can:
  - update their avatar
  - see his stats (listings, bids, wings and total credits)
  - view the user content listing
  - filter the content listing
  - search the content listing
  - view Bids made on a Listing
  - create a new listing with a title, deadline date, media gallery and description

<!-- - Describe any prerequisites, libraries, OS version, etc., needed before installing the program.
- ex. Windows 10 -->

## Local development

- fill `.env` following `.env.example`:

  - Specify VITE_APP_GITHUB_PAGES_REPO (for example `Your-Github-Repo`)
  - Specify VITE_API_KEY (the guid key you got from `/auth/create-api-key`)

> npm install
> npm run dev

## JSDOC

The code is documented using `JsDocs`.
The documentation can be generated in `/out/index` using:

> npm run docs

## Validation

The web application code has been validated using the following tools:

- check html validity: <https://validator.w3.org/>
- check css validity: <https://jigsaw.w3.org/css-validator/>
- check redirect links: <https://validator.w3.org/checklink>
- check accessibility: <https://www.accessibilitychecker.org/>

NB: some empty CSS classes are flagged as errors by the [W3 validator](http://validator.w3.org).
The issue is probably caused by [a bug](https://github.com/twbs/bootstrap/issues/36508) in the web tool.

## Dependencies

To develop the web application I have used `Visual Studio Code` with `Prettier` formatter extension.

> npm install
> npm run dev

## Workflow badges

[![Automated Unit Testing](https://github.com/FP22FD/Auction-House-SP2-CA/actions/workflows/unit-test.yml/badge.svg?branch=main)](https://github.com/FP22FD/Auction-House-SP2-CA/actions/workflows/unit-test.yml)

[![Automated E2E Testing](https://github.com/FP22FD/Auction-House-SP2-CA/actions/workflows/e2e-test.yml/badge.svg)](https://github.com/FP22FD/Auction-House-SP2-CA/actions/workflows/e2e-test.yml)

[![Deploy to Pages with Secret](https://github.com/FP22FD/Auction-House-SP2-CA/actions/workflows/pages.yml/badge.svg)](https://github.com/FP22FD/Auction-House-SP2-CA/actions/workflows/pages.yml)
