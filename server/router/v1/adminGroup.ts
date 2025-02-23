import { Router } from 'express'
import { adminAuth } from '../../middleware/adminAuth'
import * as AdminController from '../../controllers/admin.Controller'

const router = Router()

// Admin routes
router.post('/', adminAuth, AdminController.createAdmin)
router.get('/', adminAuth, AdminController.getAdmin)
router.post('/login', AdminController.loginAdmin)
router.get("/logout", adminAuth, AdminController.logoutAdmin)
router.put('/', adminAuth, AdminController.updateAdmin)
router.put('/password', adminAuth, AdminController.updateAdminPassword)
router.get('/refresh', adminAuth, AdminController.refreshAdmin)
router.get('/logout', AdminController.logoutAdmin)
router.get('/all', adminAuth, AdminController.getAllAdmin)
router.delete('/', adminAuth, AdminController.deleteAdmin)
router.get('/search', adminAuth, AdminController.searchAdmin)
router.put('/role', adminAuth, AdminController.updateAdminRole)

export default router
