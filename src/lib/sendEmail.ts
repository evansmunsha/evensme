import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export const sendNewsletter = async (subscribers: { email: string; }[], content: string, subject: any) => {
  const emailPromises = subscribers.map((subscriber) => {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: subscriber.email,
      subject: 'Your Newsletter Subject',
      text: content,
    });
  });

  await Promise.all(emailPromises);
};
