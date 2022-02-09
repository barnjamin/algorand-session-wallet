import { Transaction } from "algosdk";
import { PermissionCallback, SignedTxn, Wallet } from "./wallet";
import MyAlgo from "@randlabs/myalgo-connect";
declare class MyAlgoConnectWallet implements Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    permissionCallback?: PermissionCallback;
    walletConn: MyAlgo;
    constructor();
    static displayName(): string;
    displayName(): string;
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    connect(): Promise<boolean>;
    isConnected(): boolean;
    disconnect(): void;
    getDefaultAccount(): string;
    doSign(defaultAcct: string, txns: Transaction[]): Promise<SignedTxn[]>;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
    signBytes(b: Uint8Array, permissionCallback?: PermissionCallback): Promise<Uint8Array>;
    signTeal(teal: Uint8Array, permissionCallback?: PermissionCallback): Promise<Uint8Array>;
}
export default MyAlgoConnectWallet;
