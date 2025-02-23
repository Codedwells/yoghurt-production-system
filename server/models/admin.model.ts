import { Document, Schema, model } from 'mongoose'

export enum AdminRole {
	Super = 'super',
	Admin = 'admin'
}

interface AdminDoc extends Document {
	email: string
	name: string
	password: string
	role: AdminRole
	lastLogin: Date
}

const AdminSchema: Schema = new Schema<AdminDoc>(
	{
		email: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		role: {
			type: String,
			enum: Object.values(AdminRole),
			default: AdminRole.Admin
		},
		lastLogin: {
			type: Date,
			default: Date.now()
		}
	},
	{
		timestamps: true
	}
)

const Admin = model<AdminDoc>('Admin', AdminSchema)

export default Admin
