import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const SECRET = "medical-secret";

export const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User exists" });
  }

  const user = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role
  };

  db.users.push(user);
  res.json({ message: "Registered successfully" });
};

export const login = (req, res) => {
  const user = db.users.find(
    u => u.email === req.body.email && u.password === req.body.password
  );

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(user, SECRET, { expiresIn: "1h" });

  res.json({ token, user });
};
