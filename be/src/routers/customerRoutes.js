const express = require("express");
const { createCustomer, getCustomers, editCustomer, getCustomerById, deleteCustomer } = require("../controllers/customerController");
const router = express.Router();

router.post("/create-customer", createCustomer);

router.get("/create-customer/:userId", getCustomers);

router.put("/edit-customer/:id/:userId", editCustomer);
router.get("/customers/:userId", getCustomerById);
router.delete("/delete-customer/:id", deleteCustomer); 

module.exports = router;
