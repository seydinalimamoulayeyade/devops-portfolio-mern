// backend/src/controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  res.status(403).json({
    message: "Inscription publique desactivee. Utilisez le script seed:admin.",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur invalide" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe invalide" });

    const role = user.role || "user";
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        email: user.email,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
