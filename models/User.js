const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ORG_ADMIN'],
      required: true
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
