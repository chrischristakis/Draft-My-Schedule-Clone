const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const app = express();

//Import routes
const courseData = require('./courseData');
const authRoute = require('./routes/auth');
const subjectsRoute = require('./routes/subjects');
const schedulesRoute = require('./routes/schedules');
const reviewsRoute = require('./routes/reviews');
const adminRoute = require('./routes/admin');

dotenv.config(); //for .env file.

//Connect to database
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true, useUnifiedTopology: true },
() => console.log("Connected to MongoDB!"));

app.use('/', express.static('static/dist/draftmyschedule-frontend'));
// middleware
app.use(express.json());
app.use(expressSanitizer());
app.use(cors());
app.use('/api/users', authRoute); //means that in authroute, itll be /api/user/register
app.use('/api/subjects', subjectsRoute);
app.use('/api/schedules', schedulesRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/admin', adminRoute);

//---------------
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
})
