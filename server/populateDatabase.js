const mongoose = require("mongoose");
const User = require("./models/user");
const Item = require("./models/Item");
const Contribution = require("./models/contribution");

const populateDatabase = async () => {
  await mongoose.connect(
    "mongodb+srv://harshityadav:JxsV3y4V7mWl8g1I@cluster0.s9trpdc.mongodb.net/savingAPP"
  );

 

  // Create dummy users
  const user1 = new User({
    username: "John Doe",
    email: "john@example.com",
    password: "password123",
  });
  const user2 = new User({
    username: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  });

  await user1.save();
  await user2.save();

  // Create dummy items
  const item1 = new Item({
    name: "Item 1",
    image: "https://example.com/image1.jpg",
    url: "https://example.com/item1",
    user: user1._id,
    targetAmount: 100,
    numberOfPayments: 5,
    contributionFrequency: "weekly",
    contributionDay: "Tuesday",
    startDate: new Date(),
  });

  const item2 = new Item({
    name: "Item 2",
    image: "https://example.com/image2.jpg",
    url: "https://example.com/item2",
    user: user2._id,
    targetAmount: 200,
    numberOfPayments: 4,
    contributionFrequency: "monthly",
    contributionDate: "15",
    startDate: new Date(),
  });

  await item1.save();
  await item2.save();

  // Create contributions for item1
  const contribution1 = new Contribution({
    item: item1._id,
    user: user1._id,
    amount: 20,
    date: new Date(),
  });

  const contribution2 = new Contribution({
    item: item1._id,
    user: user1._id,
    amount: 30,
    date: new Date(),
  });

  await contribution1.save();
  await contribution2.save();

  // Create contributions for item2
  const contribution3 = new Contribution({
    item: item2._id,
    user: user2._id,
    amount: 50,
    date: new Date(),
  });

  const contribution4 = new Contribution({
    item: item2._id,
    user: user2._id,
    amount: 40,
    date: new Date(),
  });

  await contribution3.save();
  await contribution4.save();

  console.log("Database populated with dummy data");
  mongoose.connection.close();
};

populateDatabase().catch((error) => {
  console.error("Error populating database:", error);
  mongoose.connection.close();
});
