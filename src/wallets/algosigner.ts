import algosdk, { Transaction, TransactionParams } from 'algosdk'
import { SignedTxn, Wallet } from './wallet'

const logo_inverted = "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"
const logo = "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"


declare const AlgoSigner: any;

class AlgoSignerWallet implements Wallet {
    accounts: Array<string> 
    default_account: number
    network: string

    constructor(network: string) { 
        this.network = network 
        this.accounts = []
        this.default_account = 0
    }

    static img(inverted: boolean): string {
        return inverted?logo_inverted:logo
    }

    img(inverted: boolean): string {
        return AlgoSignerWallet.img(inverted)
    }

    async connect(): Promise<boolean> {

        if(this.isConnected()) return true;

        const loaded = await this.waitForLoaded() 

        if(!loaded){
            alert("AlgoSigner not loaded, is it installed?")
            return false
        }

        try {
            await AlgoSigner.connect()
        } catch (err) { 
            console.error("Failed to connect: ", err) 
            alert("Couldn't connect to algosigner, is it installed?")
        }

        const accts = await AlgoSigner.accounts({ ledger: this.network })
        this.accounts = accts.map((a:any)=>{ return a.address})

        return true
    }

    async waitForLoaded(): Promise<boolean> {
        for(let x=0; x<3; x++){
            if (typeof AlgoSigner !== 'undefined'){ return true }
            await new Promise(r=>{setTimeout(r, 1000)})
        }

        return false
    }


    isConnected(): boolean {
        if (typeof AlgoSigner === 'undefined') return false;
        return this.accounts && this.accounts.length>0
    }

    getDefaultAccount(): string {
        if(!this.isConnected()) return ""

        return this.accounts[this.default_account];
    }

    async signTxn(txns: Transaction[]): Promise<SignedTxn[]> {

        const default_acct = this.getDefaultAccount()

        const encoded_txns = txns.map((tx: Transaction) => {
            const t = {txn: AlgoSigner.encoding.msgpackToBase64(tx.toByte())};
            //@ts-ignore
            if(algosdk.encodeAddress(tx.from.publicKey) !== default_acct) t.signers = []
            return t
        });

        const signed = await AlgoSigner.signTxn(encoded_txns);

        return signed.map((signedTx:any)=>{
            if (signedTx) return {
                txID: signedTx.txID,
                blob: AlgoSigner.encoding.base64ToMsgpack(signedTx.blob),
            }
            return {}
        })
    }

    async sign(txn: TransactionParams): Promise<SignedTxn> {
        const stxn = await AlgoSigner.sign(txn)
        const blob = new Uint8Array(Buffer.from(stxn.blob, 'base64'))
        return {txID: stxn.txID, blob: blob}
    }

    async signBytes(b: Uint8Array): Promise<Uint8Array> {
        throw new Error('Method not implemented.')
    }

    async signTeal(teal: Uint8Array): Promise<Uint8Array> {
        throw new Error('Method not implemented.')
    }
}

export default AlgoSignerWallet;