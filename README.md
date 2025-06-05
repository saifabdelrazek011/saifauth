# Saif-AUTH API

A robust authentication API built with Node.js, Express, and MongoDB that provides comprehensive user authentication features including signup, signin, email verification, and password management.

## Features

- 🔐 **User Authentication**: Secure signup and signin functionality
- 📧 **Email Verification**: Email-based account verification system
- 🔑 **Password Management**: Change password and forgot password functionality
- 🛡️ **Security**: Rate limiting, bot detection, and request shielding with Arcjet
- 📝 **Data Validation**: Comprehensive input validation with Joi
- 🔒 **Password Security**: Strong password requirements and secure hashing
- 📮 **Email Service**: Automated email sending for verification codes

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Email**: Nodemailer
- **Security**: Arcjet (rate limiting, bot detection, shield)
- **Password Hashing**: bcrypt with HMAC

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- email account for sending emails

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/saifabdelrazek011/auth-api.git
cd auth-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Email Configuration
NODE_CODE_SENDING_EMAIL_SERVICE=your_email_service_provider
NODE_CODE_SENDING_EMAIL_ADDRESS=your_email_address
NODE_CODE_SENDING_EMAIL_PASSWORD=your_email_app_password

# Security
HMAC_SECRET=your_hmac_secret_key
ARCJET_KEY=your_arcjet_api_key

# Server
PORT=3000
```

4. **Start the server**
```bash
npm start
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/signin` | User login | No |
| POST | `/auth/signout` | User logout | Yes |
| PATCH | `/auth/verification/send` | Verify email with code | No |
| PATCH | `/auth/verification/verify` | Send verification code | No |
| PATCH | `/auth/password/forget` | Send forgot password code | No |
| PATCH | `/auth/password` | Change password (logged in) | Yes |
| PATCH | `/auth/password/reset` | Reset forgotten password | No |
| GET | `/auth/users/one` | Get specific user info | Yes |
| GET | `/auth/users/all` | Get all users (admin only) | Yes |

### Posts Routes
| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| GET | `/posts` | Get all posts | NO |
| GET | `/posts/:postId` | Get a specific post | NO |
| POST | `/posts` | Create a new post | Yes |
| PUT | `/posts/:postId` | Update a post | Yes |
| DELETE | `/posts/:postId` | Delete a post | Yes |
| GET | `/posts/user/:userId` | Get posts by user | NO |


## Request/Response Examples

### User Signup
```bash
POST /auth/signup
```
```json
{
  "firstName": "Saif",
  "lastName": "Abdelrazek",
  "email": "saif.abdelrazek@example.com",
  "password": "MySecure123!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "user_id",
    "firstName": "Saif",
    "lastName": "Abdelrazek",
    "email": "saif.abdelrazek@example.com",
    "verified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### User Signin
```bash
POST /auth/signin
```


**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "Saif",
    "email": "saif.abdelrazek@example.com",
    "verified": true
  }
}

```

### Get All Users (Admin Only)
```bash

GET /auth/users/all
Authorization: Bearer your_jwt_token

```json
{
  "email": "saif.abdelrazek@example.com",
  "password": "MySecure123!"
}
```

### Send Verification Code
```bash
PATCH /verification/send
```
```json
{
  "email": "saif.abdelrazek@example.com"
}
```

### Verify Email
```bash
PATCH /verification/verify
```
```json
{
  "email": "saif.abdelrazek@example.com",
  "providedCode": "123456"
}
```

### Forgot Password
```bash
POST /auth/password/forget
```
```json
{
  "email": "saif.abdelrazek@example.com"
}
```

### Reset Password
```bash
PATCh /auth/password/reset
```
```json
{
  "email": "saif.abdelrazek@example.com",
  "providedCode": "123456",
  "newPassword": "NewSecure123!"
}
```

### Change Password (Authenticated)
```bash
PATCH /auth/password
Authorization: Bearer your_jwt_token
```
```json
{
  "oldPassword": "MySecure123!",
  "newPassword": "NewSecure123!"
}
```

## Validation Rules

### Email
- Must be a valid email format
- Only allows `.com`, `.net`, `.org` domains
- Required for all authentication operations

### Password
- Minimum 8 characters, maximum 128 characters
- Must contain at least:
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One number (0-9)
  - One special character: `!@#$%^&*(),.?":{}|<>`

### Name
- First name is required
- Last name is optional
- Trimmed automatically

## Security Features

### Rate Limiting
- 5 requests per 10 seconds per IP
- Automatic token bucket refill
- 429 status code for exceeded limits

### Bot Detection
- Allows search engines, Postman, and cURL
- Blocks malicious bots
- Spoofed bot detection

### Password Security
- bcrypt hashing with salt rounds of 13
- HMAC verification for codes
- Secure password validation

### Email Verification
- 6-digit verification codes
- 10-minute expiration time
- HMAC-secured code storage

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Project Structure

```
auth-api/
├── controllers/
│   └── authController.js      # Authentication logic
|   └── postsController.js     # Posts logic
├── middlewares/
│   ├── validator.js           # Joi validation schemas
│   ├── sendMail.js           # Email configuration
│   ├── identification.js     # JWT middleware
│   └── arcjetMiddleware.js   # Security middleware
├── models/
│   ├── usersModel.js         # User schema
│   └── postsModel.js         # Post schema
├── routers/
│   └── authRouter.js         # Authentication routes
│   └── postsRouter.js        # Posts routes
├── utils/
│   └── hashing.js            # Hashing utilities
├── .env                      # Environment variables
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email dev@saifabdelrazek.com or create an issue in the GitHub repository.

## Changelog

### v1.0.0
- Initial release
- Basic authentication features
- Email verification system
- Password management
- Security middleware integration
