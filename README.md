# D_Tunes

A full-stack music web application built with **Node.js**, **TypeScript**, and **Express** — featuring artist publishing, playlist management, social features, a party mode, and Spotify integration.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

D_Tunes is a full-featured music streaming platform where artists can publish their songs, users can discover and like tracks, build playlists, follow friends, and even host synchronized listening sessions with **Party Mode**. It integrates with the **Spotify API** for extended music data and supports profile image uploads.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Runtime     | Node.js                             |
| Language    | TypeScript                          |
| Framework   | Express.js                          |
| Database    | MongoDB (via Mongoose)              |
| Templating  | EJS                                 |
| Auth        | JWT + bcrypt + D-Auth (OAuth)       |
| Validation  | Zod                                 |
| File Upload | Multer                              |
| HTTP Client | Axios (Spotify API integration)     |
| Bundler     | Webpack                             |
| Dev Server  | Nodemon + ts-node                   |

---

## Features

### Authentication
- User **Sign Up** and **Sign In** with JWT-based secure sessions
- **D-Auth** (OAuth) integration for third-party login
- Password hashing with **bcrypt**
- Cookie-based session management
- Auth bug fixes and robust error handling

### Artist Features
- Artists can **publish** their own songs to the platform
- Published tracks are publicly visible to all users
- Other users can **like** a track and **add** it to their playlists directly from the artist's page
- Dedicated **Artist Pages** to showcase all uploaded content
- Artist page UI updated for better user experience

### Track Playback
- Songs play directly within the app via integrated API calls
- Spotify **Access Token** integration for fetching track metadata and enabling playback
- Smooth and reliable song streaming with proper API handling

### Playlists
- Users can **create** custom playlists
- **Add tracks** to any existing playlist
- **Play an entire playlist** from start to finish
- Liked songs are **automatically added** to a dedicated Liked Songs playlist

### Like / Dislike
- **Like** or **dislike** any track
- Liked tracks are reflected immediately in the user's Liked Songs playlist

### User Profiles
- Upload and store a **profile image** (stored via category routes / Multer)
- View and update your own public profile page

### Social — Friend Requests
- Send **friend requests** to other users
- View other users' **public profiles**
- Manage incoming and outgoing friend requests

### Party Mode
- Host a **synchronized listening party** session with friends
- Real-time collaborative music experience where all participants hear the same track
- Full party mode implementation with session management

### Categories
- Browse and discover music organized by **category**

### Spotify Integration
- OAuth **Access Token** flow to connect with Spotify
- Fetch track data, metadata, and enable playback via the Spotify API

---

## API Routes

| Module         | File                 | Description                                    |
|----------------|----------------------|------------------------------------------------|
| Authentication | `authRoutes.ts`      | Sign up, sign in, D-Auth OAuth                 |
| Artists        | `artistRoutes.ts`    | Publish songs, view artist pages               |
| Tracks         | `trackRoutes.ts`     | Fetch, like/dislike, and play tracks           |
| Playlists      | `playListRoutes.ts`  | Create, manage, and play playlists             |
| Users          | `userRoutes.ts`      | User profiles, friend requests                 |
| Categories     | `categoryRoutes.ts`  | Browse by category, profile image upload       |
| Party          | `partyRoutes.ts`     | Create and join party listening sessions       |

---

## Project Structure

```
D_Tunes/
├── src/
│   ├── routes/
│   │   ├── artistRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── partyRoutes.ts
│   │   ├── playListRoutes.ts
│   │   ├── trackRoutes.ts
│   │   └── userRoutes.ts
│   └── index.ts
├── config/               # App configuration
├── dist/                 # Compiled output (generated)
├── public/               # Static assets (CSS, JS, images)
├── .env.example          # Environment variable template
├── webpack.config.js     # Webpack bundler config
├── tsconfig.json         # TypeScript config
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A running **MongoDB** instance (local or MongoDB Atlas)
- A **Spotify Developer** account for API credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/Revant-S/D_Tunes.git
cd D_Tunes

# Install dependencies
npm install
```

### Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

> Refer to `.env.example` in the repository for the complete list of required variables.

### Running the App

**Development mode** (with hot-reload via Nodemon):

```bash
npm start
```

**Build for production:**

```bash
npm run build
```

The compiled output will be placed in the `dist/` folder.

---

## Scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm start`     | Start dev server with Nodemon        |
| `npm run build` | Bundle the app using Webpack         |

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request
