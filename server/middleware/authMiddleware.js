const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
      return res.status(401).json({ message: "No token provided" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log("✅ Decoded Token:", decoded); // Debugging log

      // Ensure `req.user` contains the correct structure
      req.user = {
          id: decoded.id, 
          name: decoded.name,
          email: decoded.email
      };

      next();
  } catch (error) {
      return res.status(403).json({ message: "Invalid token or token expired" });
  }
};

module.exports = { verifyToken };
