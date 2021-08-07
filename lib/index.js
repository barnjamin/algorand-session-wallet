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
exports.SessionWallet = exports.allowedWallets = void 0;
const algosigner_1 = require("./wallets/algosigner");
const myalgoconnect_1 = require("./wallets/myalgoconnect");
const insecure_1 = require("./wallets/insecure");
exports.allowedWallets = {
    'algo-signer': algosigner_1.default,
    'my-algo-connect': myalgoconnect_1.default,
    'insecure-wallet': insecure_1.default,
    'dev-wallet': insecure_1.default
};
const wallet_preference_key = 'wallet-preference';
const acct_list_key = 'acct-list';
const acct_preference_key = 'acct-preference';
const mnemonic_key = 'mnemonic';
class SessionWallet {
    constructor(network, wname) {
        if (wname)
            this.setWalletPreference(wname);
        this.network = network;
        this.wname = this.walletPreference();
        if (!(this.wname in exports.allowedWallets))
            return;
        this.wallet = new exports.allowedWallets[this.wname](network);
        this.wallet.accounts = this.accountList();
        this.wallet.default_account = this.accountIndex();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.wallet === undefined)
                return false;
            switch (this.wname) {
                case 'insecure-wallet':
                    const stored_mnemonic = this.mnemonic();
                    const mnemonic = stored_mnemonic ? stored_mnemonic :
                        prompt("Paste your mnemonic space delimited (DO NOT USE WITH MAINNET ACCOUNTS)");
                    if (!mnemonic)
                        return false;
                    if (yield this.wallet.connect(mnemonic)) {
                        this.setMnemonic(mnemonic);
                        this.setAccountList(this.wallet.accounts);
                        this.wallet.default_account = this.accountIndex();
                        return true;
                    }
                    break;
                default:
                    if (yield this.wallet.connect()) {
                        this.setAccountList(this.wallet.accounts);
                        this.wallet.default_account = this.accountIndex();
                        return true;
                    }
                    break;
            }
            // Fail
            this.disconnect();
            return false;
        });
    }
    connected() { return (this.wallet !== undefined && this.wallet.isConnected()); }
    setAccountList(accts) { sessionStorage.setItem(acct_list_key, JSON.stringify(accts)); }
    accountList() {
        const accts = sessionStorage.getItem(acct_list_key);
        return accts == "" || accts == null ? [] : JSON.parse(accts);
    }
    setAccountIndex(idx) { this.wallet.default_account = idx; sessionStorage.setItem(acct_preference_key, idx.toString()); }
    accountIndex() {
        const idx = sessionStorage.getItem(acct_preference_key);
        return idx == null || idx == "" ? 0 : parseInt(idx);
    }
    setWalletPreference(wname) { this.wname = wname; sessionStorage.setItem(wallet_preference_key, wname); }
    walletPreference() {
        const wp = sessionStorage.getItem(wallet_preference_key);
        return wp == null ? "" : wp;
    }
    setMnemonic(m) { sessionStorage.setItem(mnemonic_key, m); }
    mnemonic() {
        const mn = sessionStorage.getItem(mnemonic_key);
        return mn == null ? "" : mn;
    }
    disconnect() {
        sessionStorage.setItem(wallet_preference_key, '');
        sessionStorage.setItem(acct_preference_key, '');
        sessionStorage.setItem(acct_list_key, '');
        sessionStorage.setItem(mnemonic_key, '');
        this.wallet = undefined;
        this.wname = undefined;
    }
    getDefaultAccount() {
        if (!this.connected())
            return "";
        return this.wallet.getDefaultAccount();
    }
    signTxn(txns) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected())
                return [];
            return this.wallet.signTxn(txns);
        });
    }
}
exports.SessionWallet = SessionWallet;
