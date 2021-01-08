const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateSchema = Schema(
  {
    name: { type: String, required: true }, // Welcome Email
    description: { type: String, required: true }, // Send a welcome email to new user
    template_key: { type: String, required: true, unique: true }, // welcome_email
    from: { type: String, required: true },
    html: { type: String, required: true },
    subject: { type: String, required: true },
    variables: [String],
  },
  { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);
module.exports = Template;

// Example:
// Template = {
//   name: "Welcome Email",
//   description: "Send a welcome email to new user",
//   template_key: "welcome_email",
//   from: "CS Team <cs_chat_app@mg.coderschool.vn>",
//   subject: "Hi %name%, welcome",
//   html: `Hi %name%,

//   Welcome to Coderschool
//   `,
//   variables: ["name"],
// };
