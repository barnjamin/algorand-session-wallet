import { Transaction, TransactionParams } from 'algosdk';
import { SignedTxn, Wallet } from './wallet';
declare class AlgoSignerWallet implements Wallet {
    accounts: Array<string>;
    default_account: number;
    network: string;
    constructor(network: string);
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    connect(): Promise<boolean>;
    waitForLoaded(): Promise<boolean>;
    isConnected(): boolean;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
    sign(txn: TransactionParams): Promise<SignedTxn>;
    signBytes(b: Uint8Array): Promise<Uint8Array>;
    signTeal(teal: Uint8Array): Promise<Uint8Array>;
}
export default AlgoSignerWallet;
