import type { NextFunction, Request, Response } from 'express'
import type { IServerResponse } from '../types'
import { Logger } from 'borgen'
import { HttpStatusCode } from 'axios'
import { verifyJwtToken } from '../utils/utils'

// Cooke name = _ht010usr
export const userAuth = async (
	req: Request,
	res: Response<IServerResponse>,
	next: NextFunction
) => {
	try {
		let cookie = req.cookies._ht010usr

		if (!cookie) {
			return res.status(HttpStatusCode.Unauthorized).json({
				status: 'error',
				message: 'Please login and try again!',
				data: null
			})
		}

		let decoded = verifyJwtToken(cookie)

		if (decoded.status === 'error') {
			return res.status(HttpStatusCode.Unauthorized).json({
				status: 'error',
				message: 'Unauthorized',
				data: null
			})
		}

		// Set user id
		res.locals.userId = decoded.data.token

		next()
	} catch (err) {
		Logger.error({ message: 'Error Authenticating user: ' + err })

		res.status(HttpStatusCode.InternalServerError).json({
			status: 'error',
			message: 'Error Authenticating User',
			data: null
		})
	}
}
