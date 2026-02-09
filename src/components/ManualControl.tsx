import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPower,
  FiBell,
  FiPause,
  FiVolume2,
  FiZap,
  FiPlay,
  FiStopCircle,
  FiWatch,
} from "react-icons/fi";
import { publish } from "../mqtt/mqttService";

export default function ManualControl() {
  const [isOn, setIsOn] = useState(false);
  const [duration, setDuration] = useState(5);
  const [isPressing, setIsPressing] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  // Toggle switch handler
  const toggleBell = () => {
    const next = !isOn;
    setIsOn(next);
    setActiveEffect("toggle");
    publish(next ? "ON" : "OFF");
    setTimeout(() => setActiveEffect(null), 300);
  };

  // Handle press & hold
  const handlePressStart = () => {
    setIsPressing(true);
    publish("ON");
    setActiveEffect("press");
  };

  const handlePressEnd = () => {
    setIsPressing(false);
    publish("OFF");
    setActiveEffect(null);
  };

  // Ring with custom duration
  const ringWithDuration = () => {
    setActiveEffect("ring");
    publish(`RING:${duration}`);
    setTimeout(() => setActiveEffect(null), 500);
  };

  // Quick ring presets
  const quickRing = (seconds: number) => {
    setDuration(seconds);
    setActiveEffect("quick");
    publish(`RING:${seconds}`);
    setTimeout(() => setActiveEffect(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header with Animation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-rose-500 to-orange-500 blur-xl opacity-70 ${activeEffect === "ring" ? "animate-pulse" : ""}`}
            />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 shadow-2xl flex items-center justify-center">
              <FiBell className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg flex items-center justify-center">
              <FiZap className="w-5 h-5 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">
            Manual Bell Control
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Take direct control with stunning visual feedback and real-time
            interactions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Press & Hold - Amazing Design */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {/* Glass Effect Container */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden">
              {/* Gradient Header */}
              <div className="h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500" />

              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg">
                    <FiPower className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Press & Hold
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Instant manual ringing with visual feedback
                    </p>
                  </div>
                </div>

                {/* Amazing Press Button */}
                <div className="relative mb-10">
                  {/* Outer Glow Rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={isPressing ? { scale: 1.2 } : { scale: 1 }}
                      className={`absolute w-80 h-80 rounded-full ${isPressing ? "bg-rose-400/30" : "bg-rose-200/10"} border-2 ${isPressing ? "border-rose-300/50" : "border-rose-100/20"}`}
                    />
                    <motion.div
                      animate={isPressing ? { scale: 1.4 } : { scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`absolute w-64 h-64 rounded-full ${isPressing ? "bg-pink-400/20" : "bg-pink-200/5"} border ${isPressing ? "border-pink-200/30" : "border-pink-100/10"}`}
                    />
                  </div>

                  {/* Main Press Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    className={`
                      relative w-64 h-64 rounded-full mx-auto
                      flex items-center justify-center
                      shadow-2xl transition-all duration-300
                      ${
                        isPressing
                          ? "bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 shadow-rose-500/50"
                          : "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 hover:shadow-3xl"
                      }
                    `}
                  >
                    {/* Inner Shine */}
                    <div className="absolute inset-8 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-30" />

                    {/* Icon */}
                    <div className="relative z-10">
                      <FiPower
                        className={`w-24 h-24 text-white ${isPressing ? "animate-pulse" : ""}`}
                      />
                    </div>

                    {/* Ripple Effect */}
                    {isPressing && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400/50 to-pink-400/50 animate-ping" />
                    )}
                  </motion.button>
                </div>

                {/* Status Display */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full shadow-lg">
                    <motion.div
                      animate={isPressing ? { scale: [1, 1.2, 1] } : {}}
                      transition={{
                        duration: 0.5,
                        repeat: isPressing ? Infinity : 0,
                      }}
                      className={`w-3 h-3 rounded-full ${isPressing ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-rose-500 to-pink-500"}`}
                    />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {isPressing ? "🎵 BELL RINGING..." : "🔄 READY TO RING"}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Press & hold • Instant feedback • Smooth control
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Controls */}
          <div className="space-y-8">
            {/* Toggle Switch Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                      <FiPlay className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Continuous Mode
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Toggle automatic ringing
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-8">
                    {/* Amazing Toggle Switch */}
                    <div className="relative">
                      <div
                        className={`absolute -inset-4 rounded-3xl ${isOn ? "bg-emerald-500/10" : "bg-gray-400/10"} blur-lg`}
                      />

                      <button
                        onClick={toggleBell}
                        className={`
                          relative w-36 h-20 rounded-full transition-all duration-500
                          flex items-center p-2 shadow-2xl
                          ${
                            isOn
                              ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
                              : "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600"
                          }
                        `}
                      >
                        <motion.div
                          layout
                          className="relative w-16 h-16 bg-white rounded-full shadow-xl"
                          animate={{ x: isOn ? 92 : 8 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        >
                          {/* Inner glow */}
                          <div
                            className={`absolute inset-2 rounded-full ${isOn ? "bg-emerald-500/20" : "bg-gray-400/20"}`}
                          />
                        </motion.div>
                      </button>

                      {/* Labels with Animation */}
                      <div className="flex justify-between mt-6">
                        <motion.span
                          animate={!isOn ? { scale: 1.1 } : {}}
                          className={`text-lg font-bold ${!isOn ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                        >
                          OFF
                        </motion.span>
                        <motion.span
                          animate={isOn ? { scale: 1.1 } : {}}
                          className={`text-lg font-bold ${isOn ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"}`}
                        >
                          ON
                        </motion.span>
                      </div>
                    </div>

                    {/* Status Card */}
                    <div
                      className={`w-full p-5 rounded-2xl ${isOn ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20" : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"} border ${isOn ? "border-emerald-200 dark:border-emerald-800/30" : "border-gray-200 dark:border-gray-700"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-xl ${isOn ? "bg-emerald-500/20" : "bg-gray-500/20"}`}
                        >
                          {isOn ? (
                            <FiPlay className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <FiStopCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {isOn
                              ? "🎶 Continuous Ringing Active"
                              : "⏸️ Bell System Idle"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {isOn
                              ? "Bell will ring until turned off"
                              : "Ready for activation"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Real-time Control",
              desc: "Instant response",
              gradient: "from-purple-500 to-pink-500",
              icon: <FiZap className="w-6 h-6" />,
            },
            {
              title: "Manual Override",
              desc: "Direct operation",
              gradient: "from-emerald-500 to-teal-500",
              icon: <FiPower className="w-6 h-6" />,
            },
            {
              title: "Safe Operation",
              desc: "Protected system",
              gradient: "from-cyan-500 to-blue-500",
              icon: <FiBell className="w-6 h-6" />,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-gray-700/50 shadow-xl`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient}`}
                >
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.desc}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
