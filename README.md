# Book Review App

A Book Review REST API built with Node.js and Express. Final project for **IBM Full Stack Developer — Course 6: Developing Back-End Apps with Node.js and Express**.

## Overview

The app serves a catalog of 10 books (ISBNs 1–10) and lets users browse books by ISBN, author, or title, register and log in, and add, modify, and delete their own book reviews. Log in once and the JWT access token is kept in the session, so later review requests authenticate with the session cookie.

## Project structure

```
.
├── index.js            # Entry point (listens on port 5000)
├── booksdb.js          # Book catalog (10 books, ISBNs 1–10)
├── router/
│   ├── general.js      # Public routes, registration, and async routes
│   └── auth_users.js   # Login and authenticated review routes
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
| POST | `/register` | Register a new user |

Async (Promise / `async`-`await`) versions of the same lookups:

| Method | Endpoint |
| ------ | -------- |
| GET | `/async/books` |
| GET | `/async/isbn/:isbn` |
| GET | `/async/author/:author` |
| GET | `/async/title/:title` |

## Authenticated routes (`router/auth_users.js`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/customer/login` | Log in (returns a JWT access token; also stored in the session) |
| PUT | `/customer/auth/review/:isbn` | Add or modify your review |
| DELETE | `/customer/auth/review/:isbn` | Delete your review |

Review requests run through the JWT auth middleware on `/customer/auth/*` and use the session created at login. Public routes and `/register` / `/customer/login` do not need a login.

## Example

```bash
# Register a user
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"jarif","password":"password123"}'

# Log in (saves the session cookie to cookies.txt)
curl -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jarif","password":"password123"}'

# Get all books
curl http://localhost:5000/

# Add a review for book 1 (uses the login session cookie)
curl -b cookies.txt -X PUT "http://localhost:5000/customer/auth/review/1?review=A%20timeless%20classic."

# Delete the review
curl -b cookies.txt -X DELETE http://localhost:5000/customer/auth/review/1
```

## Verification

The app was verified locally with 20 curl checks — **20/20 passed** (17 HTTP 200, 1 HTTP 404 for re-registering an existing user, 1 HTTP 403 for an unauthenticated review attempt, and 1 HTTP 208 for a wrong-password login), covering registration, login, all public and async lookups, and add / modify / delete review flows. See `00-full-test-run.txt` for the full terminal output.
