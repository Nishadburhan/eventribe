const nodemailer = require('nodemailer');
const Config = require("./config");

const transporter = nodemailer.createTransport({
    host: Config.SMTP_SERVER,
    port: Config.SMTP_PORT,
    auth: {
        user: Config.EMAIL_USER,
        pass: Config.EMAIL_PASS
    }
});

module.exports = transporter;