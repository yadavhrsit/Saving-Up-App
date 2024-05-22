const express = require("express");
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  markAsFavorite,
  removeFromFavorite,
  deleteItem,
  contributeToItem,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/cloudinaryUpload"); // Change this import
const router = express.Router();

router.get("/", protect, getAllItems);
router.get("/:id", protect, getItemById);
router.post("/create", protect, upload.single("image"), createItem);
router.put("/:id/contribute", protect, contributeToItem);
router.delete("/:id/delete", protect, deleteItem);
router.put("/:id/favorite", protect, markAsFavorite);
router.put("/:id/unfavorite", protect, removeFromFavorite);

router.put("/:id/update", protect, updateItem);

module.exports = router;
