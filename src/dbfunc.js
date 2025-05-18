const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  color: { type: String, default: "red" },
  font: { type: String, default: "baravu" },
  format: { type: String, default: "png" },
  count: { type: Number, default: 0 },
});

const users = mongoose.model("user", userSchema);
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) throw "Already connected";
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to db.");
  } catch (error) {
    console.error(error);
  }
}

async function dbupdate(userid, keys, values) {
  if (keys.length !== values.length) {
    console.error("Key and values length difference error");
    return;
  }

  await dbcreate(userid);

  try {
    let updateObj = {};
    for (let i = 0; i < keys.length; i++) {
      updateObj[keys[i]] = values[i];
    }
    await users.findOneAndUpdate(
      { userid },
      { userid, ...updateObj },
      { upsert: true }
    );
  } catch (err) {
    console.error(err);
  }
}

/**
 *
 * @param {Number|string} userid
 * @param {(row)=>Promise<any>} func
 * @returns
 */
async function dbget(userid, func) {
  let result;
  try {
    if (!userid) {
      let allUsers = (await users.find({})).map((e) => e._doc);
      return allUsers;
    }
    result = await users.findOne({ userid });
  } catch (err) {
    return null;
  }
  await func(result?._doc);
}

async function dbcreate(userid) {
  try {
    await users.updateOne({ userid }, { userid }, { upsert: true });
  } catch (err) {
    console.error(err);
  }
}

async function dbdelete(userid) {
  try {
    await users.deleteOne({ userid });
  } catch (err) {
    console.error(err);
  }
}

async function incrementCount(userid) {
  try {
    await dbget(userid, async (user) => {
      await dbupdate(userid, ["count"], [user.count + 1]);
    });
  } catch (err) {
    console.error(err);
  }
}

exports.dbcreate = dbcreate;
exports.dbupdate = dbupdate;
exports.dbdelete = dbdelete;
exports.dbget = dbget;
exports.incrementCount = incrementCount;
exports.connectDB = connectDB;
