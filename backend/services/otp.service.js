import { Otp } from '../models/otp.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from './sendEmail.js';

export const sendOtp = async ({ email, purpose, subject, messageTemplate }) => {
  const existingOtp = await Otp.findOne({ email, purpose });
  const now = new Date();

  if (existingOtp && now - existingOtp.lastSentAt < 60 * 1000) {
    const error = new Error('OTP already sent. Please wait a minute.');
    error.status = 429;
    throw error;
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  const minutes = 15;
  const expiresAt = new Date(now.getTime() + minutes * 60 * 1000);

  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      otp: hashedOtp,
      purpose,
      expiresAt,
      lastSentAt: now,
    },
    { upsert: true, new: true }
  );

  const message = messageTemplate(otpCode, minutes);
  await sendEmail(email, subject, message);
};

export const validateOtp = async ({ email, purpose, otp }) => {
  const otpRecord = await Otp.findOne({ email, purpose });
  if (!otpRecord) {
    const error = new Error('Please request OTP first');
    error.statusCode = 400; // Bad request
    throw error;
  }

  const now = new Date();
  if (now > otpRecord.expiresAt) {
    const error = new Error('OTP has expired');
    error.statusCode = 410; // Gone
    throw error;
  }

  const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isOtpValid) {
    const error = new Error('Invalid OTP');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  await Otp.deleteOne({ email, purpose });
  return true;
};

