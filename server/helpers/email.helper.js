const mongoose = require("mongoose");
const Template = require("../models/Template");
const Mailgun = require("mailgun-js");
const mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const emailHelper = {};

const template = {
  name: "Welcome Email",
  description: "Send a welcome email to new user",
  template_key: "welcome_email",
  from:
    "CS Team <cs_chat_app@sandboxcca3a2948c59488d8438a0a3edc0f898.mailgun.org>",
  subject: "Hi %name%, welcome",
  html: `Hi %name%,
  
    Welcome to Coderschool
    `,
  variables: ["name"],
};

emailHelper.createTemplateIfNotExists = async () => {
  try {
    let temp = await Template.findOne({ template_key: template.template_key });
    if (!temp) {
      await Template.create(template);
      console.log(`CREATED ${template.template_key} email template`);
    } else {
      console.log(`EMAIL TEMPLATE EXISTS ${template.template_key}`);
    }
  } catch (error) {
    console.log(error);
  }
};

emailHelper.renderEmailTemplate = async (
  template_key,
  variablesObj,
  toEmail
) => {
  const template = await Template.findOne({ template_key });
  if (!template) return { error: "Invalid Template Key" };
  const data = {
    from: template.from,
    to: toEmail,
    subject: template.subject,
    html: template.html,
  };
  // exp: variablesObj = {name: "Minh"}
  for (let index = 0; index < template.variables.length; index++) {
    let key = template.variables[index];
    if (!variablesObj[key])
      return { error: "Invalid variable key of email template" };
    let re = new RegExp(`%${key}%`, "g");
    data.html = data.html.replace(re, variablesObj[key]);
    data.subject = data.subject.replace(re, variablesObj[key]);
  }
  return data;
};

emailHelper.send = (data) => {
  mailgun.messages().send(data, function (err, info) {
    if (err) console.log(err);
    console.log(info);
  });
};

module.exports = emailHelper;
