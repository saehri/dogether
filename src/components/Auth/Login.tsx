import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { authApi, setAuthToken } from '../../services/api';

import { cn } from '../../lib/utils';

import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	ArrowRight,
	AlertCircle,
	CheckCircle,
} from 'lucide-react';
import { useAuthActions } from '../../stores/authStore';
import { ROUTES } from '../../utils/constants';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const navigate = useNavigate();
	const { setUser, setAuthenticated } = useAuthActions();
	const location = useLocation();

	const message = location.state?.message;

	// Show success message from registration
	useEffect(() => {
		if (message) {
			setSuccessMessage(message);
			// Clear message after 5 seconds
			const timer = setTimeout(() => setSuccessMessage(null), 5000);
			return () => clearTimeout(timer);
		}
	}, [message]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		// Email/Username validation
		if (!login.trim()) {
			newErrors.login = 'Email or username is required';
		} else if (login.includes('@')) {
			// If it contains @, validate as login
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
				newErrors.login = 'Please enter a valid credentials';
			}
		} else {
			// If no @, validate as username (basic validation)
			if (login.trim().length < 3) {
				newErrors.login = 'Username must be at least 3 characters';
			}
		}

		// Password validation
		if (!password) {
			newErrors.password = 'Password is required';
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const sanitizeInput = (input: string) => {
		// Basic input sanitization
		return input.trim().replace(/[<>]/g, '');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});
		setSuccessMessage(null);

		try {
			// Sanitize inputs
			const sanitizedCredentials = sanitizeInput(login);
			const credentials = {
				login: sanitizedCredentials,
				password: password, // Don't sanitize password as it might contain special chars
			};

			const response = await authApi.login(credentials);

			if (response.success && response.data?.token) {
				// Store the auth token securely
				setAuthToken(response.data.token);

				// Update user data in store if provided
				setUser(response.data.user);
				setAuthenticated(true);

				// Navigate to intended page or default app route
				const from = location.state?.from?.pathname || ROUTES.HOME;
				navigate(from, { replace: true });
			} else {
				setErrors({
					general:
						response.data?.message ||
						'Login failed. Please check your credentials and try again.',
				});
			}
		} catch (error: any) {
			console.error('Login error:', error);

			// Handle different types of errors
			let errorMessage = 'Login failed. Please try again.';

			if (error.status === 401) {
				errorMessage =
					'Invalid email/username or password. Please check your credentials.';
			} else if (error.status === 429) {
				errorMessage = 'Too many login attempts. Please try again later.';
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

	const clearError = (field: string) => {
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
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
					<Link
						to="/"
						className="flex items-center justify-center space-x-3 mb-4"
					>
						<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
							<span className="text-white font-bold text-xl">D</span>
						</div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
							Dogether
						</h1>
					</Link>
					<p className={cn('text-lg', 'text-gray-600 dark:text-gray-300')}>
						Welcome back! Sign in to continue your journey.
					</p>
				</motion.div>

				{/* Success Message */}
				{successMessage && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={cn(
							'border rounded-lg p-4 flex items-center space-x-2 mb-6',
							'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
						)}
					>
						<CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
						<span className="text-green-800 dark:text-green-200 text-sm">
							{successMessage}
						</span>
					</motion.div>
				)}

				{/* Login Card */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2 }}
				>
					<Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
						<CardHeader className="space-y-1 pb-4">
							<h2
								className={cn(
									'text-2xl font-bold text-center',
									'text-gray-900 dark:text-gray-100'
								)}
							>
								Sign In
							</h2>
							<p
								className={cn(
									'text-center text-sm',
									'text-gray-600 dark:text-gray-400'
								)}
							>
								Enter your credentials to access your account
							</p>
						</CardHeader>

						<CardContent className="space-y-6">
							{/* Login Form */}
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Email/Username Field */}
								<div>
									<Label
										htmlFor="login"
										className={cn(
											'text-sm font-medium mb-2 block',
											'text-gray-700 dark:text-gray-200'
										)}
									>
										Email or Username *
									</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
										<Input
											id="login"
											type="text"
											value={login}
											onChange={(e) => {
												setLogin(e.target.value);
												clearError('login');
											}}
											placeholder="Enter your email or username"
											className={cn(
												'pl-10 h-12',
												errors.email &&
													'border-red-500 focus:border-red-500 dark:border-red-400'
											)}
											disabled={isLoading}
											autoComplete="username"
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

								{/* Password Field */}
								<div>
									<Label
										htmlFor="password"
										className={cn(
											'text-sm font-medium mb-2 block',
											'text-gray-700 dark:text-gray-200'
										)}
									>
										Password *
									</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
										<Input
											id="password"
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => {
												setPassword(e.target.value);
												clearError('password');
											}}
											placeholder="Enter your password"
											className={cn(
												'pl-10 pr-10 h-12',
												errors.password &&
													'border-red-500 focus:border-red-500 dark:border-red-400'
											)}
											disabled={isLoading}
											autoComplete="current-password"
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
											{showPassword ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</Button>
									</div>
									{errors.password && (
										<p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
											<AlertCircle className="w-3 h-3" />
											<span>{errors.password}</span>
										</p>
									)}
								</div>

								{/* Forgot Password */}
								<div className="text-right">
									<Button
										type="button"
										variant="link"
										className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-0 h-auto"
										disabled={isLoading}
									>
										Forgot password?
									</Button>
								</div>

								{/* General Error */}
								{errors.general && (
									<div
										className={cn(
											'border rounded-lg p-3',
											'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
										)}
									>
										<div className="flex items-center space-x-2">
											<AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
											<p className="text-red-700 dark:text-red-300 text-sm">
												{errors.general}
											</p>
										</div>
									</div>
								)}

								{/* Submit Button */}
								<Button
									type="submit"
									variant="gradient"
									className="w-full h-12 flex items-center justify-center space-x-2"
									disabled={isLoading || !login.trim() || !password}
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
								<p
									className={cn('text-sm', 'text-gray-600 dark:text-gray-400')}
								>
									Don't have an account?{' '}
									<Link
										to={ROUTES.REGISTER}
										className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
									>
										Create one here
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
					<p className={cn('text-xs', 'text-gray-500 dark:text-gray-400')}>
						By signing in, you agree to our{' '}
						<button className="text-purple-600 dark:text-purple-400 hover:underline">
							Terms of Service
						</button>{' '}
						and{' '}
						<button className="text-purple-600 dark:text-purple-400 hover:underline">
							Privacy Policy
						</button>
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Login;