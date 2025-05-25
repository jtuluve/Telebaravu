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
    const userId = 1406413268;
    await dbcreate(userId);
    let user;
    await dbget(userId, async (u) => {
      user = u;
    });
    expect(user).to.exist;
    expect(user.userid).to.equal(userId);
  });

  it("should update a user", async () => {
    const userId = 1406413268;
    await dbcreate(userId);
    const newColor = "blue";
    await dbupdate(userId, ["color"], [newColor]);
    let user;
    await dbget(userId, (u) => {
      user = u;
    });
    expect(user).to.exist;
    expect(user.color).to.equal(newColor);
  });

  it("should delete a user", async () => {
    const userId = 1406413268;
    await dbcreate(userId);
    await dbdelete(userId);
    await dbget(userId, async (user) => {
      expect(user).to.not.exist;
    });
  });

  it("should get a user", async () => {
    const userId = 1406413268;
    await dbcreate(userId);
    let receivedUser;
    await dbget(userId, async (user) => {
      receivedUser = user;
    });
    expect(receivedUser).to.exist;
    expect(receivedUser.userid).to.equal(userId);
  });

  it("should increment count for a user", async () => {
    const userId = 1406413268;
    await dbcreate(userId);
    await incrementCount(userId);
    await dbget(userId, async (user) => {
      expect(user).to.exist;
      expect(user.count).to.equal(1);
    });
  });
});
