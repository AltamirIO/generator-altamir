import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'
import { isEmail } from 'validator'

const saltRounds = 10

// https://stackoverflow.com/a/45681030
export interface IUserDocument extends mongoose.Document {
  email: string
  password: string
}

export interface IUser extends IUserDocument {
  // instance methods
  verifyPassword(passwordToVerify: string): boolean
}

interface IUserModel extends mongoose.Model<IUser> {
  // static methods
}

export const UserSchema: mongoose.Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [isEmail, 'Please fill a valid email address'],
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
}, { timestamps: true })

// https://stackoverflow.com/a/45675548
UserSchema.method('verifyPassword', function(passwordToVerify: string): boolean {
  // could be done async
  return bcrypt.compareSync(passwordToVerify, this.password)
})

/**
 * Hash the password field if it has been modified or if it is a new user object.
 * This means that passwords should always be .save()'d as plaintext passwords.
 * https://github.com/Automattic/mongoose/issues/5046#issuecomment-412114160
 */
UserSchema.pre<IUserDocument>('save', function(next) {
  if (!this.isModified('password')) { return next() }

  bcrypt.hash(this.password, saltRounds, (err, hash: string) => {
    if (err) { return next(err) }
    this.password = hash
    next()
  })
})

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema)
export default User
