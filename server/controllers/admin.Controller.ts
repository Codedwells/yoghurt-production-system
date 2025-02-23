import bcrypt from 'bcrypt'
import { Logger } from 'borgen'
import { HttpStatusCode } from 'axios'
import { Config } from '../utils/config'
import type { IServerResponse } from '../types'
import type { Request, Response } from 'express'
import Admin, { AdminRole } from '../models/admin.model'
import { signJwtToken, verifyJwtToken } from '../utils/utils'

let isProduction = Config.NODE_ENV === 'production'

// Create a new admin
// @route POST /api/v1/admin
export const createAdmin = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { name, email, password } = req.body
	try {
		if (!name || !email || !password) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		// Check if admin exists
		let admin = await Admin.findOne({ email })

		if (admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin already exists',
				data: null
			})
		}

		let hashedPassword = await bcrypt.hash(password, 10)

		let newAdmin = new Admin({
			name,
			email,
			password: hashedPassword
		})

		let savedUser = await newAdmin.save()

		// Set up auth token
		let signedToken = signJwtToken({
			payload: savedUser.id,
			expiresIn: '7d'
		})
		if (signedToken.status === 'error') {
			return res.status(HttpStatusCode.InternalServerError).json({
				status: 'error',
				message: 'Error creating admin',
				data: null
			})
		}

		// Set cookie
		res.cookie('_dp010adm', signedToken.data.token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: isProduction,
			httpOnly: isProduction
		})

		res.status(HttpStatusCode.Created).json({
			status: 'success',
			message: 'Admin created successfully',
			data: savedUser
		})
	} catch (err) {
		Logger.error({ message: 'Error creating admin' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error creating admin',
			data: null
		})
	}
}

// Login a admin
// @route POST /api/v1/admin/login
export const loginAdmin = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { email, password } = req.body
	try {
		if (!email || !password) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		// Check if admin exists
		let admin = await Admin.findOne({ email })

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Invalid credentials',
				data: null
			})
		}

		let isMatch = await bcrypt.compare(password, admin.password)

		if (!isMatch) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Invalid credentials',
				data: null
			})
		}

		// Set up auth token
		let signedToken = signJwtToken({
			payload: admin.id,
			expiresIn: '7d'
		})
		if (signedToken.status === 'error') {
			return res.status(HttpStatusCode.InternalServerError).json({
				status: 'error',
				message: 'Error logging in.Please try again!',
				data: null
			})
		}

		admin.lastLogin = new Date()
		await admin.save()

		// Set cookie
		res.cookie('_dp010adm', signedToken.data.token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: isProduction,
			httpOnly: isProduction
		})

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Admin logged in successfully',
			data: admin
		})
	} catch (err) {
		Logger.error({ message: 'Error logging in admin' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error logging in admin',
			data: null
		})
	}
}

// Logout admin
// @route GET /api/v1/admin/logout
// @access Admin
export const logOut = async (_: Request, res: Response<IServerResponse>) => {
	res.clearCookie('_dp010adm')

	res.status(HttpStatusCode.Ok).json({
		status: 'success',
		message: 'Admin logged out successfully',
		data: null
	})
}

// Search for admin using email or name
// @route GET /api/v1/admin/search/?term=search_term
// @access Admin
export const searchAdmin = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { term } = req.query

	try {
		if (!term) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter a search term',
				data: null
			})
		}

		// Perform a case-insensitive partial match search using regex for both email and name
		let admin = await Admin.findOne({
			$or: [
				{ email: { $regex: term, $options: 'i' } },
				{ name: { $regex: term, $options: 'i' } }
			]
		})

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin not found',
				data: null
			})
		}

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Admin found',
			data: admin
		})
	} catch (err) {
		Logger.error({ message: 'Error searching admin: ' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error searching admin',
			data: null
		})
	}
}
// Update admin details
// @route PUT /api/v1/admin/?id=user_id
export const updateAdmin = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	try {
		const { name, email, password } = req.body
		const { id } = req.query

		let admin = await Admin.findById(id)

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin not found',
				data: null
			})
		}

		let hashedPassword = await bcrypt.hash(password, 10)

		admin.name = name
		admin.email = email
		admin.password = hashedPassword

		let updatedAdmin = await admin.save()

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Admin updated successfully',
			data: updatedAdmin
		})
	} catch (err) {
		Logger.error({ message: 'Error updating admin' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error updating admin',
			data: null
		})
	}
}

// Get admin details
// @route GET /api/v1/admin/?id=user_id
export const getAdmin = async (
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

		let admin = await Admin.findById(id)

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin not found',
				data: null
			})
		}

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Admin found',
			data: admin
		})
	} catch (err) {
		Logger.error({ message: 'Error getting admin' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error getting admin',
			data: null
		})
	}
}

// Refresh admin access from cookie
// @route GET /api/v1/admin/refresh
export const refreshAdmin = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	try {
		let cookie = req.cookies._dp010adm

		if (!cookie) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please login',
				data: null
			})
		}

		let decoded = verifyJwtToken(cookie)

		if (decoded.status === 'error') {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Invalid token',
				data: null
			})
		}

		// Get admin
		let admin = await Admin.findById(decoded.data.token)

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin not found',
				data: null
			})
		}

		admin.lastLogin = new Date()
		await admin.save()

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Admin access refreshed',
			data: admin
		})
	} catch (err) {
		Logger.error({ message: 'Error refreshing admin' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error refreshing admin',
			data: null
		})
	}
}

// Logout admin
// @route GET /api/v1/admin/logout
export const logoutAdmin = async (
	_: Request,
	res: Response<IServerResponse>
) => {
	res.clearCookie('_dp010adm')

	res.status(HttpStatusCode.Ok).json({
		status: 'success',
		message: 'Admin logged out successfully',
		data: null
	})
}

// Get all users
// @route GET /api/v1/admin/all/?page=page_number&limit=limit_number
export const getAllAdmin = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	try {
		const { page, limit } = req.query

		if (!page || !limit) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please provide a page and limit',
				data: null
			})
		}

		const totalAdmins = await Admin.countDocuments()

		let admins = await Admin.find()
			.skip((+page - 1) * +limit)
			.limit(+limit)
			.sort({ createdAt: -1 })

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Users found',
			data: {
				page: +page,
				count: totalAdmins,
				admins
			}
		})
	} catch (err) {
		Logger.error({ message: 'Error getting all users' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error getting all users',
			data: null
		})
	}
}

// Update admin password
// @route PUT /api/v1/admin/password
// @access Admin
export const updateAdminPassword = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { password, newPassword } = req.body

	try {
		if (!password || !newPassword) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		let admin = await Admin.findById(res.locals.userId)

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin not found',
				data: null
			})
		}

		let isMatch = await bcrypt.compare(password, admin.password)

		if (!isMatch) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Invalid password',
				data: null
			})
		}

		let hashedPassword = await bcrypt.hash(newPassword, 10)

		admin.password = hashedPassword
		await admin.save()

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Password updated successfully',
			data: null
		})
	} catch (err) {
		Logger.error({ message: 'Error updating password' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error updating password',
			data: null
		})
	}
}

// Update admin role
// @route PUT /api/v1/admin/role
// @access Admin
export const updateAdminRole = async (
	req: Request,
	res: Response<IServerResponse>
) => {
	const { role, id } = req.body

	try {
		if (!role || !id) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Please enter all fields',
				data: null
			})
		}

		let admin = await Admin.findById(id)

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin not found',
				data: null
			})
		}

		admin.role = role == 'super' ? AdminRole.Super : AdminRole.Admin
		await admin.save()

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Role updated successfully',
			data: null
		})
	} catch (err) {
		Logger.error({ message: 'Error updating role' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error updating role',
			data: null
		})
	}
}

// Delete admin
// @route DELETE /api/v1/admin/?id=user_id
export const deleteAdmin = async (
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

		let adminCount = await Admin.countDocuments()

		if (adminCount === 1) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Cannot delete the last admin',
				data: null
			})
		}

		let admin = await Admin.findByIdAndDelete(id)

		if (!admin) {
			return res.status(HttpStatusCode.BadRequest).json({
				status: 'error',
				message: 'Admin not found',
				data: null
			})
		}

		res.status(HttpStatusCode.Ok).json({
			status: 'success',
			message: 'Admin deleted successfully',
			data: null
		})
	} catch (err) {
		Logger.error({ message: 'Error deleting admin' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error deleting admin',
			data: null
		})
	}
}
