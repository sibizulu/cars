## Hyperledger Fabric 

### Steps to run

1. `cd first-network && ./byfn.sh up -l node`
2. `cd fabcar && ./startFabric.sh javascript`
3. `cd fabcar/javascript && node enrollAdmin.js && node registerUser.js`
4. `cd fabcar/javascript && pm2 start index.js`

