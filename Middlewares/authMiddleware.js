const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers["authorization"]) {
      return res.status(401).send({
        message: "Authorization header is missing",
        success: false,
      });
    }
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {//if token is decrypted we will get decoded-->userid
      if (err) {
        return res.status(401).send({
          message: "Authentication failed",
          success: false,
        });
      } else {
        req.body.userId = decoded.id;
        next()//if user id matches go to next func
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Failed to authorize {jwt auth middleware}",
      success: false,
    });
  }
};
module.exports = authMiddleware;
