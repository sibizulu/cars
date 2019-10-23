/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const { Contract } = require('fabric-contract-api')

class FabCar extends Contract {
    async initLedger(ctx) {}

    async addCustomer(ctx, userId, firstName, lastName, regionCode) {
        const userObject = {
            userId,
            firstName,
            lastName,
            regionCode,
            carDetail: []
        }
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userObject)))
    }
    async getCustomer(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId)
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userId} does not exist`)
        }
        console.log(userAsBytes.toString())
        return userAsBytes.toString()
    }

    async addCarDetails(
        ctx,
        userId,
        carId,
        brand,
        modelCode,
        modelName,
        carMake,
        carRegistrationNo,
        carChasisNo,
        buybackValue,
        sellAlert
    ) {
        const carObject = {
            carId,
            brand,
            modelCode,
            modelName,
            carMake,
            carRegistrationNo,
            carChasisNo,
            buybackValue,
            sellAlert,
            carService: [],
            insuranceDetail: []
        }

        const userAsBytes = await ctx.stub.getState(userId)

        if (!userAsBytes) {
            throw new Error(`${userId} does not exist`)
        }

        const data = JSON.parse(userAsBytes.toString())
        data.carDetail.push(carObject)
        try {
            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(data)))
        } catch (e) {
            throw e
        }
    }

    async addService(
        ctx,
        userId,
        carId,
        serviceNo,
        serviceType,
        servicedDate,
        milesSchedule,
        daysSchedule,
        milesActuals,
        daysActuals,
        serviceFlag,
        repairAmount,
        description,
        rewardsAwarded
    ) {
        const serviceObject = {
            serviceNo,
            serviceType,
            servicedDate,
            milesSchedule,
            daysSchedule,
            milesActuals,
            daysActuals,
            serviceFlag,
            repairAmount,
            description,
            rewardsAwarded
        }

        const userAsBytes = await ctx.stub.getState(userId)

        if (!userAsBytes) {
            throw new Error(`${userId} does not exist`)
        }

        const data = JSON.parse(userAsBytes.toString())
        var singleObj = null
        for (var i = 0; i < data.carDetail.length; i++) {
            const singleObj = data.carDetail[i]
            if (singleObj.carId == carId) {
                data.carDetail[i].carService.push(serviceObject)
            }
        }
        try {
            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(data)))
        } catch (e) {
            throw e
        }
    }

    async addInsurance(
        ctx,
        userId,
        carId,
        id,
        insuranceId,
        policyNumber,
        policyHolder,
        provider,
        validFrom,
        validTill,
        CoverageDetail
    ) {
        const insuranceObject = {
            id,
            insuranceId,
            policyNumber,
            policyHolder,
            provider,
            validFrom,
            validTill,
            CoverageDetail
        }
        const userAsBytes = await ctx.stub.getState(userId)

        if (!userAsBytes) {
            throw new Error(`${userId} does not exist`)
        }

        const data = JSON.parse(userAsBytes.toString())
        for (var i = 0; i < data.carDetail.length; i++) {
            const singleObj = data.carDetail[i]
            if (singleObj.carId === carId) {
                data.carDetail[i].insuranceDetail.push(insuranceObject)
            }
        }
        try {
            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(data)))
        } catch (e) {
            throw e
        }
    }

    async updateBuyBackValue(ctx, userId, carId, buybackValue) {
        const updateObject = {
            buybackValue
        }
        const userAsBytes = await ctx.stub.getState(userId)

        if (!userAsBytes) {
            throw new Error(`${userId} does not exist`)
        }

        const data = JSON.parse(userAsBytes.toString())
        for (var i = 0; i < data.carDetail.length; i++) {
            const singleObj = data.carDetail[i]
            if (singleObj.carId === carId) {
                data.carDetail[i].buybackValue = buybackValue
            }
        }
        try {
            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(data)))
        } catch (e) {
            throw e
        }
    }
}

module.exports = FabCar
