export function mapAuthErrorMessage(message?: string | null): string {
  const raw = (message || "").toLowerCase();

  if (!raw) {
    return "Something went wrong. Please try again.";
  }

  if (
    raw.includes("invalid login credentials") ||
    raw.includes("invalid credentials")
  ) {
    return "Incorrect email or password.";
  }

  if (raw.includes("email not confirmed")) {
    return "Please confirm your email before logging in.";
  }

  if (
    raw.includes("user already registered") ||
    raw.includes("already been registered")
  ) {
    return "This email is already registered.";
  }

  if (raw.includes("password should be at least")) {
    return "Password must be at least 8 characters long.";
  }

  if (raw.includes("signup is disabled")) {
    return "Account registration is currently disabled.";
  }

  if (raw.includes("email rate limit exceeded")) {
    return "Too many attempts. Please wait a bit and try again.";
  }

  if (
    raw.includes("invalid refresh token") ||
    raw.includes("refresh token not found")
  ) {
    return "Your session expired. Please try again.";
  }

  if (
    raw.includes("otp expired") ||
    raw.includes("token has expired") ||
    raw.includes("expired")
  ) {
    return "This link has expired. Please request a new one.";
  }

  if (
    raw.includes("invalid token") ||
    raw.includes("token not found") ||
    raw.includes("jwt")
  ) {
    return "This link is invalid. Please request a new one.";
  }

  if (raw.includes("network request failed") || raw.includes("fetch failed")) {
    return "Network error. Check your internet connection and try again.";
  }

  return "Something went wrong. Please try again.";
}

export function validateEmail(email: string): {
  valid: boolean;
  message: string | null;
} {
  const value = email.trim();

  if (!value) {
    return { valid: false, message: "Email is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return { valid: false, message: "Enter a valid email address." };
  }

  return { valid: true, message: null };
}

export function validatePassword(password: string): {
  valid: boolean;
  message: string | null;
} {
  if (!password) {
    return { valid: false, message: "Password is required." };
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      valid: false,
      message: "Password must include at least 1 letter and 1 number.",
    };
  }

  return { valid: true, message: null };
}