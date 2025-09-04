import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  color: { type: String, default: "red" },
  font: { type: String, default: "baravu" },
  format: { type: String, default: "png" },
  count: { type: Number, default: 0 },
});

export interface User {
  userid: number;
  color?: string;
  font?: string;
  format?: string;
  count?: number;
}

const users = mongoose.model<User>("user", userSchema);

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connected to db.");
  } catch (error) {
    console.error(error);
  }
}

export async function dbupdate(userid: number, update: Record<any, any>) {

  await dbcreate(userid);

  try {
    const result = await users.findOneAndUpdate(
      { userid },
      { userid, ...update },
      { upsert: true, new: true }
    );
    return result && JSON.parse(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function dbget(): Promise<User[]>;
export async function dbget(userid: number): Promise<User | null>;
export async function dbget(userid?: number) {
  try {
    if (!userid) {
      const allUsers = await users.find({});
      return allUsers.map((e) => JSON.parse(JSON.stringify(e))) as User[];
    }
    const result = await users.findOne({ userid });
    return result && JSON.parse(JSON.stringify(result)) as User;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function dbcreate(userid: number) {
  try {
    await users.updateOne({ userid }, { userid }, { upsert: true });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function dbdelete(userid: number) {
  try {
    await users.deleteOne({ userid });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function incrementCount(userid: number) {
  try {
    return await users.findOneAndUpdate({ userid }, { $inc: { count: 1 } });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getTotalCount(){
  try{
    return (await users.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$count" }
        }
      }
    ]))[0]?.total || 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
