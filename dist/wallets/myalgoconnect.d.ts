import { Transaction } from 'algosdk';
import { SignedTxn, Wallet } from './wallet';
import MyAlgo from '@randlabs/myalgo-connect';
declare class MyAlgoConnectWallet implements Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    walletConn: MyAlgo;
    constructor();
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    connect(): Promise<boolean>;
    isConnected(): boolean;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
    signBytes(b: Uint8Array): Promise<Uint8Array>;
    signTeal(teal: Uint8Array): Promise<Uint8Array>;
}
export default MyAlgoConnectWallet;
