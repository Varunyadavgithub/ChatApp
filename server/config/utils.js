import jwt from "jsonwebtoken";

// Function to generate a token of a user
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_JWT);
  return token;
};
