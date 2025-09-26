const express = require("express");
const { getUsers, addUser, deleteUser, updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
