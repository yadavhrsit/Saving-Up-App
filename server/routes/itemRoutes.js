const express = require("express");
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  markAsFavorite,
  removeFromFavorite,
  deleteItem,
} = require("../controllers/itemController");
const {
  contributeToItem,
  getContributionByItem,
} = require("../controllers/contributionController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/cloudinaryUpload"); // Change this import
const router = express.Router();

router.get("/", protect, getAllItems);
router.get("/:id", protect, getItemById);
router.post("/create", protect, upload.single("image"), createItem);
router.put("/:id/contribute", protect, contributeToItem);
router.get("/:id/contribution", protect, getContributionByItem);
router.delete("/:id/delete", protect, deleteItem);
router.put("/:id/favorite", protect, markAsFavorite);
router.put("/:id/unfavorite", protect, removeFromFavorite);

router.put("/:id/update", protect, upload.single("image"), updateItem);

module.exports = router;
