const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getOrders,
  deleteOrder,
  updateOrderStatus,createOrder
} = require("../controllers/orderController");

// Any authenticated user

router.get("/", getOrders);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);
router.post("/",createOrder);

module.exports = router;

