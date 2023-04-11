const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const workbook = XLSX.readFile("EmailSamples.xlsx");
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const recipients = XLSX.utils.sheet_to_json(worksheet);
const ulesModel = require("./model");
const newContact = [];

async function generateHTML() {
  const token = await generateUniqueNumber();
  return `<p>You are officially invited to the ULES Final Year Week 2023. This email stands as your official invitation.</p>
  <p>Date: xxxxx</p>
  <p>Time: xxxxx</p> 
  <p>Venue: xxxxx</p>

  <p>Your entry code is ${token}</p>
  <p>This will be needed to gain access to the event on arrival</p>

  <p>We look forward to seeing you.</p>
  <img src="cid:flyer" alt="ULES Flyer" width="300" height="200" />
`;
}

async function SendEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: "465",
    secure: true,
    auth: { user: "emezued@gmail.com", pass: "ekrppexdqcpexrji" },
  });

  recipients.forEach((recipient) => {
    newContact.push(recipient.email);
  });

  newContact.forEach(async function (newContact) {
    let mailOptions = {
      from: "ULES <emezued@gmail.com>",
      to: newContact,
      subject: "Final Year Week Invitation",
      html: await generateHTML(),
      attachments: [
        {
          filename: "ULESflyer.jpeg",
          path: "/Users/apple/Downloads/ULESflyer.jpeg",
          cid: "flyer",
        },
      ],
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(`Error sending email to ${newContact}: ${error}`);
      } else {
        console.log(`Email sent to ${newContact}: ${info.response}`);
      }

      console.log("Message Sent");
    });
  });
}

async function generateUniqueNumber() {
  const uniqueNumber = Math.floor(Math.random() * 900000) + 100000; // Generate a random 6-digit number
  const token = await ulesModel.findOne({ PIN: uniqueNumber });

  if (!token) {
    const newToken = await ulesModel.create({ PIN: uniqueNumber });
    return uniqueNumber;
  }
  //return uniqueNumber;
}

module.exports = SendEmail;
//module.exports = generateUniqueNumber;
