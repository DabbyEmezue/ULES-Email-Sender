const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const workbook = XLSX.readFile("EmailSamples.xlsx");
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const recipients = XLSX.utils.sheet_to_json(worksheet);
const ulesModel = require("./model");
const newContact = [];

async function generateHTML(name) {
  const token = await generateUniqueNumber(name);
  return `<p>Hey ${name}, </p>
  <p>This is a confirmation for your participation in the ULES Faculty Week 2023.</p>
  <div style="background-color: #87CEFA; padding: 10px; display: block; margin: 0 auto; text-align:center;font-weight: bold;">
  <p>Access code: ${token}</p></div>
<p>Given than some of these events are exclusive and we want you to have a smooth experience, this code grants you full access to all activities during the week including the Career day, Silent rave party and Owambe</p>
  <p>*Do not share this code with anybody as it would be exchanged for your tickets on the event day 
  <p>Thanks for being awesome and cooperative, see you soon!</p>
  <img src="cid:flyer" alt="ULES Flyer" width="500" height="200" style="display: block; margin: 0 auto; "/>
`;
}

async function SendEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: "465",
    secure: true,
    auth: { user: "unilagengr@gmail.com", pass: "fhulgjuukvjlutje" },
  });

  recipients.forEach((recipient) => {
    console.log(recipient);
    newContact.push(recipient.email);
  });

  recipients.forEach(async function (newContact) {
    let mailOptions = {
      from: "ULES <emezued@gmail.com>",
      to: newContact.email,
      subject: "Final Year Week Invitation",
      html: await generateHTML(newContact.names),
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

async function generateUniqueNumber(name) {
  const slicedString = name.slice(0, 3).toUpperCase();
  let randomString = "";
  for (let i = 0; i < 3; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    randomString += randomDigit.toString();
  }
  const response = `${slicedString}-${randomString}`;

  const token = await ulesModel.findOne({ PIN: response });

  if (!token) {
    const newToken = await ulesModel.create({ PIN: response });
    return response;
  }
  return response;
}

module.exports = SendEmail;
