require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const PageNotFound = require("./helper/NotFound");
const bodyParser = require("body-parser");
const path = require("path");
// const mongoConnect = require("./helper/database").mongoConnect;
const User = require("./models/user");
const mongoose = require("mongoose");
const mongo_DB_URI = process.env.MONGO_DB_URI;

const app = express();
const PORT = 3000;
// app.set("view engine", "pug");
app.set("view engine", "ejs");
app.set("views", "views");

// const rootDir = require("./helper/path");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("662d4c3646890fa376783f43")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(PageNotFound);

mongoose
  .connect(mongo_DB_URI)
  .then((result) => {
    app.listen(PORT, async () => {
      console.log("Database connected");
      await User.findOne().then(async (user) => {
        if (!user) {
          const user = new User({
            name: "David",
            email: "david@gmail.com",
            cart: {
              items: [],
            },
          });
          await user.save();
        } else {
          console.log("User Already Exist");
        }
      });
      console.log("App is running on the port http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// mongoConnect(() => {
//   app.listen(PORT, () => {
//     console.log("App is running on the port http://localhost:3000");
//   });
// });
