const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");


usersRouter.post("/newuser", async (request, response) => {

  const { phone, firstName, lastName, email, password, role, image } =
    request.body;

  if (!password) {
    return response.status(400).json({ error: "Password is required" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    phoneNumber: phone,
    firstName,
    lastName,
    email,
    password: passwordHash,
    role,
    image,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    response.status(400).json({ error: "Error saving user", details: error.message });
  }
  

});

usersRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { phoneNumber, firstName, lastName, email, password, image } =
    request.body;

  const updateUser = {};

  if (phoneNumber) updateUser.phoneNumber = phoneNumber;
  if (firstName) updateUser.firstName = firstName;
  if (lastName) updateUser.lastName = lastName;
  if (email) updateUser.email = email;
  if (image) updateUser.image = image;

  if (password) {
    const saltRounds = 10;
    updateUser.password = await bcrypt.hash(password, saltRounds);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateUser, {
      new: true,
    });
    if (updatedUser) {
      response.json(updatedUser);
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    response.status(400).json({ error: "Invalid user ID" });
  }
});

usersRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    response.status(400).json({ error: "Invalid user ID" });
  }
});

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    response.status(400).json({ error: "Error fetching users" });
  }
});

module.exports = usersRouter;
