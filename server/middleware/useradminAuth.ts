import { NextFunction, Request, Response } from 'express'
import { IServerResponse } from '../types'
import { Logger } from 'borgen'
import { HttpStatusCode } from 'axios'
import { verifyJwtToken } from '../utils/utils'

export const adminUserAuth = async (
  req: Request,
  res: Response<IServerResponse>,
  next: NextFunction,
) => {
  try {
    let usrCookie = req.cookies._ht010usr

    let admCookie = req.cookies._ht010adm

    if (!admCookie && !usrCookie) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: 'error',
        message: 'Please login and try again!',
        data: null,
      })
    }

    if (admCookie) {
      // Admin
      let admDecoded = verifyJwtToken(admCookie)

      if (admDecoded.status === 'error') {
        return res.status(HttpStatusCode.Unauthorized).json({
          status: 'error',
          message: 'Unauthorized',
          data: null,
        })
      }

      // Set admin id
      res.locals.userId = admDecoded.data.token
      res.locals.isAdmin = true

      next()
    } else {
      // User
      let decoded = verifyJwtToken(usrCookie)

      if (decoded.status === 'error') {
        return res.status(HttpStatusCode.Unauthorized).json({
          status: 'error',
          message: 'Unauthorized',
          data: null,
        })
      }

      // Set user id
      res.locals.userId = decoded.data.token
      res.locals.isAdmin = false

      next()
    }
  } catch (err) {
    Logger.error({ message: 'Error Authenticating user: ' + err })

    res.status(HttpStatusCode.InternalServerError).json({
      status: 'error',
      message: 'Error Authenticating User',
      data: null,
    })
  }
}
