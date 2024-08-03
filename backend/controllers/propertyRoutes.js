const express = require("express");
const router = express.Router();

const Property = require("../models/property");

// Create Property
router.post("/property", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get All Properties
router.get("/property", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/property/:property_id", async (req,res) => {
  const { property_id } = req.params;
  try {
    let property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    return res.json({success: true, property: property});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Property
router.delete("/property/:property_id", async (req, res) => {
  const { property_id } = req.params;
  try {
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    await Property.findByIdAndDelete(property_id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Property
router.put("/property/:property_id", async (req, res) => {
  const { property_id } = req.params;
  try {
    let property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    property = await Property.findByIdAndUpdate(property_id, req.body, { new: true });
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
