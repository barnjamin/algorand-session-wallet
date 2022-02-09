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
const algosdk_1 = __importDefault(require("algosdk"));
const myalgo_connect_1 = __importDefault(require("@randlabs/myalgo-connect"));
const logoInverted = "data:image/png;base64,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";
const logo = "data:image/png;base64,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";
/*
 Warning:
    Popups will be blocked if the connect or sign are called outside of a user triggered event, please make sure
    the user allows all popups or the calls are all triggered by events
    https://connect.myalgo.com/docs/getting-started/important-considerations#browser-events-and-blocked-popups
*/
class MyAlgoConnectWallet {
    constructor() {
        this.accounts = [];
        this.defaultAccount = 0;
        this.walletConn = new myalgo_connect_1.default();
    }
    static displayName() {
        return "My Algo";
    }
    displayName() {
        return MyAlgoConnectWallet.displayName();
    }
    static img(inverted) {
        return inverted ? logoInverted : logo;
    }
    img(inverted) {
        return MyAlgoConnectWallet.img(inverted);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected())
                return true;
            try {
                const accounts = yield this.walletConn.connect();
                this.accounts = accounts.map((account) => account.address);
            }
            catch (err) {
                return false;
            }
            return true;
        });
    }
    isConnected() {
        return this.accounts && this.accounts.length > 0;
    }
    disconnect() {
        /* noop */
    }
    getDefaultAccount() {
        if (!this.isConnected())
            return "";
        return this.accounts[this.defaultAccount];
    }
    doSign(defaultAcct, txns) {
        return __awaiter(this, void 0, void 0, function* () {
            const unsigned = [];
            const signedTxns = [];
            for (const tidx in txns) {
                if (!txns[tidx])
                    continue;
                const txn = txns[tidx];
                if (algosdk_1.default.encodeAddress(txn.from.publicKey) === defaultAcct) {
                    signedTxns.push(unsigned.length);
                    unsigned.push(txn.toByte());
                }
                else {
                    signedTxns.push({ txID: "", blob: new Uint8Array() });
                }
            }
            const s = yield this.walletConn.signTransaction(unsigned);
            for (let x = 0; x < signedTxns.length; x++) {
                if (typeof signedTxns[x] === "number")
                    signedTxns[x] = s[signedTxns[x]];
            }
            return signedTxns;
        });
    }
    signTxn(txns) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultAcct = this.getDefaultAccount();
            if (this.permissionCallback) {
                return yield this.permissionCallback.request({
                    approved: () => __awaiter(this, void 0, void 0, function* () {
                        return yield this.doSign(defaultAcct, txns);
                    }),
                    declined: () => __awaiter(this, void 0, void 0, function* () {
                        return [];
                    }),
                });
            }
            return yield this.doSign(defaultAcct, txns);
        });
    }
    signBytes(b, permissionCallback) {
        throw new Error("Method not implemented.");
    }
    signTeal(teal, permissionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.walletConn.signLogicSig(teal, this.getDefaultAccount());
        });
    }
}
exports.default = MyAlgoConnectWallet;
