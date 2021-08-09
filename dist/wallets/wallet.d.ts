import { Transaction } from 'algosdk';
export interface SignedTxn {
    txID: string;
    blob: Uint8Array;
}
export interface Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    displayName(): string;
    img(inverted: boolean): string;
    connect(settings?: any): Promise<boolean>;
    isConnected(): boolean;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
    signBytes(b: Uint8Array): Promise<Uint8Array>;
    signTeal(teal: Uint8Array): Promise<Uint8Array>;
}
