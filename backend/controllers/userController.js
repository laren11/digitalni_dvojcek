const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Crypto = require("../models/cryptocurrencyModel");

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */

module.exports = {
  show: async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ displayName: user.displayName, id: user._id });
  },
  register: async (req, res) => {
    try {
      let { email, password, passwordCheck, displayName } = req.body;

      //validate
      if (!email || !password || !passwordCheck) {
        return res
          .status(400)
          .json({ msg: "Not all fields have been entered." });
      }
      if (password.length < 5) {
        return res.status(400).json({
          msg: "the password needs to be at lease 5 characters long.",
        });
      }
      if (password !== passwordCheck) {
        return res
          .status(400)
          .json({ msg: "Enter the same password twice for verification" });
      }

      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });
      }
      if (!displayName) {
        displayName = email;
      }

      //Encode the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      //Create new user
      const newUser = new User({
        email,
        password: passwordHash,
        displayName,
      });

      const saveUser = await newUser.save();
      res.json(saveUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      //validate login
      if (!email || !password) {
        return res
          .status(400)
          .json({ msg: "Not all fields have been entered." });
      }

      //find user and check password
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "No account with this email has been registered." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials." });
      }

      //generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      req.session.userId = user._id;
      res.json({
        token,
        user: { id: user._id, displayName: user.displayName },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //Check if token is valid
  tokenIsValid: async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) {
        return res.json(false);
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) {
        return res.json(false);
      }

      const user = await User.findById(verified.id);
      if (!user) {
        return res.json(false);
      }
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // List cryptocurrencies selected by user
  listUserCryptos: async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await User.findById(userId).populate("cryptocurrencies");
      if (!user) {
        return res.status(404).send("User not found");
      }
      const cryptocurrencies = user.cryptocurrencies;
      res.send(cryptocurrencies);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  //Add cryptocurreny to user
  addUserCrypto: async (req, res) => {
    const userId = req.params.userId;
    const cryptoId = req.body.cryptoId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      const crypto = await Crypto.findById(cryptoId);
      if (!crypto) {
        return res.status(404).send("Crypto not found");
      }
      if (user.cryptocurrencies.includes(cryptoId)) {
        return res.status(400).send("Crypto already added to user");
      }
      user.cryptocurrencies.push(cryptoId);
      await user.save();
      res.send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  //Delete cryptocurrency from user
  deleteUserCrypto: async (req, res) => {
    const userId = req.params.userId;
    const cryptoId = req.params.cryptoId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (!user.cryptocurrencies.includes(cryptoId)) {
        return res.status(400).send("Crypto not added to user");
      }
      const cryptoIndex = user.cryptocurrencies.indexOf(cryptoId);
      user.cryptocurrencies.splice(cryptoIndex, 1);
      await user.save();
      res.send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
};
