import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/customer", protect, authorizeRoles("customer"), (req, res) => {
  res.json({
    message: "Customer route",
  });
});

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Admin route",
    });
  }
);

export default router;