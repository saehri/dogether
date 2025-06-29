import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Chrome, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { authApi, setAuthToken } from '@/services/api';
import { cn } from '@/lib/utils';

interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onGoogleLogin: () => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoogleLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email or username is required';
    } else if (email.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.login({
        email: email.trim(),
        password
      });

      if (response.success && response.data?.token) {
        // Store the auth token
        setAuthToken(response.data.token);
        
        // Call the parent component's onLogin handler
        onLogin({ email: email.trim(), password });
      } else {
        setErrors({ general: response.data?.message || 'Login failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Login failed. Please check your credentials and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // In a real implementation, you would integrate with Google OAuth
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      onGoogleLogin();
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrors({ general: 'Google login failed. Please try again.' });
    } finally {
      setIsLoading(false);
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
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Dogether
            </h1>
          </div>
          <p className={cn(
            "text-lg",
            "text-gray-600 dark:text-gray-300"
          )}>
            Welcome back! Sign in to continue your journey.
          </p>
        </motion.div>

        {/* Login Card */}
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
                Sign In
              </h2>
              <p className={cn(
                "text-center text-sm",
                "text-gray-600 dark:text-gray-400"
              )}>
                Enter your credentials to access your account
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 flex items-center justify-center space-x-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                onClick={handleGoogleLogin}
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
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email/Username Field */}
                <div>
                  <Label htmlFor="email" className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Email or Username
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email or username"
                      className={cn(
                        "pl-10 h-12",
                        errors.email && "border-red-500 focus:border-red-500 dark:border-red-400"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className={cn(
                    "text-sm font-medium mb-2 block",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={cn(
                        "pl-10 pr-10 h-12",
                        errors.password && "border-red-500 focus:border-red-500 dark:border-red-400"
                      )}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-0 h-auto"
                  >
                    Forgot password?
                  </Button>
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className={cn(
                    "border rounded-lg p-3",
                    "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30"
                  )}>
                    <p className="text-red-700 dark:text-red-300 text-sm">{errors.general}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full h-12 flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className={cn(
                  "text-sm",
                  "text-gray-600 dark:text-gray-400"
                )}>
                  Don't have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-0 h-auto font-semibold"
                    onClick={onNavigateToRegister}
                  >
                    Create one here
                  </Button>
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
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;