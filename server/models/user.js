import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valide email',
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 7,
  },
  tokens: [
    {
      access: {
        type: String,
        require: true,
      },
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, 'abc123')
    .toString();

  user.tokens.push({ access, token });

  return user.save().then(() => token);
};

UserSchema.statics.findByToken = function(token) {
  const user = this;
  let decoded;
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return user.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = async function(email, password) {
  // to avoid problems with the const names, we are going to use this by it self
  const user = await this.findOne({ email });
  if (!user) return Promise.reject();
  try {
    // If we omitt the callback in bcrypt.compare, this will return a promise
    const pass = await bcrypt.compare(password, user.password);
    // If the compare was successful, we will get a true return
    if (pass) return user;
  } catch (error) {
    throw error;
  }
};

// middleware that will run some code before the event
UserSchema.pre('save', function(next) {
  const user = this;
  // to avoid hash a passwoard that was already hashed we can check if this was modified
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else next();
});

const User = mongoose.model('User', UserSchema);
export { User };
