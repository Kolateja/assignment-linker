// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or SMTP config
    secure: true,
    auth: {
        user: 'kolateja09@gmail.com',
        pass: 'oityhvunsdvkvatr',
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;
//noreply@assignmentlinkers.com