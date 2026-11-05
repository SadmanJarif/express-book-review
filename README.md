# Book Review App

A Book Review REST API built with Node.js and Express. Final project for **IBM Full Stack Developer — Course 6: Developing Back-End Apps with Node.js and Express**.

## Overview

The app serves a catalog of 10 books (ISBNs 1–10) and lets users browse books by ISBN, author, or title, register and log in, and add, modify, and delete their own book reviews. Authenticated requests use a JWT access token; public browsing needs no login.

## Project structure

```
.
├── index.js            # Entry point (listens on port 5000)
├── booksdb.js          # Book catalog (10 books, ISBNs 1–10)
├── router/
│   ├── general.js      # Public routes + async (Promise / async-await) routes
│   └── auth_users.js   # Registration, login, and review routes
├── package.json
├── SUMMARY.md          # Build summary
└── 00-full-test-run.txt # Full curl test log (20/20 checks passed)
```

## Getting started

```bash
npm install
node index.js
```

The server starts at `http://localhost:5000`. Verified with Node v24.22.1 and npm 10.9.4.

## Public routes (`router/general.js`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/` | Get all books |
| GET | `/isbn/:isbn` | Get a book by ISBN |
| GET | `/author/:author` | Get books by author |
| GET | `/title/:title` | Get books by title |
| GET | `/review/:isbn` | Get reviews for a book |

Async (Promise / `async`-`await`) versions of the same lookups:

| Method | Endpoint |
| ------ | -------- |
| GET | `/async/` |
| GET | `/async/isbn/:isbn` |
| GET | `/async/author/:author` |
| GET | `/async/title/:title` |

## Authenticated routes (`router/auth_users.js`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/register` | Register a new user |
| POST | `/login` | Log in (returns a JWT access token) |
| PUT | `/auth/review/:isbn` | Add or modify your review |
| DELETE | `/auth/review/:isbn` | Delete your review |

Authenticated requests send `Authorization: Bearer <token>`. Public routes and `/register` / `/login` do not need a token.

## Example

```bash
# Register a user
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"jarif","password":"password123"}'

# Log in and get a token
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jarif","password":"password123"}'

# Get all books
curl http://localhost:5000/

# Add a review (replace <token> with the JWT from login)
curl -X PUT http://localhost:5000/auth/review/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"review":"A timeless classic."}'
```

## Verification

The app was verified locally with 20 curl checks — **20/20 passed** (17 HTTP 200, 1 HTTP 404 for a non-existent ISBN, and 1 HTTP 208 for re-registering an existing user), covering registration, login, all public and async lookups, and add / modify / delete review flows. See `00-full-test-run.txt` for the full terminal output.
