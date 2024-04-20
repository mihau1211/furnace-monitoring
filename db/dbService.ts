import { dbSource } from './dbSource'

dbSource.initialize().then().catch((err) => {
    console.log('Error during initialize Data Source: ', err)
})