# Web4 Distribution


using https://github.com/vgrichina/web4-min-contract

first deploy web4-min-contract
```sh
near deploy sleetcreate.testnet web4-min.wasm
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
npx web4-deploy dist sleetcreate.testnet --nearfs
npx web4-deploy dist sleetcreate.near --nearfs
```
- can be run with or without --nearfs




---


git remotes
- https://github.com/sleetplayground/sleet_create.git

```sh
git remote add github https://github.com/sleetplayground/sleet_create.git
git push github main
```


