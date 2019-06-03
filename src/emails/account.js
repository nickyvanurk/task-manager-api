const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: {
      email: 'info@nickyvanurk.com',
      name: 'Nicky van Urk'
    },
    subject: 'Thanks for signing up!',
    text: `${name}! Welcome to the app. Let me know how you get along with the app.`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: {
      email: 'info@nickyvanurk.com',
      name: 'Nicky van Urk'
    },
    subject: 'Sorry to see you!',
    text: `I'm sorry to see you go, ${name}. Let me know if I could have done anything better.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};