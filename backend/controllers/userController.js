const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Crypto = require("../models/cryptocurrencyModel");
const Exchange = require("../models/exchangeModel");

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
  addUserCrypto: async (req, res) => {
    const { cryptoName, exchangeName, user } = req.body;
    const userId = user.id;
    try {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the crypto ID and exchange ID pair already exists in the user's saved array
      const crypto = await Crypto.findOne({ name: cryptoName });
      const exchange = await Exchange.findOne({ name: exchangeName });
      const existingPairIndex = existingUser.saved.findIndex(
        (pair) =>
          pair.cryptoId.toString() === crypto._id.toString() &&
          pair.exchangeId.toString() === exchange._id.toString()
      );

      if (existingPairIndex !== -1) {
        // Crypto ID and exchange ID pair already exists, so remove it
        existingUser.saved.splice(existingPairIndex, 1);
      } else {
        // Crypto ID and exchange ID pair does not exist, so search and save it

        if (!crypto || !exchange) {
          return res
            .status(404)
            .json({ error: "Crypto or exchange not found" });
        }

        // Create a new cryptoPairSchema object with the obtained IDs
        const newCryptoPair = {
          cryptoId: crypto._id,
          exchangeId: exchange._id,
        };

        // Push the new cryptoPairSchema object to the user's saved array
        existingUser.saved.push(newCryptoPair);
      }

      // Save the updated user object
      await existingUser.save();

      // Return the response
      return res.json(req.body);
    } catch (error) {
      // Handle the error
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
