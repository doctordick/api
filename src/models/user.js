import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto'

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

userSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.encrypt = function(text) {
  var cipher = crypto.createCipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

userSchema.statics.decrypt = function(text) {
  var decipher = crypto.createDecipher(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}


export default mongoose.model('User', userSchema);
