const express = require("express");
const router = express.Router();

const Property = require("../models/property");

// Create Property
router.post("/property", async (req, res) => {
  try {
    let purpose = req.body.purpose;

    if(purpose == "Rent/Lease"){
      purpose = "Rent";
    };

    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      price: req.body.price,
      area: req.body.area,
      type: req.body.propertyType,
      purpose: purpose,
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
  const query = String(req.query.query);
  try {
    const searchQuery = {
      $and: [
        { verification: "verified" }, // Ensure property is verified
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
            { type: { $regex: query, $options: "i" } },
          ],
        },
      ],
    };

    const bhkQuery = parseInt(query, 10);
    if (!isNaN(bhkQuery)) {
      searchQuery.$and.push({ Bhk: bhkQuery });
    }

    const properties = await Property.find(searchQuery);
    res.json(properties);
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

router.put('/property/:id/accept', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.verification = 'verified';
    await property.save();

    res.json({ success: true, message: 'Property accepted and verified' });
  } catch (error) {
    console.error('Error accepting property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to reject a property (delete from database)
router.put('/property/:id/reject', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await Property.findByIdAndDelete(propertyId);

    res.json({ success: true, message: 'Property rejected and deleted' });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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