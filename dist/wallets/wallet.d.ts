import { Transaction } from 'algosdk';
export interface SignedTxn {
    txID: string;
    blob: Uint8Array;
}
export interface PermissionResult {
    approved(): Promise<SignedTxn[]>;
    declined(): Promise<SignedTxn[]>;
}
export interface PermissionCallback {
    request(PermissionResult: any): Promise<SignedTxn[]>;
}
export interface Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    permissionCallback?: PermissionCallback;
    displayName(): string;
    img(inverted: boolean): string;
    connect(settings?: any): Promise<boolean>;
    isConnected(): boolean;
    disconnect(): any;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
    signBytes(b: Uint8Array): Promise<Uint8Array>;
    signTeal(teal: Uint8Array): Promise<Uint8Array>;
}
