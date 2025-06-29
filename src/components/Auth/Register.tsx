import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Chrome, ArrowRight, Check, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { authApi, setAuthToken } from '@/services/api';
import { cn } from '@/lib/utils';

interface RegisterProps {
  onRegister: (userData: { username: string; fullname: string; email: string; password: string; date_of_birth: string }) => void;
  onGoogleRegister: () => void;
  onNavigateToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onGoogleRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.fullname.trim())) {
      newErrors.fullname = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.trim().length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Date of birth validation
    if (!dateOfBirth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      const today = new Date();
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      const monthDiff = today.getMonth() - dateOfBirth.getMonth();
      const dayDiff = today.getDate() - dateOfBirth.getDate();
      
      // More accurate age calculation
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      
      if (actualAge < 13) {
        newErrors.date_of_birth = 'You must be at least 13 years old to register';
      } else if (dateOfBirth > today) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future';
      }
    }

    // Terms acceptance validation
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions to register';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeInput = (input: string) => {
    // Basic input sanitization
    return input.trim().replace(/[<>]/g, '');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setDateOfBirth(date);
    // Clear error when user selects a date
    if (errors.date_of_birth) {
      setErrors(prev => ({ ...prev, date_of_birth: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Sanitize inputs
      const userData = {
        username: sanitizeInput(formData.username),
        fullname: sanitizeInput(formData.fullname),
        email: sanitizeInput(formData.email),
        password: formData.password, // Don't sanitize password
        date_of_birth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : ''
      };

      const response = await authApi.register(userData);

      if (response.success) {
        // Store auth token if provided
        if (response.data?.token) {
          setAuthToken(response.data.token);
        }
        
        // Call the parent component's onRegister handler
        onRegister(userData);
        
        // Navigate to login page with success message
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please sign in with your new account.' 
          } 
        });
      } else {
        setErrors({ 
          general: response.data?.message || 'Registration failed. Please try again.' 
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.status === 409) {
        errorMessage = 'An account with this email or username already exists.';
      } else if (error.status === 422) {
        errorMessage = 'Please check your information and try again.';
      } else if (error.status === 429) {
        errorMessage = 'Too many registration attempts. Please try again later.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // In a real implementation, you would integrate with Google OAuth
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      onGoogleRegister();
      
      // Navigate to login page after successful Google registration
      navigate('/login', { 
        state: { 
          message: 'Google registration successful! Please sign in.' 
        } 
      });
    } catch (error: any) {
      console.error('Google registration error:', error);
      setErrors({ general: 'Google registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link to="/" className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Dogether
            </h1>
          </Link>
          <p className={cn(
            "text-lg",
            "text-gray-600 dark:text-gray-300"
          )}>
            Join our community and start achieving your goals together!
          </p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
            <CardHeader className="space-y-1 pb-4">
              <h2 className={cn(
                "text-2xl font-bold text-center",
                "text-gray-900 dark:text-gray-100"
              )}>
                Create Account
              </h2>
              <p className={cn(
                "text-center text-sm",
                "text-gray-600 dark:text-gray-400"
              )}>
                Fill in your details to get started
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Register Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 flex items-center justify-center space-x-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                onClick={handleGoogleRegister}
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Continue with Google</span>
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={cn(
                    "px-4 bg-white dark:bg-gray-800",
                    "text-gray-500 dark:text-gray-400"
                  )}>
                    Or register with email
                  </span>
                </div>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <Label htmlFor="fullname" className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => handleInputChange('fullname', e.target.value)}
                      placeholder="Enter your full name"
                      className={cn(
                        "pl-10 h-12",
                        errors.fullname && "border-red-500 focus:border-red-500 dark:border-red-400"
                      )}
                      disabled={isLoading}
                      autoComplete="name"
                      required
                    />
                  </div>
                  {errors.fullname && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.fullname}</span>
                    </p>
                  )}
                </div>

                {/* Username Field */}
                <div>
                  <Label htmlFor="username" className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Username *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">@</span>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Choose a username"
                      className={cn(
                        "pl-8 h-12",
                        errors.username && "border-red-500 focus:border-red-500 dark:border-red-400"
                      )}
                      disabled={isLoading}
                      autoComplete="username"
                      required
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.username}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={cn(
                        "pl-10 h-12",
                        errors.email && "border-red-500 focus:border-red-500 dark:border-red-400"
                      )}
                      disabled={isLoading}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Date of Birth Field with Calendar Picker */}
                <div>
                  <Label className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Date of Birth *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !dateOfBirth && "text-muted-foreground",
                          errors.date_of_birth && "border-red-500 focus:border-red-500 dark:border-red-400"
                        )}
                        disabled={isLoading}
                      >
                        <Calendar className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {dateOfBirth ? (
                          format(dateOfBirth, "PPP")
                        ) : (
                          <span>Pick your date of birth</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date_of_birth && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.date_of_birth}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
                      className={cn(
                        "pl-10 pr-10 h-12",
                        errors.password && "border-red-500 focus:border-red-500 dark:border-red-400"
                      )}
                      disabled={isLoading}
                      autoComplete="new-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors",
                              i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200 dark:bg-gray-700"
                            )}
                          />
                        ))}
                      </div>
                      <p className={cn(
                        "text-xs",
                        passwordStrength < 3 ? "text-red-600 dark:text-red-400" : 
                        passwordStrength < 4 ? "text-yellow-600 dark:text-yellow-400" : 
                        "text-green-600 dark:text-green-400"
                      )}>
                        Password strength: {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                      </p>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label htmlFor="confirmPassword" className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className={cn(
                        "pl-10 pr-10 h-12",
                        errors.confirmPassword && "border-red-500 focus:border-red-500 dark:border-red-400"
                      )}
                      disabled={isLoading}
                      autoComplete="new-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAcceptTerms(!acceptTerms);
                      clearError('terms');
                    }}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5",
                      acceptTerms 
                        ? "bg-purple-600 border-purple-600 text-white" 
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-400",
                      errors.terms && "border-red-500"
                    )}
                    disabled={isLoading}
                  >
                    {acceptTerms && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm leading-relaxed",
                      "text-gray-600 dark:text-gray-400"
                    )}>
                      I agree to the{' '}
                      <button 
                        type="button"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button 
                        type="button"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Privacy Policy
                      </button>
                    </p>
                    {errors.terms && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.terms}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className={cn(
                    "border rounded-lg p-3",
                    "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30"
                  )}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">{errors.general}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full h-12 flex items-center justify-center space-x-2"
                  disabled={isLoading || !formData.fullname.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword || !dateOfBirth || !acceptTerms}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className={cn(
                  "text-sm",
                  "text-gray-600 dark:text-gray-400"
                )}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className={cn(
            "text-xs",
            "text-gray-500 dark:text-gray-400"
          )}>
            By creating an account, you're joining a community of goal achievers
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;