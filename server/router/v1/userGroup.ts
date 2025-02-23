import { Router } from 'express'
import { userAuth } from '../../middleware/userAuth'
import { adminAuth } from '../../middleware/adminAuth'
import { adminUserAuth } from '../../middleware/useradminAuth'
import * as UserController from '../../controllers/user.Controller'

const router = Router()

// User routes
router.post('/', UserController.createUser)
router.post('/login', adminAuth, UserController.loginUser)
router.get('/', adminAuth, UserController.getUser)
router.put('/', adminAuth, UserController.updateUser)
router.put('/phone', adminUserAuth, UserController.updateUserPhone)
router.get('/logout', UserController.logoutUser)
router.get('/all', adminAuth, UserController.getAllUsers)
router.delete('/', adminAuth, UserController.deleteUser)
router.get('/search', adminAuth, UserController.searchUser)

export default router
