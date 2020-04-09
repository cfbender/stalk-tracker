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
import moment from "moment-timezone";
import Discord from "discord.js";
import sortBy from "lodash.sortby";
var execute = function (_a) {
    var msg = _a.msg, Price = _a.Price;
    return __awaiter(void 0, void 0, void 0, function () {
        var allPrices, nookPrices, highestNookPrice, lowestNookPrice, daisyPrices, highestDaisyPrice, lowestDaisyPrice, embed, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Price.find({}).exec()];
                case 1:
                    allPrices = _b.sent();
                    nookPrices = sortBy(allPrices.filter(function (_a) {
                        var npc = _a.npc;
                        return npc === "Nook";
                    }), ["price"]);
                    highestNookPrice = nookPrices.slice(-1).pop() || nookPrices[0];
                    lowestNookPrice = nookPrices[0];
                    daisyPrices = sortBy(allPrices.filter(function (_a) {
                        var npc = _a.npc;
                        return npc === "Daisy";
                    }), ["price"]);
                    highestDaisyPrice = daisyPrices.slice(-1).pop() || daisyPrices[0];
                    lowestDaisyPrice = daisyPrices[0];
                    embed = new Discord.MessageEmbed()
                        .setTitle("All Time Turnip Stats")
                        .setColor(0x00ae86)
                        .setThumbnail("https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427")
                        .setTimestamp()
                        .addField("**Highest Nook Price Ever**", nookPrices.length > 0
                        ? highestNookPrice.price + " on " + moment(lowestNookPrice.date).format("MM/D/YYYY") + " from " + highestNookPrice.user
                        : "No Nook prices recorded yet!")
                        .addField("**Lowest Nook Price Ever**", nookPrices.length > 0
                        ? lowestNookPrice.price + " on " + moment(lowestNookPrice.date).format("MM/D/YYYY") + " from " + lowestNookPrice.user
                        : "No Nook prices recorded yet!")
                        .addField("**Highest Daisy Price Ever**", daisyPrices.length > 0
                        ? highestDaisyPrice.price + " on " + moment(highestDaisyPrice.date).format("MM/D/YYYY") + " from " + highestDaisyPrice.user
                        : "No Daisy prices recorded yet!")
                        .addField("**Lowest Daisy Price Ever**", daisyPrices.length > 0
                        ? lowestDaisyPrice.price + " on " + moment(lowestDaisyPrice.date).format("MM/D/YYYY") + " from " + lowestDaisyPrice.user
                        : "No Daisy prices recorded yet!");
                    msg.channel.send(embed);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
export default {
    name: "stats",
    description: "Shows all-time stats for stalk tracker",
    execute: execute,
};
