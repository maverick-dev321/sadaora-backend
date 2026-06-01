# Sadaora Backend

The backend for the Sadaora Starter App, built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication**: JWT-based signup/login
- **Profiles**: CRUD operations for user profiles
- **Feed**: Public feed of user profiles
- **Follow System**: Follow/unfollow users
- **Like System**: Like/unlike profiles
- **Posts**: Create, read, delete posts with images
- **Post Likes**: Like/unlike posts
- **Comments**: Add comments to posts

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **File Storage**: AWS S3 (or compatible)
- **Language**: TypeScript

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```plaintext
PORT=5000
DB_NAME=sadaora
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
CLIENT_URL=http://localhost:5173
```

## Database Setup

1. Install PostgreSQL
2. Create a database named `sadaora`

## Installation
```bash
npm install
```


## Running the Server
```bash
npm run dev
```

## API Endpoints
### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Profiles
- `POST /api/profile` - Create profile
- `GET /api/profile/:userId` - Get profile
- `PATCH /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile

### Feed
- `GET /api/feed` - Get profiles feed

### Follow
- `POST /api/follow/:userId/follow` - Follow user
- `DELETE /api/follow/:userId/unfollow` - Unfollow user
- `GET /api/follow/:userId/followers` - Get user's followers
- `GET /api/follow/:userId/following` - Get user's following
- `GET /api/follow/:userId/check-follow` - Check follow status

### Like
- `POST /api/like/:profileId/like` - Like profile
- `DELETE /api/like/:profileId/unlike` - Unlike profile
- `GET /api/like/:profileId/likes` - Get profile likes
- `GET /api/like/:profileId/check-like` - Check like status

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:postId` - Get single post
- `DELETE /api/posts/:postId` - Delete post

### Post Likes
- `POST /api/posts/:postId/like` - Like post
- `DELETE /api/posts/:postId/unlike` - Unlike post
- `GET /api/posts/:postId/check-like` - Check post like status

### Comments
- `POST /api/posts/:postId/comments` - Add comment
- `GET /api/posts/:postId/comments` - Get post comments
- `DELETE /api/posts/comments/:commentId` - Delete comment

## Architecture
The backend follows a layered architecture:
1. **Routes:** Define API endpoints
2. **Controllers:** Handle request/response logic
3. **Services:** Business logic
4. **Models:** Database models and relationships
5. **Middlewares:** Authentication and error handling
