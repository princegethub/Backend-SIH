const jwt = require('jsonwebtoken');
const Grampanchayat = require('../models/Grampanchayat');
const User = require('../models/User');

const authenticateGrampanchayat = async (req, res, next) => {
  const token = req.header('x-auth-token');  // Look for the token in the request header

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the Grampanchayat from the decoded token data
    const grampanchayat = await Grampanchayat.findById(decoded._id);
    if (!grampanchayat) {
      return res.status(404).json({ success: false, message: 'Grampanchayat not found' });
    }

    // Add the Grampanchayat to the request object for use in other routes
    req.grampanchayat = grampanchayat;
    next();  // Allow the request to continue to the next route handler
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};
const authenticateUser = async (req, res, next) => {
  const token = req.header('x-auth-token'); // Look for the token in the request header

  if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the User from the decoded token data
      const user = await User.findById(decoded._id);
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Add the user to the request object for use in other routes
      req.user = user;
      next(); // Continue to the next middleware or route handler
  } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};
const authenticatePhed = async (req, res, next) => {
  const token = req.header('x-auth-token');  // Get the token from the request header

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the Phed user based on the decoded phed_id
    const phed = await Phed.findOne({ phed_id: decoded.phed_id });
    if (!phed) {
      return res.status(404).json({ success: false, message: 'Phed user not found.' });
    }

    // Add the Phed to the request object
    req.phed = phed;
    next();  // Continue to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid or expired token.' });
  }
};
module.exports = {authenticateGrampanchayat,authenticateUser,authenticatePhed};
