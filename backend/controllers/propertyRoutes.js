const express = require("express");
const router = express.Router();

const Property = require("../models/property");

// Create Property
router.post("/property", async (req, res) => {
  try {

    console.log(req.body);
    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      price: req.body.price,
      area: req.body.area,
      type: req.body.propertyType,
      purpose: req.body.purpose,
      status: req.body.status,
      amenities: req.body.amenities,
      landmark: req.body.landmark,
      Bhk: req.body.numberOfBedrooms,
      bathrooms: req.body.numberOfBathrooms,
      balconies: req.body.numberOfBalconies,
      area: req.body.areaDetails,
      floors: req.body.totalFloorDetails,
      availability_status: req.body.availability,
      Propreiter_name: req.body.proprietorName,
      Propreiter_email: req.body.proprietorEmail,
      Propreiter_contact: req.body.proprietorPhone
    });
    
    
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Properties
router.get("/allproperty", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/property", async (req, res) => {
  const { query } = req.query;
  try {
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
      ],
    };

    const bhkQuery = parseInt(query, 10);
    if (!isNaN(bhkQuery)) {
      searchQuery.$or.push({ Bhk: bhkQuery });
    }

    const properties = await Property.find(searchQuery);
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Email Verification
router.get("/property-user/:email_id", async (req, res) => {
  try {
    const { email_id } = req.params;
    
    const Property_my = await Property.find({ Propreiter_email: email_id });
    res.json({ success: true, data: Property_my });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// For Admin purpose
router.get("/property/verification", async (req, res) => {
  try {
    const property_verify = await Property.find({ verification: "pending" });
    res.json(property_verify);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/property/:property_id", async (req, res) => {
  const { property_id } = req.params;

  try {
    let property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    return res.json({ success: true, property: property });
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
    property = await Property.findByIdAndUpdate(property_id, req.body, {
      new: true,
    });
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
