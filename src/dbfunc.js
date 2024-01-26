const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const userDataSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  color: { type: String, default: "red" },
  font: { type: String, default: "baravu" },
  format: { type: String, default: "png" },
  count: { type: Number, default: 0 },
});

const UserData = mongoose.model("UserData", userDataSchema);

async function dbupdate(userid, key, values) {
  if (key.length !== values.length) {
    console.log("Key and values length difference error");
    return;
  }

  await dbcreate(userid);

  const updateObj = {};
  for (let i = 0; i < key.length; i++) {
    updateObj[key[i]] = values[i];
  }

  try {
    await UserData.updateOne({ userid }, { $set: updateObj });
  } catch (err) {
    console.log(err);
  }
}

async function dbget(userid) {
  try {
    const result = await UserData.findOne({ userid });
    return result || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function dbcreate(userid) {
  try {
    await UserData.updateOne(
      { userid },
      { $setOnInsert: { userid } },
      { upsert: true }
    );
  } catch (err) {
    console.log(err);
  }
}

async function dbdelete(userid) {
  try {
    await UserData.deleteOne({ userid });
  } catch (err) {
    console.log(err);
  }
}

async function incrementCount(userid) {
  try {
    await UserData.updateOne({ userid }, { $inc: { count: 1 } });
  } catch (err) {
    console.log(err);
  }
}

exports.dbcreate = dbcreate;
exports.dbupdate = dbupdate;
exports.dbdelete = dbdelete;
exports.dbget = dbget;
exports.incrementCount = incrementCount;
