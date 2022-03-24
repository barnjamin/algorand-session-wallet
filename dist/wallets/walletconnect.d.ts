import { Transaction, TransactionParams } from "algosdk";
import { PermissionCallback, SignedTxn, Wallet } from "./wallet";
import WalletConnect from "@walletconnect/client";
declare class WC implements Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    connector: WalletConnect;
    permissionCallback?: PermissionCallback;
    constructor(network: string);
    connect(cb: any): Promise<boolean>;
    static displayName(): string;
    displayName(): string;
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    isConnected(): boolean;
    disconnect(): void;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
    sign(txn: TransactionParams): Promise<SignedTxn>;
    signBytes(b: Uint8Array): Promise<Uint8Array>;
    signTeal(teal: Uint8Array): Promise<Uint8Array>;
}
export default WC;
