import mongoose from 'mongoose'
import { Logger } from 'borgen'
import { Config } from '../utils/config'
import seedDatabase from './seedDb'

mongoose.set('strictQuery', true)

const connectDb = (server: () => void): void => {
	mongoose
		.connect(Config.MONGO_URI)
		.then(() => {
			let isInitialized = seedDatabase()

			if (isInitialized) {
				server()
			} else {
				process.exit(1)
			}
		})
		.catch((err) => {
			Logger.error({ message: 'connectDb' + err.message })
			console.log(err)
		})
}

export default connectDb
