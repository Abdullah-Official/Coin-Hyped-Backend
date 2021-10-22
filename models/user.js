const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   name: {
       type: String,
       required: true
   },
   email:{
       type: String,
       required: true
   },
   password: {
       type: String,
       required: true
   },
   confirmPassword: {
       type:String,
       required: true
   },
   coins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coin",
      required: true,
    },
  ],
})
userSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true,
})
exports.User = mongoose.model('User', userSchema);

