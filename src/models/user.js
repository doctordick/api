import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: String,
  firstName: String,
  lastName: String,
  created: {
    type: Date,
    default: new Date()
  }
});

userSchema.methods.generateHash = function (password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {  
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('User', userSchema);
