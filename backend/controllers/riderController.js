const db = require("../models");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const Rider = db.Rider;
const Order = db.Order;
const Deadline = db.Deadline;

exports.loginRider = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  //check if its email or phone
  let condition = {};
  if (emailOrPhone.includes("@")) {
    condition.email = emailOrPhone;
  } else {
    condition.phone = emailOrPhone;
  }

  try {
    const rider = await Rider.findOne({ where: condition });
    if (!rider) {
      return res
        .status(404)
        .json({ success: false, message: "Rider not found" });
    }

    const isMatch = await bcrypt.compare(password, rider.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Successful login
    req.session.rider = {
      id: rider.id,
      name: rider.name,
      phone: rider.phone,
    };
    console.log("Rider logged in:", req.session.rider);
    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.logoutRider = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  });
};

exports.checkRiderSession = (req, res) => {
  if (req.session.rider) {
    return res.status(200).json({
      success: true,
      rider: req.session.rider,
      isAuthenticated: true,
      message: "Rider session is active",
    });
  } else {
    return res.status(200).json({
      success: false,
      isAuthenticated: false,
      message: "Rider session is not active",
    });
  }
};

exports.fetchAssignments = async (req, res) => {
  try {
    const assignments = await Order.findAll({
      where: {
        assigned_rider_id: req.body.id,
      },
      include: [
        {
          model: Deadline,
          as: 'deadlines',
          // attributes: ['id'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

