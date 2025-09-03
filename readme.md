# Goal Tracker Pro

A full-stack web application for setting, tracking, and achieving personal goals with real-time progress analytics and email notifications.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Goal Management**: Create weekly and monthly goals with customizable targets
- **Progress Tracking**: Mark daily progress and build streaks
- **Visual Analytics**: Interactive charts showing progress over time
- **Email Notifications**: Welcome emails sent upon registration
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Updates**: Instant progress updates without page refreshes

## Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5 for responsive UI
- Chart.js for data visualization
- Font Awesome icons

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email functionality

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/goal-tracker-pro.git
   cd goal-tracker-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/goaltracker
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   PORT=3000
   ```

4. **Initialize the database**
   ```bash
   node seed_script.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

### Getting Started
1. Register for a new account or login with existing credentials
2. Navigate to the dashboard to view your goal statistics
3. Click "Add New Goal" to create your first goal

### Creating Goals
- Choose between weekly or monthly goals
- Set your target number of days
- Add a description to track what you're working on
- Set an end date for your goal

### Tracking Progress
- Click on any goal to view detailed analytics
- Use "Mark Today's Progress" to log daily achievements
- Watch your streak grow as you maintain consistency
- View progress charts to analyze your patterns

## API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - User login
- `GET /api/health` - Health check

### Goals
- `GET /api/goals` - Fetch user's goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal/mark progress
- `DELETE /api/goals/:id` - Delete goal

### Analytics
- `GET /api/stats` - Get user statistics
- `GET /api/streak/:id` - Get goal progress data for charts

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Goal Model
```javascript
{
  title: String,
  description: String,
  type: ['weekly', 'monthly'],
  targetDays: Number,
  completedDays: Number,
  status: ['active', 'completed'],
  streak: Number,
  endDate: Date,
  userId: ObjectId,
  progressHistory: [{ date: Date, completed: Boolean }],
  createdAt: Date
}
```

## Email Configuration

The app uses Gmail SMTP for sending welcome emails. To set this up:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for the application
3. Use your Gmail address and app password in the `.env` file

## Development

### Project Structure
```
goal-tracker-pro/
├── server.js           # Main server file
├── seed_script.js      # Database initialization
├── public/
│   └── index.html     # Frontend application
├── package.json
└── README.md
```

### Running in Development
```bash
# Start with nodemon for auto-restart
npm install -g nodemon
nodemon server.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Environment Variables for Production
Make sure to set these environment variables in your hosting platform:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `PORT` - Port number (usually set by hosting provider)

### MongoDB Atlas Setup
For production, consider using MongoDB Atlas:
1. Create a cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get your connection string
3. Replace localhost URI in your environment variables

## Known Issues

- Email sending requires Gmail-specific configuration
- MongoDB connection string in `seed_script.js` has a typo (port 7017 instead of 27017)
- Charts may not display properly on very small screens

## Future Enhancements

- Goal categories and tags
- Social features and goal sharing
- Mobile app development
- Integration with fitness trackers
- Reminder notifications
- Goal templates and recommendations

## License

This project is open source and available under the [MIT License](LICENSE).

