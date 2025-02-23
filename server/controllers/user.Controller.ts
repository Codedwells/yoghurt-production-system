import { Logger } from 'borgen'
import User from '../models/user.model'
import axios, { HttpStatusCode } from 'axios'
import type { IServerResponse } from '../types'
import type { Request, Response } from 'express'
import SiteSettings from '../models/settings.model'
import { signJwtToken, verifyJwtToken } from '../utils/utils'
import { Config } from '../utils/config'
import bcrypt from 'bcrypt'

let isProduction = Config.NODE_ENV === 'production'

// Create a new user
export async function loginOauth({
	name,
	email,
    loginid
}: {
	name: string
	email: string
    loginid:string
}): Promise<IServerResponse> {
	try {
		if (!name || !email || !loginid) {
			return {
				status: 'error',
				message: 'Please enter all fields',
				data: null
			}
		}

		// Check if user exists
		let user = await User.findOne({ email })
		let settings = await SiteSettings.findOne()

		if (!settings) {
			return {
				status: 'error',
				message: 'Error fetching site settings',
				data: null
			}
		}

		if (user) {
			// Set up auth token
			let signedToken = signJwtToken({
				payload: user.id,
				expiresIn: '7d'
			})
			if (signedToken.status === 'error') {
				return {
					status: 'error',
					message: 'Error logging you in.Please try again!',
					data: null
				}
			}

			user.lastLogin = new Date()
			let updatedUser = await user.save()

			return {
				status: 'success',
				message: 'Login successful!',
				data: {
					user: updatedUser,
					phone: user.phone,
					token: signedToken.data.token
				}
			}
		}

		if (settings?.allowSignup === false) {
			return {
				status: 'error',
				message:
					"We're not accepting new users at the moment. Please try again later.",
				data: null
			}
		}

		let newUser = new User({
			name,
			email,
			image: '',
            loginid,
		})

		let savedUser = await newUser.save()

		// Set up auth token
		let signedToken = signJwtToken({
			payload: savedUser.id,
			expiresIn: '30d'
		})
		if (signedToken.status === 'error') {
			return {
				status: 'error',
				message: 'Error creating user',
				data: null
			}
		}

		return {
			status: 'success',
			message: 'Account created successfully',
			data: {
				user: savedUser,
				phone: savedUser.phone,
				token: signedToken
			}
		}
	} catch (err) {
		return {
			status: 'error',
			message: 'Error creating user',
			data: null
		}
	}
}

// Create a new user
// @route POST /api/v1/user
export const createUser = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { name, email, password } = req.body
	try {
		// Check if user exists
		let user = await User.findOne({ email })
		let settings = await SiteSettings.findOne()

		if (user) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Account already exists. Please login!',
				data: null
			})
		}

		if (!settings) {
			return res.status(HttpStatusCode.InternalServerError).json({
				status: 'error',
				message: 'Error fetching site settings',
				data: null
			})
		}

		if (settings?.allowSignup === false) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message:
					"We're not accepting new users at the moment. Please try again later.",
				data: null
			})
		}

		let hashedPassword = await bcrypt.hash(password, 10)

		let newUser = new User({
			name,
			email,
			password: hashedPassword
		})

		let savedUser = await newUser.save()

		// Set up auth token
		let signedToken = signJwtToken({
			payload: savedUser.id,
			expiresIn: '7d'
		})
		if (signedToken.status === 'error') {
			return res.status(HttpStatusCode.InternalServerError).json({
				status: 'error',
				message: 'Error creating user',
				data: null
			})
		}

		// Set cookie
		res.cookie('_dp010usr', signedToken.data.token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: isProduction,
			httpOnly: isProduction
		})

		res.status(HttpStatusCode.Created).json({
			status: 'success',
			message: 'Account created successfully',
			data: {
				user: savedUser
			}
		})
	} catch (err) {
		Logger.error({ message: 'Error creating user' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error creating user',
			data: null
		})
	}
}

// Login a user
// @route POST /api/v1/user/login
export const loginUser = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { email } = req.body
	try {
		if (!email) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		// Check if user exists
		let user = await User.findOne({ email })

		if (!user) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Invalid username or password',
				data: null
			})
		}

		user.lastLogin = new Date()
		await user.save()

		// Set up auth token
		let signedToken = signJwtToken({
			payload: user.id,
			expiresIn: '7d'
		})
		if (signedToken.status === 'error') {
			return res.status(HttpStatusCode.InternalServerError).json({
				status: 'error',
				message: 'Error logging in.Please try again!',
				data: null
			})
		}

		// Set cookie
		res.cookie('_dp010usr', signedToken.data.token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: isProduction,
			httpOnly: isProduction
		})

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'User logged in successfully',
			data: {
				user,
				token: signedToken
			}
		})
	} catch (err) {
		Logger.error({ message: 'Error logging in user' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error logging in user',
			data: null
		})
	}
}

// Update user phone
// @route PUT /api/v1/user/phone
export const updateUserPhone = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { phone } = req.body
	const userId = res.locals.userId

	try {
		if (!phone) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Missing phone',
				data: {
					body: {
						phone: 'string'
					}
				}
			})
		}

		let user = await User.findByIdAndUpdate(
			userId,
			{ phone },
			{ new: true }
		)

		if (!user) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'User not found',
				data: null
			})
		}

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'User updated successfully',
			data: {
				phone: user.phone
			}
		})
	} catch (err) {
		Logger.error({ message: 'Error updating phone' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error updating phone',
			data: null
		})
	}
}

// Update user details
// @route PUT /api/v1/user/?id=user_id
export const updateUser = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	try {
		const { id } = req.query
		const { name, email } = req.body

		let user = await User.findById(id)

		if (!user) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'User not found',
				data: null
			})
		}

		if (name) user.name = name
		if (email) user.email = email

		let updatedUser = await user.save()

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'User updated successfully',
			data: updatedUser
		})
	} catch (err) {
		Logger.error({ message: 'Error updating user' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error updating user',
			data: null
		})
	}
}

// Get user details
// @route GET /api/v1/user/?id=user_id
export const getUser = async (req: Request, res: Response<IServerResponse>) => {
	const { id } = req.query
	try {
		if (!id) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		let user = await User.findById(id)

		if (!user) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'User not found',
				data: null
			})
		}

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'User found',
			data: user
		})
	} catch (err) {
		Logger.error({ message: 'Error getting user' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error getting user',
			data: null
		})
	}
}

// Logout user
// @route GET /api/v1/user/logout
export const logoutUser = async (
	_: Request,
	res: Response<IServerResponse>
) => {
	res.clearCookie('_dp010usr')

	res.status(HttpStatusCode.Ok).json({
		status: 'success',
		message: 'User logged out successfully',
		data: null
	})
}

// Get all users
// @route GET /api/v1/user/all/?page=1&limit=10
export const getAllUsers = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10
		const skip = (page - 1) * limit

		const [users, totalUsers] = await Promise.all([
			User.find().skip(skip).limit(limit),
			User.countDocuments()
		])

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Users found',
			data: {
				users,
				totalUsers,
				page
			}
		})
	} catch (err) {
		Logger.error({ message: 'Error getting all users: ' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error getting all users',
			data: null
		})
	}
}
// Search for a user by email or id
// @route GET /api/v1/user/search?type=name&term=user_email
// @access Admin
export const searchUser = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { type, term } = req.query
	try {
		if ((type !== 'email' && type !== 'id') || !term) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		let user
		if (type === 'id') {
			user = await User.findOne({ id: term })
		} else {
			user = await User.findOne({
				$or: [
					{ email: { $regex: term, $options: 'i' } },
					{ name: { $regex: term, $options: 'i' } }
				]
			})
		}

		if (!user) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'User not found',
				data: null
			})
		}

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'User found',
			data: user
		})
	} catch (err) {
		Logger.error({ message: 'Error searching user' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error searching user',
			data: null
		})
	}
}

// Delete user
// @route DELETE /api/v1/user/?id=user_id
export const deleteUser = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { id } = req.query
	try {
		if (!id) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		let user = await User.findByIdAndDelete(id)

		if (!user) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'User not found',
				data: null
			})
		}

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'User deleted successfully',
			data: null
		})
	} catch (err) {
		Logger.error({ message: 'Error deleting user' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error deleting user',
			data: null
		})
	}
}
