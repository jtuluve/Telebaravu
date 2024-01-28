const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  color: { type: String, default: "red" },
  font: { type: String, default: "baravu" },
  format: { type: String, default: "png" },
  count: { type: Number, default: 0 },
});

const users = mongoose.model("user", userSchema);
async function connectDB(){
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to db.")
  } catch (error) {
    console.error(error)
  }
  
}

async function dbupdate(userid, keys, values) {
  if (keys.length !== values.length) {
    console.log("Key and values length difference error");
    return;
  }

  await dbcreate(userid);

  const updateObj = {};
  for (let i = 0; i < keys.length; i++) {
    updateObj[keys[i]] = values[i];
  }

  try {
    await users.updateOne({ userid }, updateObj, {upsert:true});
  } catch (err) {
    console.log(err);
  }
}

/**
 * 
 * @param {Number|string} userid 
 * @param {(row)=>Promise<any>} func 
 * @returns 
 */
async function dbget(userid, func) {
  try {
    const result = await users.findOne({ userid });
    console.log("doc:",result._doc);
    await func(result?._doc);
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function dbcreate(userid) {
  try {
    await users.updateOne({ userid }, { userid }, {upsert:true});
  } catch (err) {
    console.log(err);
  }
}

async function dbdelete(userid) {
  try {
    await users.deleteOne({ userid });
  } catch (err) {
    console.log(err);
  }
}

async function incrementCount(userid) {
  try {
    await users.updateOne({ userid }, updateObj, {upsert:true});
  } catch (err) {
    console.log(err);
  }
}

exports.dbcreate = dbcreate;
exports.dbupdate = dbupdate;
exports.dbdelete = dbdelete;
exports.dbget = dbget;
exports.incrementCount = incrementCount;
exports.connectDB = connectDB;