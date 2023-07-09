function generateOTP(length) {
    const characters = '0123456789';
    let OTP = '';
  
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      OTP += characters[index];
    }
  
    return OTP;
  }
  
  // Generate a 6-digit OTP
  const otp = generateOTP(6);
  console.log('Generated OTP:', otp);
  
module.exports = generateOTP;