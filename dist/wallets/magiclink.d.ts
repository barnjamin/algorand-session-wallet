import { Transaction, TransactionParams } from 'algosdk';
import { PermissionCallback, SignedTxn, Wallet } from './wallet';
import { AlgorandExtension } from '@magic-ext/algorand';
import { SDKBase } from '@magic-sdk/provider';
interface MagicLinkSettings {
    apiKey: string;
    email: string;
    rpcURL: string;
}
declare class MagicLink implements Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    connector: SDKBase & {
        algorand: AlgorandExtension;
    };
    permissionCallback?: PermissionCallback;
    constructor(network: string);
    connect(settings: MagicLinkSettings): Promise<boolean>;
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
export default MagicLink;
