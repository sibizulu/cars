'use strict'

const Hapi = require('@hapi/hapi')
const Joi = require('@hapi/joi')
const util = require('./util')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const Boom = require('@hapi/boom')
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
        carRegistrationNo: 'Missing carRegistrationNo',
        carChasisNo: 'Missing carChasisNo',
        buybackValue: 'Missing buybackValue',
        sellAlert: 'Missing sellAlert',
        serviceNo: 'Missing serviceNo',
        serviceType: 'Missing serviceType',
        servicedDate: 'Missing servicedDate',
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
        CoverageDetail: 'Missing CoverageDetail',
        rewardsAwarded: 'Missing rewards Awarded'
    }
})

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: 'ignore'
            },
            validate: {
                options: {
                    abortEarly: false
                }
            }
        }
    })

    const swaggerOptions = {
        info: {
            title: 'API Documentation',
            version: Pack.version
        },
        basePath: '/',
        documentationPath: '/docs',
        cors: true
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
                try {
                    let status = false
                    const res = await util.getAllDetails(params.user)
                    if (res) {
                        status = true
                    }

                    return h.response({ userId: res, success: status })
                } catch (err) {
                    return Boom.tooManyRequests('Try again!')
                }
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
                try {
                    const res = await util.addService(payload)
                    return h.response({ success: true })
                } catch (err) {
                    return Boom.tooManyRequests('Try again!')
                }
            },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    carID: Joi.string().required(),
                    serviceNo: Joi.string().required(),
                    serviceType: Joi.string().required(),
                    servicedDate: Joi.string().required(),
                    milesSchedule: Joi.string().required(),
                    daysSchedule: Joi.string().required(),
                    milesActuals: Joi.string().required(),
                    daysActuals: Joi.string().required(),
                    serviceFlag: Joi.string().required(),
                    repairAmount: Joi.string().required(),
                    description: Joi.string().required(),
                    rewardsAwarded: Joi.string().required()
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
                try {
                    const res = await util.addInsurance(payload)
                    return h.response({ success: true })
                } catch (err) {
                    return Boom.tooManyRequests('Try again!')
                }
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
                try {
                    const res = await util.addUser(payload)
                    return h.response({ userID: res, success: true })
                } catch (err) {
                    return Boom.tooManyRequests('Try again!')
                }
            },
            validate: {
                payload: {
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    regionCode: Joi.string().required()
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
                try {
                    const res = await util.addCar(payload)
                    return h.response({ carID: res, success: true })
                } catch (err) {
                    return Boom.tooManyRequests('Try again!')
                }
            },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    brand: Joi.string().required(),
                    modelCode: Joi.string().required(),
                    modelName: Joi.string().required(),
                    carMake: Joi.string().required(),
                    carRegistrationNo: Joi.string().required(),
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

    server.route({
        method: 'PUT',
        path: '/car/update',
        options: {
            handler: async (request, h) => {
                const payload = request.payload
                try {
                    const res = await util.updateBuyBackValue(payload)
                    return h.response({ carID: res, success: true })
                } catch (err) {
                    return Boom.tooManyRequests('Try again!')
                }
            },
            validate: {
                payload: {
                    userID: Joi.string().required(),
                    carID: Joi.string().required(),
                    buybackValue: Joi.string().required()
                },
                failAction: Relish.failAction
            },
            tags: ['api'],
            description: 'Add a new car'
        }
    })

    // server.route({
    //     method: 'POST',
    //     path: '/test',
    //     options: {
    //         handler: async (request, h) => {
    //             return h.response({ message: 'Post method success' })
    //         },
    //         tags: ['api'],
    //         description: 'Sample post'
    //     }
    // })
    //
    // server.route({
    //     method: 'GET',
    //     path: '/test',
    //     options: {
    //         handler: async (request, h) => {
    //             return h.response({ message: 'GET success' })
    //         },
    //
    //         tags: ['api'],
    //         description: 'Sample GET'
    //     }
    // })

    await server.start()
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
})

init()
