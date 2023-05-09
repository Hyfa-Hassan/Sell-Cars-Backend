import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import Connection from "./database/db.js";
import Users from "./schema/reg-schema.js";
import AddCars from "./schema/add-car-schema.js"
const app = express();
dotenv.config();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use("/", Routes);

const PORT = 9002;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
Connection(username, password);

app.post("/register", async (req, res) => {
  try {
    // get data
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const password = req.body.password;
    // console.log(name);
    const createUser = new Users({
      name: name,
      email: email,
      contact: contact,
      password: password,
    });
    // console.log(createUser);
    const created = await createUser.save(); // save method creates the user or inserts the user , brfore saving password will hash
    console.log("created database");
    console.log(created);
    res.status(200).send("Registered");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email);
    const user1 = await Users.findOne({ email: email }); //find if user exists
    if (user1) {
      const isMatching = await bcrypt.compare(password, user1.password); //verify the password

      if (isMatching) {
        const token = await user1.generateToken();
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
        });
        res.status(200).send("LoggedIn");
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } else {
      console.log("bad request");
      res.status(400).send("User not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/add-car-details", async (req, res) => {
  const { title, image, desc } = req.body;
  try {
    const AddDetails = new AddCars({
      title,
      image,
      desc,
    });
    await AddDetails.save();
    res.status(201).json(AddDetails);
  } catch (error) {
    // console.log("error here is",error)
    res.status(404).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
