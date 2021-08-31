import { Transaction, TransactionParams } from 'algosdk';
import { PermissionCallback, SignedTxn, Wallet } from './wallet';
declare class AlgoSignerWallet implements Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    permissionCallback?: PermissionCallback;
    constructor(network: string);
    static displayName(): string;
    displayName(): string;
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    connect(): Promise<boolean>;
    waitForLoaded(): Promise<boolean>;
    isConnected(): boolean;
    disconnect(): void;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
    sign(txn: TransactionParams): Promise<SignedTxn>;
    signBytes(b: Uint8Array): Promise<Uint8Array>;
    signTeal(teal: Uint8Array): Promise<Uint8Array>;
}
export default AlgoSignerWallet;
