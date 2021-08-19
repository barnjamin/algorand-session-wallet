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
    displayName(): string;
    img(inverted: boolean): string;
    connect(settings?: any): Promise<boolean>;
    isConnected(): boolean;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[], permissionCallback?: PermissionCallback): Promise<SignedTxn[]>;
    signBytes(b: Uint8Array, permissionCallback?: PermissionCallback): Promise<Uint8Array>;
    signTeal(teal: Uint8Array, permissionCallback?: PermissionCallback): Promise<Uint8Array>;
}
