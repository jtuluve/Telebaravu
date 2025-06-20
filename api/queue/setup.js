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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectAgenda = exports.queue = void 0;
const agenda_1 = require("agenda");
const grammy_1 = require("grammy");
const transcript_1 = require("../transcript");
const dbfunc_1 = require("../dbfunc");
require("dotenv").config();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
exports.queue = new agenda_1.Agenda({
    db: {
        address: process.env.MONGO_URL,
    },
});
const connectAgenda = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.queue.define("image", imageProcess);
    console.log("Connected to agenda");
    yield exports.queue.start();
});
exports.connectAgenda = connectAgenda;
function fetchImage(txt, font, color) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch(`${process.env.PNG_API}/image?text=${txt}&font=${font}&color=${color}`);
    });
}
function imageProcess(job) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Running job");
            if (job.attrs.data.retries) {
                console.log("This is retry number:", job.attrs.data.retries);
            }
            const ctx = (_b = (_a = job.attrs) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.ctx;
            let msg = (_d = (_c = job.attrs) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.msg;
            if (!ctx || !msg)
                return;
            const row = yield (0, dbfunc_1.dbget)(ctx.message.from.id);
            let txt = ctx.message.text;
            txt = (0, transcript_1.transcript)(txt);
            txt = encodeURIComponent(txt);
            let color = row ? row.color : "red";
            let font = row ? row.font : "baravu";
            let response = yield fetchImage(txt, font, color);
            response = yield response.json();
            yield bot.api.sendDocument(ctx.message.from.id, new grammy_1.InputFile(new URL(response.url), "image.png"));
            bot.api.deleteMessage(ctx.message.from.id, msg.message_id);
            (0, dbfunc_1.incrementCount)(ctx.message.from.id);
        }
        catch (e) {
            console.log(e);
            const retries = ((_e = job.attrs.data) === null || _e === void 0 ? void 0 : _e.retries) || 0;
            if (retries < 3) {
                console.log("Retrying job in 1 minute...");
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    return yield exports.queue.now("image", Object.assign(Object.assign({}, job.attrs.data), { retries: retries + 1 }));
                }), 60000);
            }
        }
    });
}
