import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "please_change_this_secret";
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getAuthPayload(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    const err = new Error("Missing bearer token.");
    err.status = 401;
    throw err;
  }

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    err.status = 401;
    throw err;
  }
}

export function sendJson(res, status, data) {
  res.status(status).json(data);
}
