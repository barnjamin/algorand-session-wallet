import AlgoSignerWallet from './wallets/algosigner'
import MyAlgoConnectWallet from './wallets/myalgoconnect'
import InsecureWallet from './wallets/insecure'
import { Wallet, SignedTxn } from './wallets/wallet'

import { Transaction } from 'algosdk'

export const allowedWallets = {
        'algo-signer': AlgoSignerWallet,
        'my-algo-connect': MyAlgoConnectWallet,
        'insecure-wallet': InsecureWallet,
        'dev-wallet': InsecureWallet
}

const wallet_preference_key = 'wallet-preference'
const acct_list_key = 'acct-list'
const acct_preference_key = 'acct-preference'
const mnemonic_key = 'mnemonic'

export class SessionWallet {
        wallet: Wallet
        wname: string
        network: string

        constructor(network: string, wname?: string) {
                if (wname) this.setWalletPreference(wname)

                this.network = network

                this.wname = this.walletPreference()

                if (!(this.wname in allowedWallets)) return

                this.wallet = new allowedWallets[this.wname](network)
                this.wallet.accounts = this.accountList()
                this.wallet.default_account = this.accountIndex()
        }

        async connect(): Promise<boolean> {
                if (this.wallet === undefined) return false

                switch (this.wname) {
                        case 'insecure-wallet':
                                const stored_mnemonic = this.mnemonic()

                                const mnemonic = stored_mnemonic ? stored_mnemonic : 
                                prompt("Paste your mnemonic space delimited (DO NOT USE WITH MAINNET ACCOUNTS)")

                                if (!mnemonic) return false

                                if (await this.wallet.connect(mnemonic)) {
                                        this.setMnemonic(mnemonic)
                                        this.setAccountList(this.wallet.accounts)
                                        this.wallet.default_account = this.accountIndex()
                                        return true
                                }

                                break

                        default:
                                if (await this.wallet.connect()) {
                                        this.setAccountList(this.wallet.accounts)
                                        this.wallet.default_account = this.accountIndex()
                                        return true
                                }

                                break
                }

                // Fail
                this.disconnect()
                return false
        }

        connected(): boolean { return (this.wallet !== undefined && this.wallet.isConnected()) }

        setAccountList(accts: string[]) { sessionStorage.setItem(acct_list_key, JSON.stringify(accts)) }
        accountList(): string[] {
                const accts = sessionStorage.getItem(acct_list_key);
                return accts == "" || accts == null ? [] : JSON.parse(accts)
        }

        setAccountIndex(idx: number) { this.wallet.default_account = idx; sessionStorage.setItem(acct_preference_key, idx.toString()) }
        accountIndex(): number {
                const idx = sessionStorage.getItem(acct_preference_key);
                return idx == null || idx == "" ? 0 : parseInt(idx)
        }

        setWalletPreference(wname: string) { this.wname = wname; sessionStorage.setItem(wallet_preference_key, wname) }
        walletPreference(): string {
                const wp = sessionStorage.getItem(wallet_preference_key)
                return wp == null ? "" : wp
        }

        setMnemonic(m: string) { sessionStorage.setItem(mnemonic_key, m) }
        mnemonic(): string {
                const mn = sessionStorage.getItem(mnemonic_key)
                return mn == null ? "" : mn
        }

        disconnect() {
                sessionStorage.setItem(wallet_preference_key, '')
                sessionStorage.setItem(acct_preference_key, '')
                sessionStorage.setItem(acct_list_key, '')
                sessionStorage.setItem(mnemonic_key, '')
                this.wallet = undefined
                this.wname = undefined
        }

        getDefaultAccount(): string {
                if (!this.connected()) return ""
                return this.wallet.getDefaultAccount()
        }

        async signTxn(txns: Transaction[]): Promise<SignedTxn[]> {
                if (!this.connected()) return []
                return this.wallet.signTxn(txns)
        }

}