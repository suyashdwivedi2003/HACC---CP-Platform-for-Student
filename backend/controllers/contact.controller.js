import User from "../models/user.model.js";
import nodemailer from "nodemailer"
export const contactUs = async (req, res) => {
    console.log("HOla");
    console.log('Email:', process.env.EMAIL_USER);
    console.log('Password:', process.env.EMAIL_PASS);
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,      
        pass: process.env.EMAIL_PASS  
        }
    });

    let mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_RECEIVER, 
        subject: `New contact form submission from ${name}`,
        text: `You have a new message from the contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        res.json({ message: 'Your message has been sent successfully.' });
    }catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'There was an error sending your message.' });
    }
}