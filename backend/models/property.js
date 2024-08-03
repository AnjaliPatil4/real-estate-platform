const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: { type: String, required: true },
  description: { type: String, required: true },

  address: { type: String, required: true },

  city: { type: String, required: true },

  price: { type: Number, required: true },

  landmark: { type: String },

  Bhk: { type: Number },
  bathrooms: { type: Number },
  balconies: { type : Number },

  other_rooms: { type: Number },
  area: { type: Number },
  //type:Residential, Commercial
  type: { type: String, required: true },

  //status:Available, Sold, Rented
  status: { type: String },

  floors: { type: String },
  availability_status: { type: String, enum: ["Ready to move", "Under construction"]},

  // Sell or Rent
  purpose: {
    type: String,
    enum: ["sell", "rent"]
  },
  phone: {
    type: String,
  },
  mail: {
    type: String,
  },

  amenities: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },

  Propreiter_name: {
    type: String,
    required: true,
  },

  Propreiter_email: {
    type: String,
    required: true,
  },

  Propreiter_contact: {
    type: String,
    required: true,
  },

  verification_details: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  }
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
