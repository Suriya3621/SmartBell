import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiShield,
  FiAlertCircle,
  FiChevronRight,
  FiClock,
  FiKey,
} from "react-icons/fi";

export default function Verify() {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleButtonClick = (value: string) => {
    if (value === "C") {
      setAccessCode("");
      setError("");
    } else if (value === "⌫") {
      setAccessCode((prev) => prev.slice(0, -1));
      setError("");
    } else if (accessCode.length < 6) {
      setAccessCode((prev) => prev + value);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (accessCode.length < 6) {
      setError("Code must be 6 digits");
      return;
    }

    if (attempts >= 3) {
      setError("Too many attempts. Please wait 30 seconds.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate authentication
    setTimeout(() => {
      const correctCode = import.meta.env.VITE_APP_PASS || "123456";

      if (accessCode === correctCode) {
        setAttempts(0);
        sessionStorage.setItem("access", "true");
        navigate("/home");
      } else {
        setError("Invalid access code");
        setAccessCode("");
        setAttempts((prev) => prev + 1);
      }
      setIsLoading(false);
    }, 1000);
  };

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "C", "0", "⌫"];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants: Variants = {
    tap: { scale: 0.9 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-purple-950 text-gray-900 dark:text-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md"
      >
        {/* Security Badge */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 dark:shadow-blue-500/50">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
              <FiLock className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5" />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                ADMIN ACCESS
              </h1>
              <div className="flex items-center justify-center space-x-2 text-blue-100">
                <FiClock className="w-4 h-4" />
                <p className="text-sm">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <span>•</span>
                <p className="text-sm">Secure Portal</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Instructions */}
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                <FiKey className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Enter Security Code</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                6-digit authentication code required
              </p>
            </motion.div>

            {/* Code Display */}
            <motion.div
              variants={itemVariants}
              className={`mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 ${
                error
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              } transition-colors`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  SECURITY CODE
                </span>
                <span className="text-gray-500 dark:text-gray-500 text-sm">
                  {accessCode.length}/6
                </span>
              </div>
              <div className="flex space-x-3">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-2xl font-mono font-bold transition-all ${
                      i < accessCode.length
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    {i < accessCode.length ? "•" : "—"}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
                    <FiAlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                        {error}
                      </p>
                      {attempts > 0 && (
                        <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                          Attempts remaining: {3 - attempts}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keypad */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {buttons.map((btn) => (
                <motion.button
                  key={btn}
                  variants={buttonVariants}
                  whileTap="tap"
                  whileHover="hover"
                  onClick={() => handleButtonClick(btn)}
                  className={`h-14 rounded-xl text-lg font-semibold transition-all select-none ${
                    btn === "C"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : btn === "⌫"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                  }`}
                >
                  {btn}
                </motion.button>
              ))}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isLoading || accessCode.length === 0 || attempts >= 3}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isLoading || accessCode.length === 0 || attempts >= 3
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    <FiClock className="w-5 h-5" />
                  </motion.span>
                  <span>VERIFYING...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>ENTER SYSTEM</span>
                  <FiChevronRight className="w-5 h-5" />
                </span>
              )}
            </motion.button>

            {/* Security Notice */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-500 text-xs">
                <FiShield className="w-4 h-4" />
                <p>All access attempts are monitored and logged</p>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-8 py-4 text-center border-t border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              For authorized personnel only • Bell Control System v1.0
            </p>
          </div>
        </motion.div>

        {/* Bottom Info */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>System Status: Online</span>
            <span>•</span>
            <span>Encryption: AES-256</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}