"use strict";
const nodemailer = require("nodemailer");
console.log("dddddd");
const emailSend = (to, subject, text) => {
  console.log("ggggggggggggggggggggggggggggggggg");
  const transporter = nodemailer.createTransport({
    service: "gmail",
  

    auth: {
      user: "harish18email@gmail.com",
      pass: "vtty hwbb zkvn ggmp",
    },
 
  });

  const info = {
    from: "v.harishkumarshkd@gmail.com",
    to: to,
    subject: subject,
    text: `your password is: ${text}`,
  };

  transporter.sendMail(info, (error, info) => {
    if (error) {
      console.error("error", error);
    } else {
      console.log("message Sent successfully");
    }
  });
};

module.exports = { emailSend };
