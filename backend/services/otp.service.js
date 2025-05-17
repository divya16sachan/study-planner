import { Otp } from '../models/otp.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from './sendEmail.js';

export const sendOtp = async ({ email, purpose, subject, messageTemplate }) => {
  const existingOtp = await Otp.findOne({ email, purpose });
  const now = new Date();

  if (existingOtp && now - existingOtp.lastSentAt < 60 * 1000) {
    throw new Error('OTP already sent. Please wait a minute.');
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  const minutes = 10;
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
  if (!otpRecord) throw new Error('Please request OTP first');

  const now = new Date();
  if (now > otpRecord.expiresAt) throw new Error('OTP has expired');

  const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isOtpValid) throw new Error('Invalid OTP');

  await Otp.deleteOne({ email, purpose });
  return true;
};
