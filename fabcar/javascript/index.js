'use strict'

const Hapi = require('@hapi/hapi')
const Joi = require('@hapi/joi')
const util = require('./util')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')
// load the package and set custom message options
const Relish = require('relish')({
    messages: {
        firstName: 'Missing firstName',
        lastName: 'Missing lastName',
        regionCode: 'Missing regionCode',
        userID: 'Missing userID',
        carID: 'Missing carID',
        brand: 'Missing brand',
        modelCode: 'Missing modelCode',
        modelName: 'Missing modelName',
        carMake: 'Missing carMake',
        carChasisNo: 'Missing carChasisNo',
        buybackValue: 'Missing buybackValue',
        sellAlert: 'Missing sellAlert',
        serviceNo: 'Missing serviceNo',
        serviceType: 'Missing serviceType',
        milesSchedule: 'Missing milesSchedule',
        daysSchedule: 'Missing daysSchedule',
        milesActuals: 'Missing milesActuals',
        daysActuals: 'Missing daysActuals',
        serviceFlag: 'Missing serviceFlag',
        repairAmount: 'Missing repairAmount',
        description: 'Missing description',
        id: 'Missing id',
        insuranceId: 'Missing insuranceId',
        policyNumber: 'Missing policyNumber',
        policyHolder: 'Missing policyHolder',
        provider: 'Missing provider',
        validFrom: 'Missing validFrom',
        validTill: 'Missing validTill',
        CoverageDetail: 'Missing CoverageDetail'
    }
})

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    })

    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: Pack.version
        },
        basePath: '/',
        documentationPath: '/docs'
    }

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    server.route({
        method: 'GET',
        path: '/all/{user}',
        options: {
            handler: async (request, h) => {
                const params = request.params
                const res = await util.getAllDetails(params.user)
                return h.response({ userId: res, success: true })
            },
            validate: {
                params: {
                    user: Joi.string().required()
                }
            },
            tags: ['api'],
            description: 'Displays user details',
            notes: 'Returns details of the user'
        }
    })

    server.route({
        method: 'POST',
        path: '/service',
        options: {
            handler: async (request, h) => {
                const payload = request.payload
                const res = await util.addService(payload)

                return h.response({ success: true })
            },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    carID: Joi.string().required(),
                    serviceNo: Joi.string().required(),
                    serviceType: Joi.string().required(),
                    milesSchedule: Joi.string().required(),
                    daysSchedule: Joi.string().required(),
                    milesActuals: Joi.string().required(),
                    daysActuals: Joi.string().required(),
                    serviceFlag: Joi.string().required(),
                    repairAmount: Joi.string().required(),
                    description: Joi.string().required()
                },

                failAction: Relish.failAction
            },
            tags: ['api'],
            description: 'Add service details'
        }
    })

    server.route({
        method: 'POST',
        path: '/insurance',
        options: {
            handler: async (request, h) => {
                const payload = request.payload
                const res = await util.addInsurance(payload)

                return h.response({ success: true })
            },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    carID: Joi.string().required(),
                    id: Joi.string().required(),
                    insuranceId: Joi.string().required(),
                    policyNumber: Joi.string().required(),
                    policyHolder: Joi.string().required(),
                    provider: Joi.string().required(),
                    validFrom: Joi.string().required(),
                    validTill: Joi.string().required(),
                    CoverageDetail: Joi.string().required()
                },
                failAction: Relish.failAction
            },
            tags: ['api'],
            description: 'Add Insurance Details'
        }
    })

    server.route({
        method: 'POST',
        path: '/user',
        options: {
            handler: async (request, h) => {
                const payload = request.payload
                const res = await util.addUser(payload)

                return h.response({ userID: res, success: true })
            },
            validate: {
                payload: {
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    regionCode: Joi.number().required()
                },
                failAction: Relish.failAction
            },
            tags: ['api'],
            description: 'Add a new user'
        }
    })

    server.route({
        method: 'POST',
        path: '/car',
        options: {
            handler: async (request, h) => {
                const payload = request.payload
                const res = await util.addCar(payload)

                return h.response({ carID: res, success: true })
            },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    brand: Joi.string().required(),
                    modelCode: Joi.string().required(),
                    modelName: Joi.string().required(),
                    carMake: Joi.string().required(),
                    carChasisNo: Joi.string().required(),
                    buybackValue: Joi.string().required(),
                    sellAlert: Joi.string().required()
                },
                failAction: Relish.failAction
            },
            tags: ['api'],
            description: 'Add a new car'
        }
    })

    await server.start()
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
})

init()
