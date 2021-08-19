import { Transaction,TransactionParams } from 'algosdk'
import { SignedTxn, Wallet } from './wallet'
import algosdk from 'algosdk'


const logo = "data:image/jpg;base64,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"

class InsecureWallet implements Wallet {
    accounts: string[]
    defaultAccount: number
    network: string

    pkToSk: object

    constructor(network: string){
        this.accounts = []
        this.pkToSk  = {}
        this.defaultAccount = 0;
	this.network = network
    }

    async connect(mnemonic: string): Promise<boolean> {
        const sk = algosdk.mnemonicToSecretKey(mnemonic)

        this.accounts = [sk.addr]
        this.pkToSk  = {[sk.addr]: sk}
        this.defaultAccount = 0;

        return true
    }

    static displayName():string{ return "Insecure Wallet" }
    displayName(): string { return InsecureWallet.displayName() }

    static img(inverted: boolean): string {
        return logo 
    }

    img(inverted: boolean): string {
        return InsecureWallet.img(inverted)
    }

    isConnected(): boolean {
        return this.accounts && this.accounts.length>0;
    }

    getDefaultAccount(): string {
        if(!this.isConnected()) return ""
        return this.accounts[this.defaultAccount];
    }

    async signTxn(txns: Transaction[]): Promise<SignedTxn[]> {
        const signed = [];
        const defaultAddr = this.getDefaultAccount()
        for(const txidx in txns){
            if(!txns[txidx]) continue

            const addr = algosdk.encodeAddress(txns[txidx].from.publicKey)
            if(addr === defaultAddr){
                signed.push(algosdk.signTransaction(txns[txidx], this.pkToSk[addr].sk)) 
            }else{
                signed.push({txID:"", blob:new Uint8Array()})
            }
        }
        return signed
    }

    async sign(txn: TransactionParams): Promise<SignedTxn> {
        const addr = this.getDefaultAccount()
        return algosdk.signTransaction(new Transaction(txn), this.pkToSk[addr].sk)
    }

    async signBytes(b: Uint8Array): Promise<Uint8Array> {
        const addr = this.getDefaultAccount()
        return algosdk.signBytes(b, this.pkToSk[addr].sk)
    }

    signTeal(teal: Uint8Array): Promise<Uint8Array> {
        throw new Error('Method not implemented.')
    }
}

export default InsecureWallet;
