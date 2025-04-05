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



web3storage

Manage spaces:
```sh
# Create a new space
w3 space create sleet_create

# List all spaces
w3 space ls

# Switch to a different space
w3 space use sleet_create

# Delete a space
w3 space delete <name>
```

Upload files and directories:
```sh
w3 up dist
```


method web4_setStaticUrl

```sh

# For testnet
near call sleetcreate.testnet web4_setStaticUrl '{"url": "ipfs://CID_HERE"}' --accountId sleetcreate.testnet

# For mainnet
near call sleetcreate.near web4_setStaticUrl '{"url": "ipfs://CID_HERE"}' --accountId sleetcreate.near

```

bafybeian6a5y2kliwmaz7cic3aksdz52uknflbcv6xfd26t56stoxm3pjq
bafybeidy37p7puzeianyndmkrovwyrz3iswb7dbqaqff5dsezbstmq3ccm