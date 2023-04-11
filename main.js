const express = require("express");
const SendEmail = require("./app");
const mongoose = require("mongoose");
const ulesModel = require("./model");
const app = express();
const router = express.Router();
const PORT = 3000;
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGODBURI;

app.use(express.json());
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(console.log("DB connected"));

router.get("/sendMail", (req, res) => {
  SendEmail().catch((e) => console.log(e));
  res.send("The messages have been sent");
});

router.post("/checkCode", async (req, res) => {
  const { code } = req.body;
  const token = await ulesModel.findOne({ PIN: code });
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "You provided a wrong entrance code" });
  }
  if (token.isUsed) {
    return res
      .status(400)
      .json({ success: false, message: "This token has been used already" });
  }
  token.isUsed = true;
  await token.save();

  return res
    .status(200)
    .json({ status: true, message: "Your code is accepted." });
});

app.use("/", router);

// client.on("connected", () => {
//   console.info("db connected");
// });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
