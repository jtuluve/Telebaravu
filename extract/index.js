const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  color: { type: String, default: "red" },
  font: { type: String, default: "baravu" },
  format: { type: String, default: "png" },
  count: { type: Number, default: 0 },
});

const users = mongoose.model("user", userSchema);
async function dbupdate(userid, obj) {
  

  try {
    await users.findOneAndUpdate(
      { userid },
      { userid, ...obj },
      { upsert: true }
    );
  } catch (err) {
    console.error(err);
  }
}

mongoose
  .connect(
    "mongodb+srv://jtuluve:aAJQEDXbag7G0sL1@cluster0.tw0fbw0.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    const sqlite3 = require("sqlite3").verbose();
    const db = new sqlite3.Database("./userdata.db");

    db.run(
      `CREATE TABLE IF NOT EXISTS userdata(userid INTEGER UNIQUE, color STRING DEFAULT 'red', font STRING DEFAULT 'baravu', format STRING DEFAULT 'png')`,
      (err) => {
        if (err) {
          console.error(err);
          return;
        }

        db.all("SELECT * FROM userdata", async(err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          data.forEach(async (e) => {
            let { userid, ...obj } = e;
            await dbupdate(userid, obj);
          });

        });
      }
    );
  });
