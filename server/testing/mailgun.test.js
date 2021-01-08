require("dotenv").config();
const Mailgun = require("mailgun-js");

MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

console.log({ MAILGUN_API_KEY, MAILGUN_DOMAIN });
const mailgun = new Mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});

const data = {
  from:
    "CS Team <cs.chatapp@sandboxcca3a2948c59488d8438a0a3edc0f898.mailgun.org>",
  to: "minhdh@coderschool.vn",
  subject: "Welcome to CS Chat App",
  html: "<h4>Thank you for your registration</h4>",
};

mailgun.messages().send(data, function (err, body) {
  if (err) {
    console.log("MAILGUN ERROR", err);
  } else {
    console.log(body);
  }
});

// require("dotenv").config();
// const mailgun = require("mailgun-js");
// const DOMAIN = process.env.MAILGUN_DOMAIN;
// const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
// const data = {
//   from: "Excited User <me@samples.mailgun.org>",
//   to: "minhdh@coderschool.vn",
//   subject: "Hello",
//   text: "Testing some Mailgun awesomness!",
// };
// mg.messages().send(data, function (error, body) {
//   if (error) console.log(error);
//   console.log(body);
// });
