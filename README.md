## VEED Video App

This project was boostrapped with the help of GitHub Copilot, which in turn leveraged [Create React App](https://github.com/facebook/create-react-app) for the front end. (See README in client directory for more information on this).

## Tech stack
**Frontend:** React + Typescript
**Backend:** Node.js
**Testing:** Jest + React Testing Library
**Additional libraries/dependancies:** Material UI

## Running the project:

### npm run install:all (from root)
Install everything

### npm run dev:backend
Runs backend on http://localhost:4000

### pm run dev:frontend
Runs frontend on http://localhost:3000

### npm test
Runs tests on Jest + RTL

### AI usage
Used Github Copilot mainly for bootstrapping the app. Additional usage of GitHub Copilot was leveraged for debugging/solving issues related to the boostrapping, general app setup, git repo setup, and external libraries.

See [PROMPTS.md](PROMPTS.md) for more full conversation logs.

** Reflections on AI usage **
AI is an extremely useful tool to help boostrap a project and getting straight to business. However, it is also prone to either do more or do less than you required/expected. In this case, I had to redo and undo several parts of the code it generated, as I ran into small issues with the setup (which were trivial to solve leveragint the Copilot once more) and with the project structure (which I addressed manually). 
