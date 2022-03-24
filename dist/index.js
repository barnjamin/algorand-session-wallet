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
exports.SessionWallet = exports.allowedWallets = void 0;
const algosigner_1 = __importDefault(require("./wallets/algosigner"));
const myalgoconnect_1 = __importDefault(require("./wallets/myalgoconnect"));
const insecure_1 = __importDefault(require("./wallets/insecure"));
const walletconnect_1 = __importDefault(require("./wallets/walletconnect"));
exports.allowedWallets = {
    "wallet-connect": walletconnect_1.default,
    "algo-signer": algosigner_1.default,
    "my-algo-connect": myalgoconnect_1.default,
    "insecure-wallet": insecure_1.default,
};
const walletPreferenceKey = "wallet-preference";
const acctListKey = "acct-list";
const acctPreferenceKey = "acct-preference";
const mnemonicKey = "mnemonic";
class SessionWallet {
    constructor(network, permissionCallback, wname) {
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.wallet === undefined)
                return false;
            switch (this.wname) {
                case "insecure-wallet":
                    const storedMnemonic = this.mnemonic();
                    const mnemonic = storedMnemonic
                        ? storedMnemonic
                        : prompt("Paste your mnemonic space delimited (DO NOT USE WITH MAINNET ACCOUNTS)");
                    if (!mnemonic)
                        return false;
                    if (yield this.wallet.connect(mnemonic)) {
                        this.setMnemonic(mnemonic);
                        this.setAccountList(this.wallet.accounts);
                        this.wallet.defaultAccount = this.accountIndex();
                        return true;
                    }
                    break;
                case "wallet-connect":
                    yield this.wallet.connect((acctList) => {
                        this.setAccountList(acctList);
                        this.wallet.defaultAccount = this.accountIndex();
                    });
                    return true;
                default:
                    if (yield this.wallet.connect()) {
                        this.setAccountList(this.wallet.accounts);
                        this.wallet.defaultAccount = this.accountIndex();
                        return true;
                    }
                    break;
            }
            // Fail
            this.disconnect();
            return false;
        });
    }
    connected() {
        return this.wallet !== undefined && this.wallet.isConnected();
    }
    getSigner() {
        return (txnGroup, indexesToSign) => {
            return Promise.resolve(this.signTxn(txnGroup)).then((txns) => {
                return txns.map((tx) => {
                    return tx.blob;
                });
            });
        };
    }
    setAccountList(accts) {
        sessionStorage.setItem(acctListKey, JSON.stringify(accts));
    }
    accountList() {
        const accts = sessionStorage.getItem(acctListKey);
        return accts === "" || accts === null ? [] : JSON.parse(accts);
    }
    setAccountIndex(idx) {
        this.wallet.defaultAccount = idx;
        sessionStorage.setItem(acctPreferenceKey, idx.toString());
    }
    accountIndex() {
        const idx = sessionStorage.getItem(acctPreferenceKey);
        return idx === null || idx === "" ? 0 : parseInt(idx, 10);
    }
    setWalletPreference(wname) {
        this.wname = wname;
        sessionStorage.setItem(walletPreferenceKey, wname);
    }
    walletPreference() {
        const wp = sessionStorage.getItem(walletPreferenceKey);
        return wp === null ? "" : wp;
    }
    setMnemonic(m) {
        sessionStorage.setItem(mnemonicKey, m);
    }
    mnemonic() {
        const mn = sessionStorage.getItem(mnemonicKey);
        return mn === null ? "" : mn;
    }
    disconnect() {
        if (this.wallet !== undefined)
            this.wallet.disconnect();
        sessionStorage.setItem(walletPreferenceKey, "");
        sessionStorage.setItem(acctPreferenceKey, "");
        sessionStorage.setItem(acctListKey, "");
        sessionStorage.setItem(mnemonicKey, "");
    }
    getDefaultAccount() {
        if (!this.connected())
            return "";
        return this.wallet.getDefaultAccount();
    }
    signTxn(txns) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected() && !(yield this.connect()))
                return [];
            return this.wallet.signTxn(txns);
        });
    }
}
exports.SessionWallet = SessionWallet;
