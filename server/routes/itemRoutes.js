const express = require("express");
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  contributeToItem,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const router = express.Router();

router.get("/", protect, getAllItems);
router.get("/:id", protect, getItemById);
router.post("/create", protect, upload.single("image"), createItem);
router.put("/:id/update", protect, updateItem);
router.put("/:id/contribute", protect, contributeToItem);
router.delete("/:id/delete", protect, deleteItem);

module.exports = router;
