import { Logger } from 'borgen'
import { verifyJwtToken } from '../utils/utils'
import type { IServerResponse } from '../types'
import type { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from 'axios'

// Cookie name = _ht010adm
export const adminAuth = async (
  req: Request,
  res: Response<IServerResponse>,
  next: NextFunction,
) => {
  try {
    let cookie = req.cookies._ht010adm

    if (!cookie) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: 'error',
        message: 'Please login and try again!',
        data: null,
      })
    }

    let decoded = verifyJwtToken(cookie)

    if (decoded.status === 'error') {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: 'error',
        message: 'Unauthorized',
        data: null,
      })
    }

    // Set admin id
    res.locals.userId = decoded.data.token

    next()
  } catch (err) {
    Logger.error({ message: 'Error Authenticating admin: ' + err })

    res.status(HttpStatusCode.InternalServerError).json({
      status: 'error',
      message: 'Error Authenticating Admin',
      data: null,
    })
  }
}
