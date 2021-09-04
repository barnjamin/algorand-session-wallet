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
const client_1 = __importDefault(require("@walletconnect/client"));
const qrcode_modal_1 = __importDefault(require("@walletconnect/qrcode-modal"));
const utils_1 = require("@json-rpc-tools/utils");
const logo = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMTg1cHgiIHZpZXdCb3g9IjAgMCAzMDAgMTg1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0OS4zICg1MTE2NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+V2FsbGV0Q29ubmVjdDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ3YWxsZXRjb25uZWN0LWxvZ28tYWx0IiBmaWxsPSIjM0I5OUZDIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8cGF0aCBkPSJNNjEuNDM4NTQyOSwzNi4yNTYyNjEyIEMxMTAuMzQ5NzY3LC0xMS42MzE5MDUxIDE4OS42NTA1MywtMTEuNjMxOTA1MSAyMzguNTYxNzUyLDM2LjI1NjI2MTIgTDI0NC40NDgyOTcsNDIuMDE5Njc4NiBDMjQ2Ljg5Mzg1OCw0NC40MTQwODY3IDI0Ni44OTM4NTgsNDguMjk2MTg5OCAyNDQuNDQ4Mjk3LDUwLjY5MDU5OSBMMjI0LjMxMTYwMiw3MC40MDYxMDIgQzIyMy4wODg4MjEsNzEuNjAzMzA3MSAyMjEuMTA2MzAyLDcxLjYwMzMwNzEgMjE5Ljg4MzUyMSw3MC40MDYxMDIgTDIxMS43ODI5MzcsNjIuNDc0OTU0MSBDMTc3LjY2MTI0NSwyOS4wNjY5NzI0IDEyMi4zMzkwNTEsMjkuMDY2OTcyNCA4OC4yMTczNTgyLDYyLjQ3NDk1NDEgTDc5LjU0MjMwMiw3MC45Njg1NTkyIEM3OC4zMTk1MjA0LDcyLjE2NTc2MzMgNzYuMzM3MDAxLDcyLjE2NTc2MzMgNzUuMTE0MjIxNCw3MC45Njg1NTkyIEw1NC45Nzc1MjY1LDUxLjI1MzA1NjEgQzUyLjUzMTk2NTMsNDguODU4NjQ2OSA1Mi41MzE5NjUzLDQ0Ljk3NjU0MzkgNTQuOTc3NTI2NSw0Mi41ODIxMzU3IEw2MS40Mzg1NDI5LDM2LjI1NjI2MTIgWiBNMjgwLjIwNjMzOSw3Ny4wMzAwMDYxIEwyOTguMTI4MDM2LDk0LjU3NjkwMzEgQzMwMC41NzM1ODUsOTYuOTcxMyAzMDAuNTczNTk5LDEwMC44NTMzOCAyOTguMTI4MDY3LDEwMy4yNDc3OTMgTDIxNy4zMTc4OTYsMTgyLjM2ODkyNyBDMjE0Ljg3MjM1MiwxODQuNzYzMzUzIDIxMC45MDczMTQsMTg0Ljc2MzM4IDIwOC40NjE3MzYsMTgyLjM2ODk4OSBDMjA4LjQ2MTcyNiwxODIuMzY4OTc5IDIwOC40NjE3MTQsMTgyLjM2ODk2NyAyMDguNDYxNzA0LDE4Mi4zNjg5NTcgTDE1MS4xMDc1NjEsMTI2LjIxNDM4NSBDMTUwLjQ5NjE3MSwxMjUuNjE1NzgzIDE0OS41MDQ5MTEsMTI1LjYxNTc4MyAxNDguODkzNTIxLDEyNi4yMTQzODUgQzE0OC44OTM1MTcsMTI2LjIxNDM4OSAxNDguODkzNTE0LDEyNi4yMTQzOTMgMTQ4Ljg5MzUxLDEyNi4yMTQzOTYgTDkxLjU0MDU4ODgsMTgyLjM2ODkyNyBDODkuMDk1MDUyLDE4NC43NjMzNTkgODUuMTMwMDEzMywxODQuNzYzMzk5IDgyLjY4NDQyNzYsMTgyLjM2OTAxNCBDODIuNjg0NDEzMywxODIuMzY5IDgyLjY4NDM5OCwxODIuMzY4OTg2IDgyLjY4NDM4MjcsMTgyLjM2ODk3IEwxLjg3MTk2MzI3LDEwMy4yNDY3ODUgQy0wLjU3MzU5NjkzOSwxMDAuODUyMzc3IC0wLjU3MzU5NjkzOSw5Ni45NzAyNzM1IDEuODcxOTYzMjcsOTQuNTc1ODY1MyBMMTkuNzkzNjkyOSw3Ny4wMjg5OTggQzIyLjIzOTI1MzEsNzQuNjM0NTg5OCAyNi4yMDQyOTE4LDc0LjYzNDU4OTggMjguNjQ5ODUzMSw3Ny4wMjg5OTggTDg2LjAwNDgzMDYsMTMzLjE4NDM1NSBDODYuNjE2MjIxNCwxMzMuNzgyOTU3IDg3LjYwNzQ3OTYsMTMzLjc4Mjk1NyA4OC4yMTg4NzA0LDEzMy4xODQzNTUgQzg4LjIxODg3OTYsMTMzLjE4NDM0NiA4OC4yMTg4ODc4LDEzMy4xODQzMzggODguMjE4ODk2OSwxMzMuMTg0MzMxIEwxNDUuNTcxLDc3LjAyODk5OCBDMTQ4LjAxNjUwNSw3NC42MzQ1MzQ3IDE1MS45ODE1NDQsNzQuNjM0NDQ0OSAxNTQuNDI3MTYxLDc3LjAyODc5OCBDMTU0LjQyNzE5NSw3Ny4wMjg4MzE2IDE1NC40MjcyMjksNzcuMDI4ODY1MyAxNTQuNDI3MjYyLDc3LjAyODg5OSBMMjExLjc4MjE2NCwxMzMuMTg0MzMxIEMyMTIuMzkzNTU0LDEzMy43ODI5MzIgMjEzLjM4NDgxNCwxMzMuNzgyOTMyIDIxMy45OTYyMDQsMTMzLjE4NDMzMSBMMjcxLjM1MDE3OSw3Ny4wMzAwMDYxIEMyNzMuNzk1NzQsNzQuNjM1NTk2OSAyNzcuNzYwNzc4LDc0LjYzNTU5NjkgMjgwLjIwNjMzOSw3Ny4wMzAwMDYxIFoiIGlkPSJXYWxsZXRDb25uZWN0Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=";
class WC {
    constructor(network) {
        this.accounts = [];
        this.defaultAccount = 0;
        this.network = network;
        const bridge = "https://bridge.walletconnect.org";
        this.connector = new client_1.default({ bridge, qrcodeModal: qrcode_modal_1.default });
    }
    connect(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if connection is already established
            if (this.connector.connected)
                return true;
            this.connector.createSession();
            this.connector.on("connect", (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts } = payload.params[0];
                cb(accounts);
                this.accounts = accounts;
            });
            this.connector.on("session_update", (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts } = payload.params[0];
                cb(accounts);
                this.accounts = accounts;
            });
            this.connector.on("disconnect", (error, payload) => { if (error)
                throw error; });
            return true;
        });
    }
    static displayName() { return "Wallet Connect"; }
    displayName() { return WC.displayName(); }
    static img(inverted) { return logo; }
    img(inverted) {
        return WC.img(inverted);
    }
    isConnected() { return this.connector.connected; }
    disconnect() { this.connector.killSession(); }
    getDefaultAccount() {
        if (!this.isConnected())
            return "";
        return this.accounts[this.defaultAccount];
    }
    signTxn(txns) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultAddress = this.getDefaultAccount();
            const txnsToSign = txns.map((txn) => {
                const encodedTxn = Buffer.from(algosdk_1.default.encodeUnsignedTransaction(txn)).toString("base64");
                if (algosdk_1.default.encodeAddress(txn.from.publicKey) !== defaultAddress)
                    return { txn: encodedTxn, signers: [] };
                return { txn: encodedTxn };
            });
            const request = utils_1.formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
            const result = yield this.connector.sendCustomRequest(request);
            return result.map((element, idx) => {
                return element ? {
                    txID: txns[idx].txID(),
                    blob: new Uint8Array(Buffer.from(element, "base64"))
                } : {
                    txID: txns[idx].txID(),
                    blob: new Uint8Array()
                };
            });
        });
    }
    sign(txn) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    signBytes(b) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    signTeal(teal) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
}
exports.default = WC;
