var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var execute = function (_a) {
    var msg = _a.msg, _b = _a.args, npc = _b[0], value = _b[1], Alert = _a.Alert;
    return __awaiter(void 0, void 0, void 0, function () {
        var alert_1, newAlertData, dmChannel_1, numValue, updateData, alert, hasAlert, newAlert, dmChannel;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    npc = npc.toLowerCase();
                    if (npc !== "nook" && npc !== "daisy") {
                        return [2 /*return*/, msg.channel.send(npc + " is not a valid npc name. Use `stalk! alert <daisy || nook>`")];
                    }
                    if (!(value === "clear")) return [3 /*break*/, 5];
                    return [4 /*yield*/, Alert.findOne({ user: msg.author.id }).exec()];
                case 1:
                    alert_1 = _d.sent();
                    newAlertData = alert_1 === null || alert_1 === void 0 ? void 0 : alert_1.toObject();
                    delete newAlertData[npc];
                    alert_1 === null || alert_1 === void 0 ? void 0 : alert_1.overwrite(newAlertData);
                    return [4 /*yield*/, (alert_1 === null || alert_1 === void 0 ? void 0 : alert_1.save())];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, msg.author.createDM()];
                case 3:
                    dmChannel_1 = _d.sent();
                    return [4 /*yield*/, dmChannel_1.send("Price alert cleared for " + (npc === "nook" ? "Nook" : "Daisy"))];
                case 4:
                    _d.sent();
                    return [2 /*return*/, msg.react("✅")];
                case 5:
                    numValue = parseInt(value);
                    if (!value || isNaN(numValue)) {
                        return [2 /*return*/, msg.channel.send("You must give a price to set.")];
                    }
                    updateData = (_c = {}, _c[npc] = numValue, _c);
                    return [4 /*yield*/, Alert.findOne({ user: msg.author.id }).exec()];
                case 6:
                    alert = _d.sent();
                    if (!alert) return [3 /*break*/, 8];
                    return [4 /*yield*/, alert.updateOne(updateData).exec()];
                case 7:
                    _d.sent();
                    hasAlert = alert.toObject().hasOwnProperty(npc);
                    return [3 /*break*/, 10];
                case 8:
                    newAlert = new Alert(__assign({ user: msg.author.id }, updateData));
                    return [4 /*yield*/, newAlert.save()];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10: return [4 /*yield*/, msg.author.createDM()];
                case 11:
                    dmChannel = _d.sent();
                    return [4 /*yield*/, dmChannel.send("Price alert " + (hasAlert ? "updated" : "registered") + " for " + (npc === "nook" ? "Nook" : "Daisy") + " at " + numValue)];
                case 12:
                    _d.sent();
                    msg.react("✅");
                    return [2 /*return*/];
            }
        });
    });
};
export default {
    name: "alert",
    description: "Registers a threshold for buying or selling to have the bot send you a DM",
    execute: execute,
};
