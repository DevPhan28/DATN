const express = require("express");
const { createCustomer, getCustomers, editCustomer } = require("../controllers/customerController");
const router = express.Router();

router.post("/create-customer", createCustomer);

router.get("/create-customer", getCustomers);

router.put("/create-customer/:id", editCustomer);

module.exports = router;
