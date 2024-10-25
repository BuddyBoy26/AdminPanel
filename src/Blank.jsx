// models/User.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

// Individual Details Subschema
const individualDetailsSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Others"],
    },
    DOB: {
      type: String,
      required: function () {
        return this.userType === "Individual";
      },
    },
    contactDetails: {
    //   phoneNumber: { type: String, required: true },
    //   email: { type: String, required: true, lowercase: true },
      address: { type: String, required: true },
      poBox: { type: String }, // Optional
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      IBAN: { type: String, required: true },
      swiftCode: { type: String, required: true },
    },
    passportDetails: {
      passportNumber: { type: String, required: true },
      placeOfIssue: { type: String, required: true },
      dateOfIssue: { type: Date, required: true },
      dateOfExpiry: { type: Date, required: true },
      passportCopy: { type: Buffer, required: true }, // PDF file
    },
    uniqueID: {
      country: { type: String, required: true },
      idNumber: { type: String, required: true },
      dateOfIssue: { type: Date, required: true },
    },
    nominee: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      contactDetails: {
        address: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        poBox: { type: String }, // Optional
      },
      passportCopy: { type: Buffer }, // PDF file, optional
    },
  },
  { _id: false }
);

// Company Details Subschema
const companyDetailsSchema = new mongoose.Schema(
  {
    // companyName: { type: String, required: true },
    tradeLicense: {
      number: { type: String, required: true },
      issueDate: { type: Date, required: true },
      expiryDate: { type: Date, required: true },
    //   placeOfEstablishment: { type: String, required: true },
      pdfCopy: { type: Buffer, required: true }, // PDF file
    },
    signingAuthorities: [
      {
        name: { type: String, required: true },
      },
    ],
    contactDetails: {
      pointOfContact: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      address: { type: String, required: true },
      poBox: { type: String }, // Optional
    },
    groupCompanies: {
      name: { type: String },
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      IBAN: { type: String, required: true },
      swiftCode: { type: String, required: true },
    },
    powerOfAttorney: {
    //   Yes or no 
        holderName: { type: String, required: true },
      contactDetails: {
        address: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        poBox: { type: String }, // Optional
      },
      pdfCopy: { type: Buffer }, // PDF file, optional
    },
  },
  { _id: false }
);

// Main User Schema
const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
    enum: ["Individual", "Company"],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      const phoneNumber = parsePhoneNumberFromString(value, "AE");
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error("Invalid phone number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain the word "password"');
      }
    },
  },
  tokens: [
    {
      type: String,
      required: true,
    },
  ],
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  agreedRoi: {
    type: Number, // ROI as a percentage (e.g., 5 for 5%)
    min: 0,
  },
  initialInvestmentValue: {
    type: Number,
    min: 0,
  },
  signedContract: {
    type: Buffer, // Buffer to store binary data (PDF file)
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  Address: {
    type: String,
    required: true,
  },
  lastUpdateDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    unique: true,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  // NoofTrips: {
  //   type: Number,
  //   default: 0,
  // },
  TicketSize: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  individualDetails: {
    type: individualDetailsSchema,
    required: function () {
      return this.userType === "Individual";
    },
  },
  companyDetails: {
    type: companyDetailsSchema,
    required: function () {
      return this.userType === "Company";
    },
  },
});

// Adding indexes to improve query performance
userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });

// Pre-save middleware to generate userId
userSchema.pre("save", async function (next) {
  if (!this.userId) {
    this.userId = "U" + crypto.randomBytes(4).toString("hex").toUpperCase();
  }
  next();
});

// Virtuals
userSchema.virtual("assets", {
  ref: "Asset",
  localField: "userId",
  foreignField: "owner",
});

// Conditional Validation
userSchema.pre("validate", function (next) {
  if (this.userType === "Individual") {
    if (!this.individualDetails) {
      this.invalidate("individualDetails", "Individual details are required.");
    }
  } else if (this.userType === "Company") {
    if (!this.companyDetails) {
      this.invalidate("companyDetails", "Company details are required.");
    }
  }
  next();
});

// Ensure virtual fields are serialized when converted to JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Instance Methods
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
};

// Static Methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Account with given email/password does not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Account with given email/password does not exist");
  }
  return user;
};

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Pre-remove middleware
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
