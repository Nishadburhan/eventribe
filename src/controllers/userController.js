const express = require("express");
const userController = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Config = require("../config/config");
const { validateSignup, validateLogin } = require("../helpers/validateUser");

userController.post("/signup", (req, res) => {
  const { error, value } = validateSignup.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = new User({
      name: value.name,
      email: value.email,
      password: bcrypt.hashSync(value.password, 8),
    });

    user
      .save()
      .then((user) => {
        res.status(201).json({ message: "User successfully registered!" });
      })
      .catch((err) => {
        console.error("Error while saving the user", err);
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    console.error("Error while user signup", error);
    res.status(500).json({ message: error.message });
  }
});

userController.post("/login", (req, res) => {
  const { error, value } = validateLogin.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = value;

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ id: user._id }, Config.JWT_SECRET, {
          expiresIn: 86000,
        });

        return res.status(200).send({
            token: token,
            user: {
              id: user.id,
            },
            message: "User logged in successfully",
        });

      })
      .catch((error) => {
        console.error("Error while fetching the user", error);
        res.status(500).json({ message: error.message });
      });
  } catch (error) {
    console.error("Error while user login", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = userController;
