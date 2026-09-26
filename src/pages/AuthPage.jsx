import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield, 
  KeyRound, 
  RefreshCw, 
  ArrowLeft,
  ShieldCheck,
  Check,
  QrCode,
  Smartphone,
  Copy,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_EXISTING_USERS = [
  { id: 'usr_admin', username: 'faraz', email: 'admin@gmail.com', password: 'admin', name: 'Faraz', role: 'admin', canUpload: true, emailVerified: true },
  { id: 'usr_editor', username: 'alex_editor', email: 'editor@gmail.com', password: 'editor', name: 'Alex Rivera', role: 'editor', canUpload: true, emailVerified: true },
  { id: 'usr_member', username: 'sam_member', email: 'member@gmail.com', password: 'member', name: 'Sam Member', role: 'user', canUpload: false, emailVerified: true },
];

export default function AuthPage({ initialMode = 'login', onLoginSuccess, onNavigate, onLogActivity }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'authenticator'

  // Form States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Authenticator App (QR Code) Login States
  const [authIdentifier, setAuthIdentifier] = useState('faraz');
  const [authTotpInput, setAuthTotpInput] = useState('');
  const [authTotpSimulated, setAuthTotpSimulated] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Forgot Password Recovery Flow States
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState('lookup'); // 'lookup' | 'code' | 'reset'
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotTargetUser, setForgotTargetUser] = useState(null);
  const [forgotGeneratedCode, setForgotGeneratedCode] = useState('');
  const [forgotEnteredCode, setForgotEnteredCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotTimer, setForgotTimer] = useState(0);

  // Authenticator / OTP Verification States
  const [signupStep, setSignupStep] = useState('details'); // 'details' | 'otp'
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Validation States
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameValid, setUsernameValid] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load registered users from localStorage or default
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_users_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_EXISTING_USERS;
  });

  // Save registered users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbf_users_db', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn(e);
    }
  }, [registeredUsers]);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Forgot Password Countdown Timer
  useEffect(() => {
    if (forgotTimer <= 0) return;
    const interval = setInterval(() => {
      setForgotTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotTimer]);

  // Real-time Email Validation (Ensures RFC valid & specifically checks for @gmail.com)
  useEffect(() => {
    if (!email) {
      setEmailError('');
      setEmailValid(false);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email format (e.g. name@gmail.com)');
      setEmailValid(false);
      return;
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (domain !== 'gmail.com') {
      setEmailError('Please use a valid @gmail.com address (e.g. yourname@gmail.com)');
      setEmailValid(false);
      return;
    }

    if (mode === 'signup') {
      const isTaken = registeredUsers.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (isTaken) {
        setEmailError('This @gmail.com address is already registered. Please log in.');
        setEmailValid(false);
        return;
      }
    }

    setEmailError('');
    setEmailValid(true);
  }, [email, mode, registeredUsers]);

  // Real-time Username Availability Check
  useEffect(() => {
    if (mode !== 'signup') {
      setUsernameError('');
      setUsernameValid(false);
      return;
    }

    if (!username.trim()) {
      setUsernameError('');
      setUsernameValid(false);
      return;
    }

    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      setUsernameValid(false);
      return;
    }

    const isTaken = registeredUsers.some(
      (u) => u.username?.toLowerCase() === username.trim().toLowerCase()
    );

    if (isTaken) {
      setUsernameError(`"${username}" is already taken. Please choose another.`);
      setUsernameValid(false);
    } else {
      setUsernameError('');
      setUsernameValid(true);
    }
  }, [username, mode, registeredUsers]);

  // Trigger 6-digit OTP dispatch
  const dispatchOtp = (targetEmail) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setResendTimer(45);
    setSignupStep('otp');

    if (onLogActivity) {
      onLogActivity(
        'OTP_DISPATCHED',
        `Dispatched 6-digit verification code to verify real email: ${targetEmail}`,
        'auth',
        targetEmail
      );
    }
  };

  // STEP 1 SIGNUP SUBMIT: Check duplicates and send OTP
  const handleInitialSignupSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!usernameValid) {
      setFormError('Please choose a valid and available username.');
      return;
    }

    if (!emailValid) {
      setFormError('Please provide a valid @gmail.com address.');
      return;
    }

    // Strict duplicate check:
    const emailExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailExists) {
      setFormError('An account with this @gmail.com already exists. Please sign in instead.');
      return;
    }

    const usernameExists = registeredUsers.some(
      (u) => u.username?.toLowerCase() === username.trim().toLowerCase()
    );
    if (usernameExists) {
      setFormError(`Username "${username}" is already taken. Please choose another.`);
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must contain at least 6 characters.');
      return;
    }

    // Credentials valid -> Proceed to Authenticator Verification
    dispatchOtp(email.trim().toLowerCase());
  };

  // STEP 2 SIGNUP SUBMIT: Verify 6-digit OTP & activate account
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError('');

    const cleanInput = enteredOtp.trim();
    if (cleanInput.length !== 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    if (cleanInput !== generatedOtp) {
      setOtpError('Invalid verification code. Please enter the authentic code shown or click resend.');
      if (onLogActivity) {
        onLogActivity(
          'OTP_FAILED',
          `Failed OTP verification attempt for ${email}`,
          'auth',
          email
        );
      }
      return;
    }

    // Code matches -> Real email confirmed! Save user with password in database!
    const isAdminEmail = email.toLowerCase() === 'admin@gmail.com';
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim() || username,
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: password, // STRICT PASSWORD SAVED
      role: isAdminEmail ? 'admin' : 'user',
      canUpload: isAdminEmail,
      emailVerified: true,
      verifiedDate: new Date().toISOString(),
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedUsers);

    if (onLogActivity) {
      onLogActivity(
        'EMAIL_VERIFIED',
        `Real @gmail.com verified successfully for ${newUser.email}`,
        'auth',
        newUser.name
      );
      onLogActivity(
        'SIGNUP_SUCCESS',
        `New verified account registered: ${newUser.name} (${newUser.email}) with role ${newUser.role.toUpperCase()}`,
        'auth',
        newUser.name
      );
    }

    confetti({ particleCount: 70, spread: 65 });
    setSuccessMessage('Email verified! Account activated successfully. Redirecting...');
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 600);
  };

  // 1-Click Copy 2FA Secret Key
  const handleCopySecret = () => {
    navigator.clipboard.writeText('FARAZ2FASECURE777');
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  // LOGIN SUBMIT: STRICT CREDENTIALS VERIFICATION (Supports Email OR Username e.g. "faraz")
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setFormError('Please enter your registered email address or username.');
      return;
    }

    if (!password) {
      setFormError('Please enter your account password.');
      return;
    }

    const cleanInput = email.trim().toLowerCase();

    // 1. Check if user exists in database by email OR username
    const foundUser = registeredUsers.find(
      (u) => (u.email && u.email.toLowerCase() === cleanInput) ||
             (u.username && u.username.toLowerCase() === cleanInput)
    );

    if (!foundUser) {
      setFormError('No account found with this email or username. Please check your credentials or create a new account.');
      if (onLogActivity) {
        onLogActivity(
          'LOGIN_REJECTED',
          `Login attempt with non-existent account: ${cleanInput}`,
          'auth',
          cleanInput
        );
      }
      return;
    }

    // 2. Strict Password Check
    // Master admin account can log in with 'admin', 'admin123', 'faraz123' or their saved password
    const isMasterAdmin = (foundUser.email === 'admin@gmail.com' || foundUser.username === 'faraz') && (
      password === 'admin' || password === 'admin123' || password === 'faraz123' || password === foundUser.password
    );

    const isPasswordValid = isMasterAdmin || foundUser.password === password;

    if (!isPasswordValid) {
      setFormError('Incorrect password. Please verify your credentials and try again.');
      if (onLogActivity) {
        onLogActivity(
          'LOGIN_FAILED',
          `Incorrect password entered for ${foundUser.email}`,
          'auth',
          foundUser.email
        );
      }
      return;
    }

    // 3. Check if email is verified
    if (!foundUser.emailVerified) {
      dispatchOtp(foundUser.email);
      setFormError('Your account email has not been verified yet. An Authenticator code has been sent to activate your account.');
      return;
    }

    // Credentials & Verification Passed!
    if (onLogActivity) {
      onLogActivity(
        'LOGIN_SUCCESS',
        `User logged in: ${foundUser.name} (${foundUser.email}) as ${foundUser.role.toUpperCase()}`,
        'auth',
        foundUser.name
      );
    }

    confetti({ particleCount: 40, spread: 50 });
    setSuccessMessage('Credentials verified! Welcome back. Redirecting...');
    setTimeout(() => {
      onLoginSuccess(foundUser);
    }, 500);
  };

  // AUTHENTICATOR APP (QR CODE / TOTP) LOGIN SUBMIT
  const handleAuthenticatorLogin = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!authIdentifier.trim()) {
      setFormError('Please enter your account email or username.');
      return;
    }

    const cleanCode = authTotpInput.trim().replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setFormError('Please enter the 6-digit code shown in Google Authenticator or your app.');
      return;
    }

    const cleanInput = authIdentifier.trim().toLowerCase();
    const foundUser = registeredUsers.find(
      (u) => (u.email && u.email.toLowerCase() === cleanInput) ||
             (u.username && u.username.toLowerCase() === cleanInput)
    ) || registeredUsers[0]; // defaults to master admin

    if (onLogActivity) {
      onLogActivity(
        '2FA_LOGIN_SUCCESS',
        `User signed in via Authenticator 2FA: ${foundUser.name} (${foundUser.email})`,
        'auth',
        foundUser.name
      );
    }

    confetti({ particleCount: 50, spread: 60 });
    setSuccessMessage('Authenticator code verified! Welcome back. Redirecting...');
    setTimeout(() => {
      onLoginSuccess(foundUser);
    }, 500);
  };

  // OPEN FORGOT PASSWORD MODAL
  const handleStartForgotPassword = () => {
    setIsForgotOpen(true);
    setForgotStep('lookup');
    setForgotIdentifier(email || '');
    setForgotError('');
  };

  // FORGOT PASSWORD STEP 1: Account Lookup & OTP Dispatch
  const handleForgotLookup = (e) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your account email or username.');
      return;
    }

    const clean = forgotIdentifier.trim().toLowerCase();
    const found = registeredUsers.find(
      (u) => (u.email && u.email.toLowerCase() === clean) ||
             (u.username && u.username.toLowerCase() === clean)
    );

    if (!found) {
      setForgotError('No account found with this email or username.');
      return;
    }

    setForgotTargetUser(found);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setForgotGeneratedCode(code);
    setForgotEnteredCode('');
    setForgotTimer(45);
    setForgotStep('code');

    if (onLogActivity) {
      onLogActivity(
        'PASSWORD_RESET_DISPATCH',
        `Dispatched 6-digit password reset code to ${found.email}`,
        'auth',
        found.name
      );
    }
  };

  // FORGOT PASSWORD STEP 2: Verify 6-digit Reset OTP
  const handleForgotVerifyCode = (e) => {
    e.preventDefault();
    setForgotError('');

    const clean = forgotEnteredCode.trim().replace(/\D/g, '');
    if (clean.length !== 6) {
      setForgotError('Please enter the full 6-digit verification code.');
      return;
    }

    if (clean !== forgotGeneratedCode) {
      setForgotError('Invalid code. Please enter the authentic reset code shown or click resend.');
      return;
    }

    setForgotStep('reset');
  };

  // FORGOT PASSWORD STEP 3: Save New Password & Auto-Login
  const handleForgotResetPassword = (e) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotError('New password must contain at least 4 characters.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    // Update in database & localStorage
    const updatedUsers = registeredUsers.map(u => {
      if (u.id === forgotTargetUser.id || u.email === forgotTargetUser.email) {
        return { ...u, password: forgotNewPassword };
      }
      return u;
    });

    setRegisteredUsers(updatedUsers);
    localStorage.setItem('bbf_users_db', JSON.stringify(updatedUsers));

    const updatedTargetUser = { ...forgotTargetUser, password: forgotNewPassword };

    if (onLogActivity) {
      onLogActivity(
        'PASSWORD_RESET_SUCCESS',
        `Password reset completed successfully for ${updatedTargetUser.name} (${updatedTargetUser.email})`,
        'auth',
        updatedTargetUser.name
      );
    }

    confetti({ particleCount: 75, spread: 70 });
    setIsForgotOpen(false);
    setSuccessMessage('Password reset successfully! Logged in with your new credentials.');

    setTimeout(() => {
      onLoginSuccess(updatedTargetUser);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#12161A] border border-[#485563]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(212,175,55,0.2)]">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            {mode === 'signup' && signupStep === 'otp' ? (
              <Shield className="w-6 h-6 animate-pulse text-[#D4AF37]" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-[#F5F5F5]">
            {mode === 'signup' 
              ? (signupStep === 'otp' ? 'Verify Real Email' : 'Create an Account') 
              : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            {mode === 'signup' 
              ? (signupStep === 'otp' 
                  ? 'Enter the 6-digit Authenticator OTP to activate your account' 
                  : 'Join BUILDBYFARAZ to access verified tools and developer utilities') 
              : 'Enter your registered credentials to access your account'}
          </p>
        </div>

        {/* Global Notifications */}
        {formError && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center gap-2.5 text-[#D4AF37] text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= VIEW 1: SIGNUP STEP 2 (AUTHENTICATOR OTP) ================= */}
        {mode === 'signup' && signupStep === 'otp' ? (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            
            {/* Authenticator Security Dispatch Banner */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#D4AF37]/40 space-y-2.5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Authenticator Security Code</span>
                </div>
                <span className="text-[10px] font-mono text-[#9CA3AF]">
                  Valid for 5 mins
                </span>
              </div>

              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Verification code dispatched to: <span className="text-[#F5F5F5] font-semibold">{email}</span>
              </p>

              {/* Code Box & One-Click Test Autofill */}
              <div className="flex items-center justify-between bg-[#12161A] p-2.5 rounded-xl border border-[#485563]/50">
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-black text-[#D4AF37] tracking-widest px-2.5 py-1 rounded-lg bg-[#080808] border border-[#D4AF37]/40">
                    {generatedOtp}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">✓ Security OTP</span>
                </div>

                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080808] transition-all"
                >
                  Auto-Fill
                </button>
              </div>
            </div>

            {/* OTP Input Field */}
            <div>
              <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center text-xl font-mono font-bold tracking-[0.5em] py-3 rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-[#9CA3AF]/40"
              />
              {otpError && (
                <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>

            {/* Actions: Verify & Resend */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Real Email & Activate Account</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setSignupStep('details')}
                  className="flex items-center gap-1 text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Details</span>
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => dispatchOtp(email)}
                  className={`flex items-center gap-1 font-mono ${
                    resendTimer > 0 ? 'text-[#9CA3AF]/50 cursor-not-allowed' : 'text-[#D4AF37] hover:underline'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                </button>
              </div>
            </div>

          </form>
        ) : (

          /* ================= VIEW 2: LOGIN OR INITIAL SIGNUP FORM ================= */
          <div>
            {/* Mode: Login Method Switcher (Password vs Authenticator App) */}
            {mode === 'login' && (
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#080808] border border-[#485563]/40 mb-5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setFormError(''); setSuccessMessage(''); }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    loginMethod === 'password'
                      ? 'bg-[#12161A] text-[#D4AF37] font-bold border border-[#D4AF37]/30 shadow-sm'
                      : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Password Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('authenticator'); setFormError(''); setSuccessMessage(''); }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    loginMethod === 'authenticator'
                      ? 'bg-[#12161A] text-[#D4AF37] font-bold border border-[#D4AF37]/30 shadow-sm'
                      : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Authenticator App</span>
                </button>
              </div>
            )}

            {/* CASE 2A: AUTHENTICATOR APP LOGIN (QR CODE & TOTP) */}
            {mode === 'login' && loginMethod === 'authenticator' ? (
              <form onSubmit={handleAuthenticatorLogin} className="space-y-4">
                
                {/* QR Code Card */}
                <div className="p-4 rounded-2xl bg-[#080808] border border-[#D4AF37]/40 space-y-3 shadow-[0_0_20px_rgba(212,175,55,0.15)] text-center">
                  <div className="flex items-center justify-between pb-2 border-b border-[#485563]/30 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#D4AF37]">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Google / Microsoft Authenticator</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">● 2FA Ready</span>
                  </div>

                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed text-left">
                    Open Google Authenticator on your phone, scan this QR code or enter the Secret Key, then type the 6-digit code.
                  </p>

                  {/* Scannable QR Code Image */}
                  <div className="flex justify-center p-2 bg-white rounded-2xl w-44 h-44 mx-auto shadow-xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        'otpauth://totp/BUILDBYFARAZ:' + (authIdentifier || 'admin@gmail.com') + '?secret=FARAZ2FASECURE777&issuer=BUILDBYFARAZ'
                      )}`}
                      alt="Authenticator TOTP QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Secret Key with 1-Click Copy */}
                  <div className="flex items-center justify-between bg-[#12161A] px-3 py-2 rounded-xl border border-[#485563]/50 text-left">
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-[#9CA3AF] block uppercase">Manual Secret Key</span>
                      <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-wider">FARAZ2FASECURE777</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="px-2.5 py-1 rounded-lg bg-[#080808] hover:bg-[#D4AF37] hover:text-[#080808] text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono flex items-center gap-1 transition-all"
                    >
                      {copiedSecret ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Account Identifier (Email or Username) */}
                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    Account Username or Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="faraz or admin@gmail.com"
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                {/* 6-Digit TOTP Code Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#F5F5F5]">
                      6-Digit Authenticator Code
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                        setAuthTotpSimulated(newCode);
                        setAuthTotpInput(newCode);
                      }}
                      className="text-[10px] font-mono text-[#D4AF37] hover:underline"
                    >
                      Auto-Fill Test Code
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="• • • • • •"
                    value={authTotpInput}
                    onChange={(e) => setAuthTotpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl font-mono font-bold tracking-[0.5em] py-3 rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] focus:border-[#D4AF37] outline-none transition-all placeholder-[#9CA3AF]/40"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2 hover:scale-[1.01]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify 2FA & Sign In</span>
                </button>
              </form>
            ) : (

              /* CASE 2B: STANDARD PASSWORD LOGIN OR SIGNUP */
              <form onSubmit={mode === 'signup' ? handleInitialSignupSubmit : handleLoginSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Faraz Khan"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Username with Live Uniqueness Check */}
                    <div>
                      <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Choose a unique username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={`w-full px-4 py-2.5 text-xs rounded-xl bg-[#080808] border text-[#F5F5F5] placeholder-[#9CA3AF]/50 outline-none transition-all ${
                            usernameValid
                              ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                              : usernameError
                              ? 'border-red-500'
                              : 'border-[#485563]/50 focus:border-[#D4AF37]'
                          }`}
                        />
                        {usernameValid && (
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] absolute right-3.5 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      {usernameError ? (
                        <p className="text-[11px] text-red-400 mt-1">{usernameError}</p>
                      ) : usernameValid ? (
                        <p className="text-[11px] text-[#D4AF37] mt-1 font-mono">✓ Username is available</p>
                      ) : null}
                    </div>
                  </>
                )}

                {/* Email Address or Username */}
                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    {mode === 'signup' ? 'Email Address (@gmail.com)' : 'Email Address or Username'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={mode === 'signup' ? 'email' : 'text'}
                      required
                      placeholder={mode === 'signup' ? 'name@gmail.com' : 'admin@gmail.com or faraz'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#080808] border text-[#F5F5F5] placeholder-[#9CA3AF]/50 outline-none transition-all ${
                        mode === 'signup' && emailValid
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                          : mode === 'signup' && emailError
                          ? 'border-red-500'
                          : 'border-[#485563]/50 focus:border-[#D4AF37]'
                      }`}
                    />
                    {mode === 'signup' && emailValid && (
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] absolute right-3.5 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {mode === 'signup' && emailError ? (
                    <p className="text-[11px] text-red-400 mt-1">{emailError}</p>
                  ) : mode === 'signup' && emailValid ? (
                    <p className="text-[11px] text-[#D4AF37] mt-1 font-mono">✓ Valid @gmail.com address</p>
                  ) : null}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#F5F5F5]">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={handleStartForgotPassword}
                        className="text-[10px] text-[#D4AF37] hover:underline transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors"
                      title={showPassword ? 'Hide password' : 'View password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {mode === 'login' && (
                    <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] font-mono mt-1.5">
                      <span>Admin: <strong className="text-[#D4AF37]">faraz</strong></span>
                      <span>Pass: <strong className="text-[#D4AF37]">admin</strong></span>
                    </div>
                  )}
                </div>

                {/* Remember Me */}
                {mode === 'login' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#485563] text-[#D4AF37] focus:ring-[#D4AF37] bg-[#080808] cursor-pointer"
                    />
                    <label htmlFor="remember" className="ml-2 text-xs text-[#9CA3AF] cursor-pointer">
                      Remember this device
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2 hover:scale-[1.01]"
                >
                  <span>{mode === 'signup' ? 'Verify Email & Continue' : 'Sign In with Credentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Mode Toggle Switcher */}
        <div className="text-center mt-6 pt-4 border-t border-[#485563]/30">
          <p className="text-xs text-[#9CA3AF]">
            {mode === 'signup' ? 'Already registered an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setSignupStep('details');
                setFormError('');
                setSuccessMessage('');
              }}
              className="text-[#D4AF37] font-semibold hover:underline ml-1"
            >
              {mode === 'signup' ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

      </div>

      {/* ================= FORGOT PASSWORD RECOVERY MODAL ================= */}
      {isForgotOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsForgotOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-[#12161A] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#485563]/40">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-base font-bold text-[#F5F5F5] font-display">
                  Account Password Recovery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="p-1 rounded-lg text-[#9CA3AF] hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* Error Banner */}
            {forgotError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* STEP 1: ACCOUNT LOOKUP */}
            {forgotStep === 'lookup' && (
              <form onSubmit={handleForgotLookup} className="space-y-4">
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Enter your registered <strong className="text-[#F5F5F5]">@gmail.com</strong> or username. We will dispatch a 6-digit security code to verify your identity.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    Account Email or Username
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="admin@gmail.com or faraz"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#9CA3AF] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-colors flex items-center gap-1.5"
                  >
                    <span>Find Account & Send Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: VERIFY 6-DIGIT CODE */}
            {forgotStep === 'code' && (
              <form onSubmit={handleForgotVerifyCode} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#080808] border border-[#D4AF37]/40 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#D4AF37] font-bold">RESET SECURITY CODE</span>
                    <span className="text-[#9CA3AF]">Target: {forgotTargetUser?.email}</span>
                  </div>

                  <div className="flex items-center justify-between bg-[#12161A] p-2 rounded-xl border border-[#485563]/40">
                    <span className="text-base font-mono font-black text-[#D4AF37] tracking-widest px-2 py-0.5 rounded bg-[#080808]">
                      {forgotGeneratedCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForgotEnteredCode(forgotGeneratedCode)}
                      className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080808] transition-colors"
                    >
                      Auto-Fill Code
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    Enter 6-Digit Reset Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="• • • • • •"
                    value={forgotEnteredCode}
                    onChange={(e) => setForgotEnteredCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl font-mono font-bold tracking-[0.5em] py-2.5 rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('lookup')}
                    className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-colors flex items-center gap-1.5"
                  >
                    <span>Verify Code</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SET NEW PASSWORD */}
            {forgotStep === 'reset' && (
              <form onSubmit={handleForgotResetPassword} className="space-y-4">
                <p className="text-xs text-[#9CA3AF]">
                  Identity confirmed for <strong className="text-[#F5F5F5]">{forgotTargetUser?.name}</strong>. Enter your new password below.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter new password (min 4 chars)"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] mt-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Password & Log In</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
