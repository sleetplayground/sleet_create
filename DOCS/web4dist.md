# Web4 Distribution


using https://github.com/vgrichina/web4-min-contract

first deploy web4-min-contract
```sh
near deploy create.sleet.testnet web4-min.wasm
near deploy sleetcreate.testnet web4-min.wasm
near deploy create.sleet.near web4-min.wasm
near deploy sleetcreate.near web4-min.wasm
```

near cli network
```sh
export NEAR_NETWORK=testnet
export NEAR_NETWORK=mainnet
echo $NEAR_NETWORK 
echo $NEAR_ENV
```

deploy

```sh
npx web4-deploy dist create.sleet.testnet --nearfs
npx web4-deploy dist sleetcreate.testnet --nearfs
npx web4-deploy dist create.sleet.near --nearfs
npx web4-deploy dist sleetcreate.near --nearfs
```
- can be run with or without --nearfs




also locally with ipfs
```sh
ipfs add -r web_playground
```


---


git remotes
- https://gitlab.com/the-sunshining/Sunny-Stuff/web3/sleet-account
- https://github.com/sleetplayground/sleet_create.git

```sh
git remote add github https://github.com/sleetplayground/sleet_create.git
git push github main
```


near subaccunt setup

```sh
near create-account create.sleet.testnet --masterAccount sleet.testnet --initialBalance 1
near create-account create.sleet.near --masterAccount sleet.near --initialBalance 0.5
```

remember to export account
```sh
# export
near account export-account create.sleet.testnet
near account export-account create.sleet.near

#view
near view-account 
```