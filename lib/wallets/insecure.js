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
const algosdk_1 = require("algosdk");
const algosdk_2 = require("algosdk");
class InsecureWallet {
    connect(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected())
                return true;
            const sk = algosdk_2.default.mnemonicToSecretKey(mnemonic);
            this.accounts = [sk.addr];
            this.pkToSk = { [sk.addr]: mnemonic.split(" ") };
            this.default_account = 0;
            return true;
        });
    }
    static img(inverted) {
        return "";
    }
    img(inverted) {
        return InsecureWallet.img(inverted);
    }
    isConnected() {
        return this.accounts && this.accounts.length > 0;
    }
    getDefaultAccount() {
        if (!this.isConnected())
            return "";
        return this.accounts[this.default_account];
    }
    signTxn(txns) {
        return __awaiter(this, void 0, void 0, function* () {
            const signed = [];
            const default_addr = this.getDefaultAccount();
            for (let txidx in txns) {
                let addr = algosdk_2.default.encodeAddress(txns[txidx].from.publicKey);
                if (addr == default_addr) {
                    signed.push(algosdk_2.default.signTransaction(txns[txidx], this.pkToSk[addr].sk));
                }
                else {
                    signed.push({ txID: "", blob: new Uint8Array() });
                }
            }
            return signed;
        });
    }
    sign(txn) {
        return __awaiter(this, void 0, void 0, function* () {
            let addr = this.getDefaultAccount();
            return algosdk_2.default.signTransaction(new algosdk_1.Transaction(txn), this.pkToSk[addr].sk);
        });
    }
    signBytes(b) {
        return __awaiter(this, void 0, void 0, function* () {
            let addr = this.getDefaultAccount();
            return algosdk_2.default.signBytes(b, this.pkToSk[addr].sk);
        });
    }
    signTeal(teal) {
        throw new Error('Method not implemented.');
    }
}
exports.default = InsecureWallet;
