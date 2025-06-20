"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementCount = exports.dbdelete = exports.dbcreate = exports.dbget = exports.dbupdate = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userid: { type: Number, unique: true },
    color: { type: String, default: "red" },
    font: { type: String, default: "baravu" },
    format: { type: String, default: "png" },
    count: { type: Number, default: 0 },
});
const users = mongoose_1.default.model("user", userSchema);
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (mongoose_1.default.connection.readyState === 1)
                throw "Already connected";
            yield mongoose_1.default.connect(process.env.MONGO_URL);
            console.log("Connected to db.");
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.connectDB = connectDB;
function dbupdate(userid, update) {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbcreate(userid);
        try {
            const result = yield users.findOneAndUpdate({ userid }, Object.assign({ userid }, update), { upsert: true, new: true });
            return result && JSON.parse(JSON.stringify(result));
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
exports.dbupdate = dbupdate;
function dbget(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!userid) {
                const allUsers = yield users.find({});
                return allUsers.map((e) => JSON.parse(JSON.stringify(e)));
            }
            const result = yield users.findOne({ userid });
            return result && JSON.parse(JSON.stringify(result));
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
exports.dbget = dbget;
function dbcreate(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield users.updateOne({ userid }, { userid }, { upsert: true });
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
exports.dbcreate = dbcreate;
function dbdelete(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield users.deleteOne({ userid });
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
exports.dbdelete = dbdelete;
function incrementCount(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield dbget(userid);
            if (!user)
                return null;
            return yield dbupdate(userid, { count: (user.count || 0) + 1 });
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
exports.incrementCount = incrementCount;
