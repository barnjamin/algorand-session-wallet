import AlgoSignerWallet from './wallets/algosigner';
import MyAlgoConnectWallet from './wallets/myalgoconnect';
import InsecureWallet from './wallets/insecure';
import WC from './wallets/walletconnect';
import { PermissionCallback, Wallet, SignedTxn } from './wallets/wallet';
import { Transaction } from 'algosdk';
export { PermissionResult, PermissionCallback, Wallet, SignedTxn } from './wallets/wallet';
export declare const allowedWallets: {
    'algo-signer': typeof AlgoSignerWallet;
    'my-algo-connect': typeof MyAlgoConnectWallet;
    'insecure-wallet': typeof InsecureWallet;
    'wallet-connect': typeof WC;
};
export declare class SessionWallet {
    wallet: Wallet;
    wname: string;
    network: string;
    permissionCallback?: PermissionCallback;
    constructor(network: string, permissionCallback?: PermissionCallback, wname?: string);
    connect(): Promise<boolean>;
    connected(): boolean;
    setAccountList(accts: string[]): void;
    accountList(): string[];
    setAccountIndex(idx: number): void;
    accountIndex(): number;
    setWalletPreference(wname: string): void;
    walletPreference(): string;
    setMnemonic(m: string): void;
    mnemonic(): string;
    disconnect(): void;
    getDefaultAccount(): string;
    signTxn(txns: Transaction[]): Promise<SignedTxn[]>;
}
