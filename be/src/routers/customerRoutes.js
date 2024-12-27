const express = require("express");
const { createCustomer, getCustomers, editCustomer, getCustomerById } = require("../controllers/customerController");
const router = express.Router();

router.post("/create-customer", createCustomer);

router.get("/create-customer/:userId", getCustomers);

router.put("/create-customer/:id", editCustomer);
router.get("/customers/:userId", getCustomerById);


module.exports = router;
