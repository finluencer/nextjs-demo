# Getting Started

This guide helps you run the demo project on your computer and explains what you are looking at.

---

## Prerequisites

You need Node.js installed (version 18 or later). Check what you have:

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

Download Node.js from [nodejs.org](https://nodejs.org) if you do not have it.

---

## Setup steps

**Step 1 — Install dependencies**

```bash
npm install
```

This reads `package.json` and downloads all the packages the project needs into a `node_modules/` folder.

**Step 2 — Set up environment variables**

```bash
cp .env.local.example .env.local
```

The `.env.local` file holds configuration values like API keys and URLs. You do not need to change anything for the demo to work — the defaults are fine.

**Step 3 — Start the development server**

```bash
npm run dev
```

You should see output like:

```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## What happens when you run `npm run dev`?

- Next.js starts a local web server on port 3000
- When you visit a page, Next.js compiles that page just-in-time
- When you edit a file, the page refreshes automatically (this is called **Hot Module Replacement**)
- Error messages appear right in the browser — you do not need to check the terminal

---

## Available pages

| URL | What it shows |
|-----|---------------|
| `http://localhost:3000` | Home page — overview of concepts |
| `http://localhost:3000/about` | About page — static rendering |
| `http://localhost:3000/blog` | Blog list with pagination |
| `http://localhost:3000/blog/1-sunt-aut-facere` | A single blog post |
| `http://localhost:3000/dashboard` | Dashboard with interactive counter |
| `http://localhost:3000/contact` | Contact form with Server Actions |
| `http://localhost:3000/api/blog` | Raw JSON from the API route |

---

## Available scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Builds the app for production (compiles all files) |
| `npm run start` | Runs the production build (run `build` first) |
| `npm run lint` | Checks your code for common mistakes |

---

## What is Next.js?

Next.js is a framework built on top of React. React gives you components and state management. Next.js adds:

- **Routing** — no need to install React Router; the file system is the router
- **Server-side rendering** — pages can be rendered on the server before being sent to the browser
- **API routes** — build a backend API in the same project
- **Performance tools** — image optimization, font optimization, code splitting
- **Full-stack in one project** — frontend and backend together

---

## What is the App Router?

Next.js has two routing systems. This project uses the newer one called the **App Router** (introduced in Next.js 13).

The App Router lives in the `app/` directory. Every file named `page.tsx` becomes a URL route. Every file named `layout.tsx` wraps that route with shared UI.

The older system (Pages Router) used a `pages/` directory. You may see both in older tutorials online. This project uses only the App Router.

---

## Next steps

Read [02 — Project Structure](02-project-structure.md) to understand how the files are organized.
