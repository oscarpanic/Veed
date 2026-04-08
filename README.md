## VEED Video App

This project was boostrapped with the help of GitHub Copilot, which in turn leveraged [Create React App](https://github.com/facebook/create-react-app) for the front end. (See [README](./client/README.md) in client directory for more information on this).

## Tech stack
**Frontend:** React + Typescript
**Backend:** Node.js
**Testing:** Jest + React Testing Library
**Additional libraries/dependancies:** Material UI, Material Icons

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
AI is an extremely useful tool to help boostrap a project and getting straight to business. However, it is also prone to either do more or do less than you required/expected. In this case, I had to redo and undo several parts of the code it generated, as I ran into small issues with the setup (which were trivial to solve leveraging the Copilot once more, as can be seen in the prompts log) and with the project structure (which I addressed manually). 
The main thing that surprised me was that it pregenerated VideoList and VideoCard components for me, which I did not intend. I heavily changed them in any case and moved them to different directories.

### Future tweaks
With more time, the following tweaks would be on top of my mind:
- Pagination to avoid issues with longer results that might cause the client to have some trouble rendering or loading elements.
- Testing for backend portion
- Deletion of elements. The backend already has the main functionality for this, but the front end is not implemented.
- More elaborate loading state (default wheel or shimmer elements for example)
- Individual video page
- More fields to include when creating a video