const nodemailer = require("nodemailer");
const XLSX = require("xlsx");
const workbook = XLSX.readFile("EmailSamples.xlsx");
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const recipients = XLSX.utils.sheet_to_json(worksheet);
const newContact = [];
const html = `<p>You are officially invited to the ULES Final Year Week 2023. This email stands as your official invitation.</p>
      <p>Date: xxxxx</p>
      <p>Time: xxxxx</p> 
      <p>Venue: xxxxx</p>

      <p>Your entry code is xxxxxx.</p>
      <p>This will be needed to gain access to the event on arrival</p>

      <p>We look forward to seeing you.</p>
      <img src="cid:flyer" alt="ULES Flyer" width="300" height="200" />
    `;

async function main() {
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

  await transporter.sendMail({
    from: "Dabby <emezued@gmail.com>",
    to: newContact,
    subject: "Final Year Week Invitation",
    html: html,
    attachments: [
      {
        filename: "ULESflyer.jpeg",
        path: "'/Users/apple/Downloads/ULESflyer.jpeg'",
        cid: "flyer",
      },
    ],
  });
  console.log("Message Sent");
}

main().catch((e) => console.log(e));
