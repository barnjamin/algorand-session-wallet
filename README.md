# algorand-session-wallet

*PRs welcome*

```sh
npm -i algorand-session-wallet
```

```js
const sw = new SessionWallet("TestNet", "algosigner-wallet")
if(!sw.connect()) return alert("Couldnt connect")

//...

const accts = sw.accountList()

//...

sw.signTxn([txnblobs])

//...

sw.disconnect()

```
