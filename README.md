# Eventribe - Event Management Platform Backend API

## Description

Eventribe is a backend API for an Event Management Platform that allows users to create and manage events. Users can sign up, log in, create events, and register for events. The API also supports email notifications for event registrations.

## Features

- User registration and authentication
- Event creation, updating, deletion, and listing
- Event registration for attendees
- Email notifications for event organizers and attendees upon registration

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- Nodemailer for email notifications
- Joi for request validation

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine
- MongoDB instance running (locally or on a cloud service like MongoDB Atlas)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Nishadburhan/eventribe.git
   cd eventribe
2. Install dependencies:
    ```
    npm install
3. Create a `.env` file in the root directory and configure the following environment variables:
    ```
    PORT=3000
    DB_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    SMTP_SERVER=smtp.your_email_provider.com
    SMTP_PORT=587
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
### Running the Application
Start the server in development mode:
```
npm run dev
```
The server will start listening on `http://localhost:3000`.

## API Endpoints
### User Endpoints
#### Register a new user
```
POST /api/v1/users/signup
```
#### Request Body:
```
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```
#### Response:
```
{
  "message": "User successfully registered!"
}
```
#### Login a user
```
POST /api/v1/users/login
```
#### Request Body:
```
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
#### Response:
```
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "john.doe@example.com"
  },
  "message": "User logged in successfully"
}
```
### Event Endpoints
#### List all events
```
GET /api/v1/events
```
#### Response:
```
[
  {
    "name": "Event Name",
    "date": "2023-01-01",
    "time": "10:00 AM",
    "organizer": {
      "name": "Organizer Name",
      "email": "organizer@example.com"
    },
    "attendees": [
      {
        "name": "Attendee Name",
        "email": "attendee@example.com"
      }
    ]
  }
]
```
#### Create a new event
```
POST /api/v1/events
```
#### Request Body:
```
{
  "name": "Event Name",
  "date": "2023-01-01",
  "time": "10:00 AM"
}
```
#### Response:
```
{
  "name": "Event Name",
  "date": "2023-01-01",
  "time": "10:00 AM",
  "organizer": "organizer_id"
}
```
#### Update an event
```
PUT /api/v1/events/:id
```
#### Request Body:
```
{
  "name": "Updated Event Name",
  "date": "2023-01-02",
  "time": "11:00 AM"
}
```
#### Response:
```
{
  "name": "Updated Event Name",
  "date": "2023-01-02",
  "time": "11:00 AM",
  "organizer": "organizer_id"
}
```
#### Delete an event
```
DELETE /api/v1/events/:id
```
#### Response:
```
{
  "message": "Event successfully deleted"
}
```
#### Register for an event
```
POST /api/v1/events/:id/register
```
#### Response:
```
{
  "name": "Event Name",
  "date": "2023-01-01",
  "time": "10:00 AM",
  "organizer": "organizer_id",
  "attendees": ["attendee_id"]
}
```
## Project Structure
```
eventribe/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   ├── database.js
│   │   └── nodemailer.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── eventController.js
│   ├── helpers/
│   │   ├── validateUser.js
│   │   ├── validateEvent.js
│   │   └── emailTemplates.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   └── routes/
│       └── v1/
│           └── index.js
├── .env
├── app.js
├── package.json
└── README.md
```





