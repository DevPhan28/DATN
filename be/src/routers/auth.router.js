const express = require("express");
const {
  signin,
  signup,
  requestResetPassword,
  processResetPassword,
  upda,
  updatePassword,
} = require("../controllers/auth");
const router = express.Router();
router.post(`/signup`, signup);
router.post(`/signin`, signin);
router.post("/request-reset-password", requestResetPassword);
router.post("/check-valid-code", processResetPassword);
router.post("/update-new-password", updatePassword);

module.exports = router;
