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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./wallets/algosigner", "./wallets/myalgoconnect", "./wallets/insecure", "./wallets/walletconnect"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SessionWallet = exports.allowedWallets = void 0;
    var algosigner_1 = __importDefault(require("./wallets/algosigner"));
    var myalgoconnect_1 = __importDefault(require("./wallets/myalgoconnect"));
    var insecure_1 = __importDefault(require("./wallets/insecure"));
    var walletconnect_1 = __importDefault(require("./wallets/walletconnect"));
    exports.allowedWallets = {
        'wallet-connect': walletconnect_1.default,
        'algo-signer': algosigner_1.default,
        'my-algo-connect': myalgoconnect_1.default,
        'insecure-wallet': insecure_1.default,
    };
    var walletPreferenceKey = 'wallet-preference';
    var acctListKey = 'acct-list';
    var acctPreferenceKey = 'acct-preference';
    var mnemonicKey = 'mnemonic';
    var SessionWallet = /** @class */ (function () {
        function SessionWallet(network, permissionCallback, wname) {
            if (wname)
                this.setWalletPreference(wname);
            this.network = network;
            this.wname = this.walletPreference();
            if (permissionCallback)
                this.permissionCallback = permissionCallback;
            if (!(this.wname in exports.allowedWallets))
                return;
            this.wallet = new exports.allowedWallets[this.wname](network);
            this.wallet.permissionCallback = this.permissionCallback;
            this.wallet.accounts = this.accountList();
            this.wallet.defaultAccount = this.accountIndex();
        }
        SessionWallet.prototype.connect = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, storedMnemonic, mnemonic;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.wallet === undefined)
                                return [2 /*return*/, false];
                            _a = this.wname;
                            switch (_a) {
                                case 'insecure-wallet': return [3 /*break*/, 1];
                                case 'wallet-connect': return [3 /*break*/, 3];
                            }
                            return [3 /*break*/, 5];
                        case 1:
                            storedMnemonic = this.mnemonic();
                            mnemonic = storedMnemonic ? storedMnemonic :
                                prompt("Paste your mnemonic space delimited (DO NOT USE WITH MAINNET ACCOUNTS)");
                            if (!mnemonic)
                                return [2 /*return*/, false];
                            return [4 /*yield*/, this.wallet.connect(mnemonic)];
                        case 2:
                            if (_b.sent()) {
                                this.setMnemonic(mnemonic);
                                this.setAccountList(this.wallet.accounts);
                                this.wallet.defaultAccount = this.accountIndex();
                                return [2 /*return*/, true];
                            }
                            return [3 /*break*/, 7];
                        case 3: return [4 /*yield*/, this.wallet.connect(function (acctList) {
                                _this.setAccountList(acctList);
                                _this.wallet.defaultAccount = _this.accountIndex();
                            })];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, true];
                        case 5: return [4 /*yield*/, this.wallet.connect()];
                        case 6:
                            if (_b.sent()) {
                                this.setAccountList(this.wallet.accounts);
                                this.wallet.defaultAccount = this.accountIndex();
                                return [2 /*return*/, true];
                            }
                            return [3 /*break*/, 7];
                        case 7:
                            // Fail
                            this.disconnect();
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        SessionWallet.prototype.connected = function () { return (this.wallet !== undefined && this.wallet.isConnected()); };
        SessionWallet.prototype.getSigner = function () {
            var _this = this;
            return function (txnGroup, indexesToSign) {
                return Promise.resolve(_this.signTxn(txnGroup)).then(function (txns) {
                    return txns.map(function (tx) { return tx.blob; });
                });
            };
        };
        SessionWallet.prototype.setAccountList = function (accts) { sessionStorage.setItem(acctListKey, JSON.stringify(accts)); };
        SessionWallet.prototype.accountList = function () {
            var accts = sessionStorage.getItem(acctListKey);
            return accts === "" || accts === null ? [] : JSON.parse(accts);
        };
        SessionWallet.prototype.setAccountIndex = function (idx) { this.wallet.defaultAccount = idx; sessionStorage.setItem(acctPreferenceKey, idx.toString()); };
        SessionWallet.prototype.accountIndex = function () {
            var idx = sessionStorage.getItem(acctPreferenceKey);
            return idx === null || idx === "" ? 0 : parseInt(idx, 10);
        };
        SessionWallet.prototype.setWalletPreference = function (wname) { this.wname = wname; sessionStorage.setItem(walletPreferenceKey, wname); };
        SessionWallet.prototype.walletPreference = function () {
            var wp = sessionStorage.getItem(walletPreferenceKey);
            return wp === null ? "" : wp;
        };
        SessionWallet.prototype.setMnemonic = function (m) { sessionStorage.setItem(mnemonicKey, m); };
        SessionWallet.prototype.mnemonic = function () {
            var mn = sessionStorage.getItem(mnemonicKey);
            return mn === null ? "" : mn;
        };
        SessionWallet.prototype.disconnect = function () {
            if (this.wallet !== undefined)
                this.wallet.disconnect();
            sessionStorage.setItem(walletPreferenceKey, '');
            sessionStorage.setItem(acctPreferenceKey, '');
            sessionStorage.setItem(acctListKey, '');
            sessionStorage.setItem(mnemonicKey, '');
        };
        SessionWallet.prototype.getDefaultAccount = function () {
            if (!this.connected())
                return "";
            return this.wallet.getDefaultAccount();
        };
        SessionWallet.prototype.signTxn = function (txns) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = !this.connected();
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.connect()];
                        case 1:
                            _a = !(_b.sent());
                            _b.label = 2;
                        case 2:
                            if (_a)
                                return [2 /*return*/, []];
                            return [2 /*return*/, this.wallet.signTxn(txns)];
                    }
                });
            });
        };
        return SessionWallet;
    }());
    exports.SessionWallet = SessionWallet;
});
