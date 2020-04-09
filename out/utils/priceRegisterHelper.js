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
import statsCommand from "../commands/stats";
import todayCommand from "../commands/today";
var getPrices = function (_a) {
    var Price = _a.Price, npc = _a.npc, currentTime = _a.currentTime;
    return __awaiter(void 0, void 0, void 0, function () {
        var allPrices, npcPrices, todaysBest, records;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Price.find({}).exec()];
                case 1:
                    allPrices = _b.sent();
                    npcPrices = allPrices
                        .filter(function (price) { return price.npc === npc; })
                        .map(function (_a) {
                        var price = _a.price;
                        return price;
                    })
                        .sort(function (a, b) { return a - b; });
                    todaysBest = allPrices
                        .filter(function (_a) {
                        var date = _a.date;
                        return moment(date).format("MM/D/YYYY") === currentTime.format("MM/D/YYYY");
                    })
                        .map(function (_a) {
                        var price = _a.price;
                        return price;
                    })
                        .sort(function (a, b) { return (currentTime.day() === 0 ? a - b : b - a); })[0];
                    records = {
                        lowestEver: npcPrices[0] || 0,
                        highestEver: npcPrices.slice(-1).pop() || 0,
                    };
                    return [2 /*return*/, { todaysBest: todaysBest, records: records }];
            }
        });
    });
};
var generateMessage = function (_a) {
    var value = _a.value, todaysBest = _a.todaysBest, records = _a.records, npc = _a.npc;
    var updateAllTime = false;
    var updateToday = false;
    var message = "Price registered at " + value + ".";
    switch (npc) {
        case "Nook":
            if (value > todaysBest) {
                updateToday = true;
                message += " New highest today!";
            }
            break;
        case "Daisy":
            if (value < todaysBest) {
                updateToday = true;
                message += " New lowest today!";
            }
            break;
    }
    if (value < records.lowestEver) {
        updateAllTime = true;
        message += " New lowest " + npc + " price ever!";
    }
    if (value > records.highestEver) {
        updateAllTime = true;
        message += " New highest " + npc + " price ever!";
    }
    return { message: message, updateAllTime: updateAllTime, updateToday: updateToday };
};
var getAlerts = function (_a) {
    var Alert = _a.Alert, value = _a.value;
    return __awaiter(void 0, void 0, void 0, function () {
        var alerts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Alert.find({}).exec()];
                case 1:
                    alerts = _b.sent();
                    return [2 /*return*/, alerts
                            ? alerts.filter(function (_a) {
                                var nook = _a.nook, daisy = _a.daisy;
                                return nook ? nook <= value : daisy ? daisy >= value : false;
                            })
                            : []];
            }
        });
    });
};
export var helper = function (_a) {
    var msg = _a.msg, value = _a.value, npc = _a.npc, updateChannel = _a.updateChannel, Price = _a.Price, Alert = _a.Alert, bot = _a.bot;
    return __awaiter(void 0, void 0, void 0, function () {
        var numValue, timezone, currentTime, _b, todaysBest, records, sendUpdates, user, type, _c, message, updateAllTime, updateToday, newPrice, error_1, firedAlerts;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    numValue = parseInt(value);
                    if (!numValue || isNaN(numValue)) {
                        return [2 /*return*/, "You must give a price to register."];
                    }
                    timezone = process.env.TIMEZONE || "America/Denver";
                    currentTime = moment().tz(timezone);
                    //check for day of week
                    if (currentTime.format("dddd") === "Sunday" && npc === "Nook") {
                        return [2 /*return*/, "You can't register Nook prices on Sundays."];
                    }
                    else if (currentTime.format("dddd") !== "Sunday" && npc === "Daisy") {
                        return [2 /*return*/, "You can't register Daisy prices except on Sundays."];
                    }
                    return [4 /*yield*/, getPrices({ Price: Price, npc: npc, currentTime: currentTime })];
                case 1:
                    _b = _d.sent(), todaysBest = _b.todaysBest, records = _b.records;
                    sendUpdates = process.env.SEND_UPDATES;
                    user = msg.author.username;
                    type = npc === "Daisy"
                        ? "Daisy"
                        : currentTime.hour() < 12
                            ? "Morning"
                            : "Afternoon";
                    _c = generateMessage({
                        value: numValue,
                        todaysBest: todaysBest,
                        records: records,
                        npc: npc,
                    }), message = _c.message, updateAllTime = _c.updateAllTime, updateToday = _c.updateToday;
                    newPrice = new Price({
                        user: user,
                        npc: npc,
                        price: numValue,
                        timing: type,
                        date: currentTime.toDate(),
                    });
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, newPrice.save()];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _d.sent();
                    console.log(error_1);
                    return [3 /*break*/, 5];
                case 5:
                    if (sendUpdates) {
                        if (updateAllTime || updateToday) {
                            updateChannel.send(message);
                            if (updateAllTime) {
                                statsCommand.execute({
                                    msg: Object.assign(msg, { channel: updateChannel }),
                                    Price: Price,
                                    Alert: Alert,
                                    args: [""],
                                    updateChannel: updateChannel,
                                    bot: bot,
                                });
                            }
                            if (updateToday) {
                                msg.channel = updateChannel;
                                todayCommand.execute({
                                    msg: Object.assign(msg, { channel: updateChannel }),
                                    Price: Price,
                                    Alert: Alert,
                                    args: [""],
                                    updateChannel: updateChannel,
                                    bot: bot,
                                });
                            }
                        }
                    }
                    return [4 /*yield*/, getAlerts({ Alert: Alert, value: numValue })];
                case 6:
                    firedAlerts = _d.sent();
                    firedAlerts.forEach(function (alert) { return __awaiter(void 0, void 0, void 0, function () {
                        var user, dmChannel;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, bot.users.fetch(alert.user)];
                                case 1:
                                    user = _a.sent();
                                    return [4 /*yield*/, user.createDM()];
                                case 2:
                                    dmChannel = _a.sent();
                                    return [4 /*yield*/, dmChannel.send("Your threshold of of " + alert.toObject()[npc.toLowerCase()] + " for " + npc + " has been hit! Current price is " + numValue + ".")];
                                case 3:
                                    _a.sent();
                                    todayCommand.execute({
                                        msg: Object.assign(msg, { channel: dmChannel }),
                                        Price: Price,
                                        Alert: Alert,
                                        args: [""],
                                        updateChannel: updateChannel,
                                        bot: bot,
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/, message];
            }
        });
    });
};
