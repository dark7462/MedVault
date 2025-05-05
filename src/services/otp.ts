/**
 * Represents the expected input for generating an OTP.
 */
export interface GenerateOtpRequest {
  username: string;
}

/**
 * Represents the expected response after generating an OTP.
 */
export interface GenerateOtpResponse {
  /**
   * The generated One-Time Password.
   * In a real system, this might not be returned directly to the caller
   * if sent via SMS/Email, but included here for simulation.
   */
  otp: string;
  /**
   * A message indicating the result (e.g., "OTP sent to registered device").
   */
  message: string;
}

/**
 * Represents the expected input for verifying an OTP.
 */
export interface VerifyOtpRequest {
  username: string;
  otp: string;
}

/**
 * Represents the expected response after verifying an OTP.
 */
export interface VerifyOtpResponse {
  /**
   * Boolean indicating if the OTP verification was successful.
   */
  isValid: boolean;
  /**
   * A message indicating the result (e.g., "OTP verified successfully" or "Invalid OTP").
   */
  message: string;
   /**
    * Session token if verification is successful (optional).
    */
   token?: string;
}


// Store mock OTPs temporarily (in a real app, this is handled by the backend)
const mockOtps: { [username: string]: { otp: string, expires: number } } = {};

/**
 * Asynchronously generates a One-Time Password (OTP) for temporary access.
 * MOCK IMPLEMENTATION.
 *
 * @param username The username for whom to generate the OTP.
 * @returns A promise that resolves to the generated OTP as a string.
 */
export async function generateOtp(username: string): Promise<string> {
  // TODO: Replace with actual API call to backend OTP generation service.
  console.log(`MOCK: Generating OTP for ${username}`);

  // Generate a simple 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the mock OTP with a short expiry (e.g., 5 minutes)
  mockOtps[username] = {
      otp: generatedOtp,
      expires: Date.now() + 5 * 60 * 1000 // Expires in 5 minutes
  };

  console.log(`MOCK: OTP for ${username} is ${generatedOtp}`);
  // In a real app, the backend would send this via SMS/Email and might not return it here.
  return generatedOtp;
}

/**
 * Asynchronously verifies the provided One-Time Password (OTP) for a given username.
 * MOCK IMPLEMENTATION.
 *
 * @param username The username for whom the OTP was generated.
 * @param otp The One-Time Password to verify.
 * @returns A promise that resolves to true if the OTP is valid for the username, false otherwise.
 */
export async function verifyOtp(username: string, otp: string): Promise<boolean> {
  // TODO: Replace with actual API call to backend OTP verification service.
  console.log(`MOCK: Verifying OTP ${otp} for ${username}`);

  const storedOtpData = mockOtps[username];

  if (!storedOtpData) {
      console.log(`MOCK: No OTP found for ${username}`);
      return false; // No OTP generated for this user
  }

  if (Date.now() > storedOtpData.expires) {
      console.log(`MOCK: OTP for ${username} has expired`);
       delete mockOtps[username]; // Clean up expired OTP
      return false; // OTP expired
  }

  if (storedOtpData.otp === otp) {
      console.log(`MOCK: OTP ${otp} for ${username} is valid`);
       delete mockOtps[username]; // OTP is single-use, remove after successful verification
      return true; // OTP matches
  }

  console.log(`MOCK: Invalid OTP ${otp} provided for ${username}. Expected ${storedOtpData.otp}`);
  // Optional: Implement rate limiting or attempt tracking on the backend
  return false; // OTP does not match
}
