const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const orderAssignmentRoutes = require('./routes/orderAssignmentRoutes');
const userRoutes = require('./routes/userRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const academicDetailsRoutes = require('./routes/academicDetailsRoutes');
const raiseTicketRoutes = require('./routes/raiseTicketRoutes');
const blogRoutes = require('./routes/blogRoutes');
const consultaniciesRoutes = require('./routes/consultaniciesRoutes');
const sampleRoutes = require('./routes/sampleRoutes');
const writerFeedbackRoutes = require('./routes/writerFeedbackRoutes');
const writerDetails = require('./routes/writerDetails');
const notificationsController = require('./controllers/notificationsController');
const webPageRoutes = require('./routes/webPageRoutes');
const app = express();

// 💥 CORS setup
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({ db: sequelize }),
    cookie: { secure: false }
}));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', orderAssignmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/academic-details', academicDetailsRoutes);
app.use('/api/raise-ticket', raiseTicketRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/consultanicie', consultaniciesRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/writer-feedback', writerFeedbackRoutes);
app.use('/api/writer-details', writerDetails);

app.get(
    '/api/notifications/birthdays',
    notificationsController.getTodayBirthdays
);
app.use('/api/webPageRoutes', webPageRoutes);
sequelize.sync({ alter: false }).then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to sync DB:', err);
});
