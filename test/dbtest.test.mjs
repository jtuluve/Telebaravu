import { expect } from "chai";
import { describe, beforeEach, it } from "node:test";
import {
  dbcreate,
  dbupdate,
  dbdelete,
  dbget,
  incrementCount,
  connectDB,
} from "../src/dbfunc.js";
import dotenv from "dotenv";
dotenv.config();

console.log("started");
describe("Database Functions", () => {
  beforeEach(async () => {
    await connectDB();
  });

  it("should create a user", async () => {
    const userId = 123456789;
    await dbcreate(userId);
    const user = await dbget(userId);
    expect(user).to.exist;
    expect(user.userid).to.equal(userId);
  });

  it("should update a user", async () => {
    const userId = 123456789;
    await dbcreate(userId);
    const newColor = "blue";
    await dbupdate(userId, { color: newColor });
    const user = await dbget(userId);
    expect(user).to.exist;
    expect(user.color).to.equal(newColor);
  });

  it("should delete a user", async () => {
    const userId = 123456789;
    await dbcreate(userId);
    await dbdelete(userId);
    const user = await dbget(userId);
    expect(user).to.not.exist;
  });

  it("should get a user", async () => {
    const userId = 123456789;
    await dbcreate(userId);
    let receivedUser = await dbget(userId);
    expect(receivedUser).to.exist;
    expect(receivedUser.userid).to.equal(userId);
  });

  it("should increment count for a user", async () => {
    const userId = 123456789;
    await dbcreate(userId);
    await incrementCount(userId);
    const user = await dbget(userId);
    expect(user).to.exist;
    expect(user.count).to.equal(1);
  });
});
