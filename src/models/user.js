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

userSchema.methods.generateHash = (password) => {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = (password) => {  
  return bcrypt.compareSync(password, this.localAuth.password);
};

export default mongoose.model('User', userSchema);
