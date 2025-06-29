import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-12 text-center">
            {/* 404 Illustration */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  404
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className={cn(
                "text-2xl font-bold mb-3",
                "text-gray-900 dark:text-gray-100"
              )}>
                Page Not Found
              </h1>
              <p className={cn(
                "mb-8 leading-relaxed",
                "text-gray-600 dark:text-gray-300"
              )}>
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  variant="gradient"
                  className="w-full flex items-center space-x-2"
                >
                  <Link to="/">
                    <Home className="w-4 h-4" />
                    <span>Go Home</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </Button>
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className={cn(
                  "text-sm flex items-center justify-center space-x-2",
                  "text-gray-500 dark:text-gray-400"
                )}>
                  <Search className="w-4 h-4" />
                  <span>Need help? Check our navigation menu</span>
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <div className="flex justify-center space-x-6 text-sm">
            <Link
              to="/goals"
              className={cn(
                "hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
                "text-gray-600 dark:text-gray-300"
              )}
            >
              My Goals
            </Link>
            <Link
              to="/friends"
              className={cn(
                "hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
                "text-gray-600 dark:text-gray-300"
              )}
            >
              Friends
            </Link>
            <Link
              to="/badges"
              className={cn(
                "hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
                "text-gray-600 dark:text-gray-300"
              )}
            >
              Badges
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;