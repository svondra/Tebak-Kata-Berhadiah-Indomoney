# IndoMoney Quiz Backend

This small API lets every player receive the same quiz updates.

## Local Run

```sh
cd backend
npm install
npm run dev
```

Open:

```txt
http://localhost:3000/api/quiz
```

## Deploy

Deploy this `backend` folder to a Node host such as Render, Railway, Fly.io, or a VPS.

Set environment variables:

```txt
EDITOR_ID=indomoney
EDITOR_PASSWORD=selenacantik
ALLOWED_ORIGIN=https://your-github-username.github.io
```

After deploy, copy the backend URL into `API_BASE` inside `outputs/index.html`.

Example:

```js
const API_BASE = "https://your-backend.onrender.com";
```

Then push `outputs/index.html` to GitHub Pages.
