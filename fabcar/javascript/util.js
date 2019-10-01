'use strict'

const { FileSystemWallet, Gateway } = require('fabric-network')
const path = require('path')
const crypto = require('crypto')

const ccpPath = path.resolve(
    __dirname,
    '..',
    '..',
    'first-network',
    'connection-org1.json'
)

const addUser = async data => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)
        const userExists = await wallet.exists('user1')
        if (!userExists) {
            return
        }
        const gateway = new Gateway()
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'user1',
            discovery: { enabled: true, asLocalhost: true }
        })
        const network = await gateway.getNetwork('mychannel')
        const contract = network.getContract('fabcar')

        const id = crypto.randomBytes(20).toString('hex')

        await contract.submitTransaction(
            'addCustomer',
            id,
            data.firstName,
            data.lastName,
            data.regionCode.toString()
        )
        console.log('Transaction has been submitted')

        // Disconnect from the gateway.
        await gateway.disconnect()
        return id
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`)
        process.exit(1)
    }
}

const addCar = async data => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)
        const userExists = await wallet.exists('user1')
        if (!userExists) {
            return
        }
        const gateway = new Gateway()
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'user1',
            discovery: { enabled: true, asLocalhost: true }
        })
        const network = await gateway.getNetwork('mychannel')
        const contract = network.getContract('fabcar')

        const id = crypto.randomBytes(15).toString('hex')

        const k = await contract.submitTransaction(
            'addCarDetails',
            data.userID,
            id,
            data.brand,
            data.modelCode,
            data.modelName,
            data.carMake,
            data.carChasisNo,
            data.buybackValue,
            data.sellAlert
        )
        console.log('Transaction has been submitted', k.toString())

        // Disconnect from the gateway.
        await gateway.disconnect()
        return id
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`)
        process.exit(1)
    }
}

const addService = async data => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)
        const userExists = await wallet.exists('user1')
        if (!userExists) {
            return
        }
        const gateway = new Gateway()
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'user1',
            discovery: { enabled: true, asLocalhost: true }
        })

        const network = await gateway.getNetwork('mychannel')
        const contract = network.getContract('fabcar')

        const k = await contract.submitTransaction(
            'addService',
            data.userID,
            data.carID,
            data.serviceNo,
            data.serviceType,
            data.milesSchedule,
            data.daysSchedule,
            data.milesActuals,
            data.daysActuals,
            data.serviceFlag,
            data.repairAmount,
            data.description
        )
        console.log('Transaction has been submitted', k.toString())
        await gateway.disconnect()
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`)
        process.exit(1)
    }
}

const addInsurance = async data => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)
        const userExists = await wallet.exists('user1')
        if (!userExists) {
            return
        }
        const gateway = new Gateway()
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'user1',
            discovery: { enabled: true, asLocalhost: true }
        })
        const network = await gateway.getNetwork('mychannel')
        const contract = network.getContract('fabcar')
        const k = await contract.submitTransaction(
            'addInsurance',
            data.userID,
            data.carID,
            data.id,
            data.insuranceId,
            data.policyNumber,
            data.policyHolder,
            data.provider,
            data.validFrom,
            data.validTill,
            data.CoverageDetail
        )
        console.log('Transaction has been submitted', k.toString())
        await gateway.disconnect()
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`)
        process.exit(1)
    }
}

const getAllDetails = async userID => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)
        const userExists = await wallet.exists('user1')
        if (!userExists) {
            return
        }

        const gateway = new Gateway()
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'user1',
            discovery: { enabled: true, asLocalhost: true }
        })
        const network = await gateway.getNetwork('mychannel')
        const contract = network.getContract('fabcar')
        const result = await contract.evaluateTransaction('getCustomer', userID)

        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        )
        return JSON.parse(result.toString())
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        process.exit(1)
    }
}
module.exports = { addUser, addCar, addService, addInsurance, getAllDetails }
