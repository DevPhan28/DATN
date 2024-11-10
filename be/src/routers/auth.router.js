const express = require("express");
const {
  signin,
  signup,
  requestResetPassword,
  processResetPassword,
  upda,
  updatePassword,
  getAllUsers,
} = require("../controllers/auth");
const router = express.Router();
router.post(`/signup`, signup);
router.post(`/signin`, signin);
router.post("/request-reset-password", requestResetPassword);
router.post("/check-valid-code", processResetPassword);
router.post("/update-new-password", updatePassword);
router.get('/users', getAllUsers);


module.exports = router;
