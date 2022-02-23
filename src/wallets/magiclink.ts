import algosdk, { Transaction, TransactionParams } from 'algosdk'
import { PermissionCallback, SignedTxn, Wallet } from './wallet'

import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { Magic } from 'magic-sdk';
import { AlgorandExtension } from '@magic-ext/algorand';


const logo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yMDAgMEMyMTguMjYyIDIxLjIwMTQgMjM4LjQwNCA0MC44OTA2IDI2MC4xODUgNTguODM5MUMyNDUuNjcyIDEwMy40NTkgMjM3Ljg1OCAxNTAuODY1IDIzNy44NTggMjAwQzIzNy44NTggMjQ5LjEzNSAyNDUuNjcyIDI5Ni41NDEgMjYwLjE4NSAzNDEuMTYxQzIzOC40MDQgMzU5LjEwOSAyMTguMjYyIDM3OC43OTkgMjAwIDQwMEMxODEuNzM4IDM3OC43OTkgMTYxLjU5NiAzNTkuMTA5IDEzOS44MTUgMzQxLjE2MUMxNTQuMzI4IDI5Ni41NDEgMTYyLjE0MiAyNDkuMTM1IDE2Mi4xNDIgMjAwQzE2Mi4xNDIgMTUwLjg2NSAxNTQuMzI4IDEwMy40NTkgMTM5LjgxNSA1OC44MzkyQzE2MS41OTYgNDAuODkwNyAxODEuNzM4IDIxLjIwMTUgMjAwIDBaIiBmaWxsPSIjNjg1MUZGIi8+CjxwYXRoIGQ9Ik05OC4xODMgMzEwLjMxMkM3NS4xMjc2IDI5NC45OTQgNTAuNjU5MiAyODEuNDU3IDI1IDI2OS45MTFDMzIuMTE3NyAyNDcuNzk3IDM1Ljk0NjcgMjI0LjMyMiAzNS45NDY3IDIwMEMzNS45NDY3IDE3NS42NzggMzIuMTE3NyAxNTIuMjA0IDI1IDEzMC4wODlDNTAuNjU5MSAxMTguNTQzIDc1LjEyNzUgMTA1LjAwNiA5OC4xODMgODkuNjg4NUMxMDYuOTk5IDEyNS4xMDIgMTExLjY2NCAxNjIuMDM0IDExMS42NjQgMjAwQzExMS42NjQgMjM3Ljk2NiAxMDYuOTk5IDI3NC44OTggOTguMTgzIDMxMC4zMTJaIiBmaWxsPSIjNjg1MUZGIi8+CjxwYXRoIGQ9Ik0yODguMzM2IDIwMEMyODguMzM2IDIzNy45NjYgMjkzLjAwMSAyNzQuODk4IDMwMS44MTcgMzEwLjMxMkMzMjQuODcyIDI5NC45OTQgMzQ5LjM0MSAyODEuNDU3IDM3NSAyNjkuOTExQzM2Ny44ODIgMjQ3Ljc5NyAzNjQuMDUzIDIyNC4zMjIgMzY0LjA1MyAyMDBDMzY0LjA1MyAxNzUuNjc4IDM2Ny44ODIgMTUyLjIwNCAzNzUgMTMwLjA4OUMzNDkuMzQxIDExOC41NDMgMzI0Ljg3MiAxMDUuMDA2IDMwMS44MTcgODkuNjg4NEMyOTMuMDAxIDEyNS4xMDIgMjg4LjMzNiAxNjIuMDM0IDI4OC4zMzYgMjAwWiIgZmlsbD0iIzY4NTFGRiIvPgo8L3N2Zz4K"

interface MagicLinkSettings {
    apiKey: string;
    email: string;
    rpcURL: string;
}

class MagicLink implements Wallet {
  accounts: string[]
  defaultAccount: number
  network: string
  connector: InstanceWithExtensions<SDKBase, { algorand: AlgorandExtension; }>
  permissionCallback?: PermissionCallback


  constructor(network: string) {
    this.accounts = []
    this.defaultAccount = 0;
    this.network = network
  }

  async connect(settings: MagicLinkSettings): Promise<boolean> {
    this.connector = new Magic(settings.apiKey, {
        extensions: { algorand: new AlgorandExtension({ rpcUrl: settings.rpcURL }), }
    });


    await this.connector.auth.loginWithMagicLink({ email: settings.email });

    const md = await this.connector.user.getMetadata()
    this.accounts = [md.publicAddress]
    return true
  }


  static displayName(): string { return "Magic Link" }
  displayName(): string { return MagicLink.displayName() }

  static img(inverted: boolean): string { return logo }
  img(inverted: boolean): string { return MagicLink.img(inverted) }

  isConnected(): boolean { return this.accounts.length>0 }

  disconnect(){ this.connector.user.logout() }

  getDefaultAccount(): string {
    if (!this.isConnected()) return ""
    return this.accounts[this.defaultAccount];
  }


  async signTxn(txns: Transaction[]): Promise<SignedTxn[]> {
    const defaultAddress = this.getDefaultAccount()
    const txnsToSign = txns.map((txn) => {
      const encodedTxn = Buffer.from(txn.toByte()).toString("base64");

      if (algosdk.encodeAddress(txn.from.publicKey) !== defaultAddress) return {txn: encodedTxn, signers: []};
      return {txn: encodedTxn};
    })

    console.log(txnsToSign)

    const result = await this.connector.algorand.signGroupTransaction(txnsToSign)

    return result.map((element, idx) => {
      return element ? {
          txID: txns[idx].txID(), 
          blob: new Uint8Array(Buffer.from(element, "base64"))
        } : {
          txID:txns[idx].txID(), 
          blob:new Uint8Array()
        };
    });
  }

  async sign(txn: TransactionParams): Promise<SignedTxn> {
    throw new Error('Method not implemented.')
  }

  async signBytes(b: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.')
  }

  async signTeal(teal: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.')
  }
}

export default MagicLink;