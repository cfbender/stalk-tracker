var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import dotenv from "dotenv";
import mongoose from "mongoose";
import Discord from "discord.js";
import { commands } from "./commands";
import { models } from "./models";
var Price = models.Price, Alert = models.Alert;
var TOKEN = process.env.TOKEN;
dotenv.config();
var bot = new Discord.Client();
try {
    bot.login(TOKEN);
}
catch (error) {
    console.log(error);
}
var commandChannel;
var updateChannel;
var mongodb_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(mongodb_uri, { useNewUrlParser: true });
bot.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.info("Logged in as " + ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.tag) + "!");
                if (!process.env.COMMAND_CHANNEL || !process.env.UPDATE_CHANNEL) {
                    return [2 /*return*/, console.error("Unique command and update channels not found")];
                }
                return [4 /*yield*/, bot.channels.fetch(process.env.COMMAND_CHANNEL)];
            case 1:
                commandChannel = (_b.sent());
                return [4 /*yield*/, bot.channels.fetch(process.env.UPDATE_CHANNEL)];
            case 2:
                updateChannel = (_b.sent());
                return [2 /*return*/];
        }
    });
}); });
var botCommands = new Discord.Collection();
for (var command in commands) {
    botCommands.set(commands[command].name, commands[command]);
}
bot.on("message", function (msg) {
    var _a;
    var _b = msg.content.split(/ +/), trigger = _b[0], command = _b[1], args = _b.slice(2);
    if (trigger !== "stalk!")
        return;
    if (msg.channel.id !== process.env.COMMAND_CHANNEL) {
        return msg.channel.send("Commands only work in `#" + commandChannel.name + "`");
    }
    command = command.toLowerCase();
    console.info("Called command: " + command);
    if (!botCommands.has(command))
        return;
    try {
        (_a = botCommands
            .get(command)) === null || _a === void 0 ? void 0 : _a.execute({ msg: msg, args: args, updateChannel: updateChannel, Price: Price, Alert: Alert, bot: bot });
    }
    catch (error) {
        console.error(error);
        msg.reply("There was an error trying to execute that command!");
    }
});
