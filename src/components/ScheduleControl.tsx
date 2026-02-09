import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiEdit2,
  FiPlus,
  FiClock,
  FiBell,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiCalendar,
  FiWatch,
  FiZap,
  FiList,
  FiType,
  FiHash,
  FiTarget,
} from "react-icons/fi";
import { publish } from "../mqtt/mqttService";
import type { Schedule } from "../types/schedule";

type Props = {
  schedules: Schedule[];
  reload: () => void;
};

// Glass morphism effect utility
const glassEffect =
  "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50";

// Input mode type
type InputMode = "slider" | "text";

// Memoized Schedule Item Component
const ScheduleItem = memo(
  ({
    schedule,
    onEdit,
    onDelete,
  }: {
    schedule: Schedule;
    onEdit: (s: Schedule) => void;
    onDelete: (index: number) => void;
  }) => {
    const time = `${String(schedule.hour).padStart(2, "0")}:${String(schedule.minute).padStart(2, "0")}`;
    const period = schedule.hour >= 12 ? "PM" : "AM";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative group ${glassEffect} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg flex items-center justify-center">
                  <FiClock className="text-2xl text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {schedule.index + 1}
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    {time}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {period}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800/30">
                    <FiBell className="text-cyan-600 dark:text-cyan-400 text-xs" />
                    <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                      {schedule.count} ring{schedule.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30">
                    <FiWatch className="text-violet-600 dark:text-violet-400 text-xs" />
                    <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                      {schedule.duration}s each
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => onEdit(schedule)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800/30 text-cyan-600 dark:text-cyan-400 hover:shadow-lg transition-all"
                title="Edit schedule"
              >
                <FiEdit2 className="text-lg" />
              </motion.button>
              <motion.button
                onClick={() => onDelete(schedule.index)}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-100 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 hover:shadow-lg transition-all"
                title="Delete schedule"
              >
                <FiTrash2 className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

ScheduleItem.displayName = "ScheduleItem";

export default function ScheduleControl({ schedules, reload }: Props) {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [count, setCount] = useState(1);
  const [duration, setDuration] = useState(3);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "list">("list");
  const [timeFormat] = useState("24h");
  const [inputMode, setInputMode] = useState<InputMode>("slider");
  const [timeString, setTimeString] = useState("09:00");
  const previousSchedulesLength = useRef(schedules.length);

  // Auto-reload when schedules change
  useEffect(() => {
    if (schedules.length !== previousSchedulesLength.current) {
      previousSchedulesLength.current = schedules.length;
    }
  }, [schedules.length]);

  // Update time string when hour/minute changes
  useEffect(() => {
    setTimeString(
      `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    );
  }, [hour, minute]);

  // Parse time string to update hour/minute
  const handleTimeStringChange = (value: string) => {
    setTimeString(value);
    const [h, m] = value.split(":").map(Number);
    if (!isNaN(h) && h >= 0 && h <= 23 && !isNaN(m) && m >= 0 && m <= 59) {
      setHour(h);
      setMinute(m);
    }
  };

  const showNotification = useCallback(
    (type: "success" | "error", message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

  const handleReload = useCallback(() => {
    setIsLoading(true);
    reload();
    setTimeout(() => setIsLoading(false), 500);
  }, [reload,isLoading]);

  const addSchedule = useCallback(() => {
    try {
      publish(`ADD:${hour}:${minute}:${count}:${duration}`);
      showNotification("success", "Schedule added successfully!");
      clearForm();
      reload();
      setIsAdding(false);
      setActiveTab("list");
    } catch (error) {
      showNotification("error", "Failed to add schedule");
    }
  }, [hour, minute, count, duration, reload, showNotification]);

  const updateSchedule = useCallback(() => {
    if (editIndex === null) return;
    try {
      publish(`UPD:${editIndex}:${hour}:${minute}:${count}:${duration}`);
      showNotification("success", "Schedule updated successfully!");
      clearForm();
      reload();
      setActiveTab("list");
    } catch (error) {
      showNotification("error", "Failed to update schedule");
    }
  }, [editIndex, hour, minute, count, duration, reload, showNotification]);

  const deleteSchedule = useCallback(
    (index: number) => {
      try {
        publish(`DEL:${index}`);
        showNotification("success", "Schedule deleted successfully!");
        reload();
      } catch (error) {
        showNotification("error", "Failed to delete schedule");
      }
    },
    [reload, showNotification],
  );

  const loadSchedule = useCallback((s: Schedule) => {
    setEditIndex(s.index);
    setHour(s.hour);
    setMinute(s.minute);
    setCount(s.count);
    setDuration(s.duration);
    setIsAdding(true);
    setActiveTab("form");
  }, []);

  const clearForm = useCallback(() => {
    setEditIndex(null);
    setHour(9);
    setMinute(0);
    setCount(1);
    setDuration(3);
    setTimeString("09:00");
    setIsAdding(false);
    setActiveTab("list");
    setInputMode("slider");
  }, []);

  const formatTime = (h: number, m: number) => {
    if (timeFormat === "12h") {
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
    }
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  // Mobile tabs component
  const MobileTabs = () => (
    <div className="lg:hidden mb-6">
      <div className={`flex rounded-2xl p-1.5 ${glassEffect} shadow-lg`}>
        <motion.button
          onClick={() => setActiveTab("list")}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === "list"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <FiList className="text-lg" />
          <span>Schedules</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === "list"
                ? "bg-white/20"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
            }`}
          >
            {schedules.length}
          </span>
        </motion.button>
        <motion.button
          onClick={() => {
            setActiveTab("form");
            if (!isAdding && editIndex === null) {
              setIsAdding(true);
            }
          }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === "form"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {editIndex !== null ? <FiEdit2 /> : <FiPlus />}
          <span>{editIndex !== null ? "Edit" : "Create"}</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-900/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              key="notification"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                  : "bg-gradient-to-r from-rose-500 to-pink-600"
              } text-white border border-white/20 max-w-sm`}
            >
              {notification.type === "success" ? (
                <FiCheck size={20} />
              ) : (
                <FiAlertCircle size={20} />
              )}
              <span className="font-medium text-sm flex-1">
                {notification.message}
              </span>
              <button
                onClick={() => setNotification(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 lg:mb-12"
        >
          <div className={`p-6 lg:p-8 rounded-3xl ${glassEffect} shadow-2xl`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl">
                  <FiCalendar className="text-2xl lg:text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Schedule Manager
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      {schedules.length} active schedule
                      {schedules.length !== 1 ? "s" : ""}
                    </p>
                    <button onClick={handleReload} className="bg-sky-400 p-1 rounded-xl">
                      Refresh
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse" />
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Tabs */}
        <MobileTabs />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div
            className={`lg:col-span-2 ${activeTab !== "form" ? "hidden lg:block" : "block"}`}
          >
            {/* Add Button (Desktop only) */}
            {!isAdding && editIndex === null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden lg:block mb-8"
              >
                <motion.button
                  onClick={() => setIsAdding(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-8 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl hover:shadow-2xl transition-all group"
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <FiPlus className="text-2xl text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">
                        Create New Schedule
                      </h3>
                      <p className="text-cyan-100 mt-1">
                        Add a new alarm schedule to your list
                      </p>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Form Card */}
            {(isAdding || editIndex !== null || activeTab === "form") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 lg:mb-0"
              >
                <div
                  className={`rounded-3xl ${glassEffect} shadow-2xl overflow-hidden`}
                >
                  {/* Form Header */}
                  <div className="p-6 lg:p-8 border-b border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
                          {editIndex === null ? (
                            <FiPlus className="text-xl text-white" />
                          ) : (
                            <FiEdit2 className="text-xl text-white" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {editIndex === null
                              ? "Create Schedule"
                              : "Edit Schedule"}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Set your alarm time and preferences
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearForm}
                        className="p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors lg:hidden"
                      >
                        <FiX className="text-xl text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-6 lg:p-8">
                    {/* Time Preview */}
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800/30">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Preview
                        </p>
                        <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
                          {formatTime(hour, minute)}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                          {count} ring{count !== 1 ? "s" : ""} • {duration}{" "}
                          second{duration !== 1 ? "s" : ""} each
                        </p>
                      </div>
                    </div>

                    {/* Input Mode Toggle */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Input Mode
                        </h3>
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${inputMode === "slider" ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            Slider
                          </div>
                          <button
                            onClick={() =>
                              setInputMode(
                                inputMode === "slider" ? "text" : "slider",
                              )
                            }
                            className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md"
                              animate={{ x: inputMode === "slider" ? 4 : 28 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            />
                          </button>
                          <div
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${inputMode === "text" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            Text
                          </div>
                        </div>
                      </div>

                      {/* Time Input Section */}
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                              <FiClock className="text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              Time Settings
                            </h3>
                          </div>

                          {inputMode === "slider" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Hour Slider */}
                              <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Hour: {hour.toString().padStart(2, "0")}
                                </label>
                                <div className="relative">
                                  <input
                                    type="range"
                                    min="0"
                                    max="23"
                                    value={hour}
                                    onChange={(e) => setHour(+e.target.value)}
                                    className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-600 [&::-webkit-slider-thumb]:shadow-lg"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span>00</span>
                                  <span>12</span>
                                  <span>23</span>
                                </div>
                              </div>

                              {/* Minute Slider */}
                              <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Minute: {minute.toString().padStart(2, "0")}
                                </label>
                                <div className="relative">
                                  <input
                                    type="range"
                                    min="0"
                                    max="59"
                                    value={minute}
                                    onChange={(e) => setMinute(+e.target.value)}
                                    className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-violet-500 [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:shadow-lg"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span>00</span>
                                  <span>30</span>
                                  <span>59</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Direct Time Input */}
                              <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                  <FiType className="text-cyan-600" />
                                  Enter Time (24h)
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={timeString}
                                    onChange={(e) =>
                                      handleTimeStringChange(e.target.value)
                                    }
                                    placeholder="HH:MM"
                                    pattern="\d{1,2}:\d{2}"
                                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-center text-xl font-bold focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                  />
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                                    24h
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Format: 00:00 to 23:59
                                </p>
                              </div>

                              {/* Quick Time Presets */}
                              <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Quick Presets
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    "09:00",
                                    "12:00",
                                    "15:00",
                                    "18:00",
                                    "21:00",
                                    "06:00",
                                  ].map((preset) => (
                                    <button
                                      key={preset}
                                      onClick={() =>
                                        handleTimeStringChange(preset)
                                      }
                                      className="py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/20 dark:hover:to-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all font-medium"
                                    >
                                      {preset}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Alarm Settings */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                              <FiBell className="text-violet-600 dark:text-violet-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              Alarm Settings
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Count Input */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                  <FiHash className="text-violet-600" />
                                  Ring Count
                                </label>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                                    {count}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    ring{count !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={count}
                                    onChange={(e) => {
                                      const value = Math.max(
                                        1,
                                        Math.min(10, +e.target.value || 1),
                                      );
                                      setCount(value);
                                    }}
                                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-center text-lg font-bold focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    placeholder="1-10"
                                  />
                                </div>
                                <div className="grid grid-cols-5 gap-1 flex-1">
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                      key={num}
                                      onClick={() => setCount(num)}
                                      className={`py-2 rounded-lg font-medium transition-all ${
                                        count === num
                                          ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                                          : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20"
                                      }`}
                                    >
                                      {num}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Duration Input */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                  <FiTarget className="text-rose-600" />
                                  Duration (seconds)
                                </label>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                                    {duration}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    seconds
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={duration}
                                    onChange={(e) => {
                                      const value = Math.max(
                                        1,
                                        Math.min(60, +e.target.value || 1),
                                      );
                                      setDuration(value);
                                    }}
                                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-center text-lg font-bold focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                    placeholder="1-60"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-1 flex-1">
                                  {[3, 5, 10].map((sec) => (
                                    <button
                                      key={sec}
                                      onClick={() => setDuration(sec)}
                                      className={`py-2 rounded-lg font-medium transition-all ${
                                        duration === sec
                                          ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg"
                                          : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20"
                                      }`}
                                    >
                                      {sec}s
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-100 dark:border-gray-700/50">
                      {editIndex === null ? (
                        <>
                          <motion.button
                            onClick={addSchedule}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                          >
                            <FiSave className="text-xl" />
                            <span>Create Schedule</span>
                          </motion.button>
                          <button
                            onClick={clearForm}
                            className="px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            onClick={updateSchedule}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                          >
                            <FiSave className="text-xl" />
                            <span>Update Schedule</span>
                          </motion.button>
                          <button
                            onClick={clearForm}
                            className="px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors font-semibold"
                          >
                            Cancel Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Schedule List Section */}
          <div
            className={`lg:col-span-1 ${activeTab !== "list" ? "hidden lg:block" : "block"}`}
          >
            <div
              className={`h-full rounded-3xl ${glassEffect} shadow-2xl flex flex-col overflow-hidden`}
            >
              {/* List Header */}
              <div className="p-6 lg:p-8 border-b border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg">
                      <FiBell className="text-xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Active Schedules
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Real-time updates
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold">
                    {schedules.length}
                  </div>
                </div>
              </div>

              {/* Schedule List */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                  {schedules.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-12">
                      <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-6">
                        <FiClock className="text-3xl text-gray-400 dark:text-gray-500" />
                      </div>
                      <h4 className="text-gray-800 dark:text-gray-200 font-bold text-lg mb-2">
                        No schedules yet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                        Create your first schedule to get started
                      </p>
                      <motion.button
                        onClick={() => {
                          setIsAdding(true);
                          setActiveTab("form");
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        Create First Schedule
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {schedules.map((schedule) => (
                        <ScheduleItem
                          key={schedule.index}
                          schedule={schedule}
                          onEdit={loadSchedule}
                          onDelete={deleteSchedule}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Stats Footer */}
                {schedules.length > 0 && (
                  <div className="p-6 border-t border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/30 dark:to-gray-900/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800/30">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/40">
                            <FiBell className="text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                              {schedules.reduce((sum, s) => sum + s.count, 0)}
                            </div>
                            <div className="text-sm text-cyan-600 dark:text-cyan-400">
                              Total Rings
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/40">
                            <FiZap className="text-violet-600 dark:text-violet-400" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                              {schedules.reduce(
                                (sum, s) => sum + s.count * s.duration,
                                0,
                              )}
                              s
                            </div>
                            <div className="text-sm text-violet-600 dark:text-violet-400">
                              Total Duration
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 lg:mt-12"
        >
          <div className={`p-4 rounded-2xl ${glassEffect} shadow-lg`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Connected
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • Real-time MQTT synchronization
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FiZap className="text-amber-500" />
                  <span>Auto-refresh enabled</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div>Secure WebSocket connection</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
