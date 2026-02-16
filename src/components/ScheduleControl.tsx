import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiEdit2,
  FiPlus,
  FiClock,
  FiBell,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiCalendar,
  FiWatch,
  FiZap,
  FiToggleLeft,
  FiToggleRight,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiStar,
  FiHeart,
  FiShare2,
  FiMoreVertical,
  FiFilter,
  FiSearch,
  FiCommand,
  FiCpu,
  FiActivity,
  FiTrendingUp,
  FiPieChart,
  FiAward,
  FiMapPin,
  FiGlobe,
  FiWifi,
  FiWifiOff,
} from "react-icons/fi";
import { publish } from "../mqtt/mqttService";
import type { Schedule } from "../types/schedule";

type Props = {
  schedules: Schedule[];
  reload: () => void;
};

// Enhanced glass morphism effect with multiple layers
const glassEffect = {
  light: "bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/5",
  dark: "dark:bg-gray-900/80 dark:backdrop-blur-xl dark:border-gray-700/50 dark:shadow-2xl dark:shadow-black/20"
};

const neonGlow = "shadow-[0_0_30px_rgba(34,211,238,0.3)] dark:shadow-[0_0_40px_rgba(34,211,238,0.2)]";
const gradientText = "bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent";
const gradientTextBlue = "bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent";

type InputMode = "slider" | "text" | "voice";

// Enhanced Schedule Item Component
const ScheduleItem = memo(({
  schedule,
  onEdit,
  onDelete,
  onToggleEnable,
  onDuplicate,
  onFavorite,
  isFavorite,
}: {
  schedule: Schedule;
  onEdit: (s: Schedule) => void;
  onDelete: (index: number) => void;
  onToggleEnable: (index: number, enabled: boolean) => void;
  onDuplicate?: (s: Schedule) => void;
  onFavorite?: (index: number) => void;
  isFavorite?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const time = `${String(schedule.hour).padStart(2, "0")}:${String(schedule.minute).padStart(2, "0")}`;
  const period = schedule.hour >= 12 ? "PM" : "AM";
  const isEnabled = schedule.enabled !== false;

  // Calculate time until next alarm
  const getTimeUntil = () => {
    const now = new Date();
    const alarm = new Date();
    alarm.setHours(schedule.hour, schedule.minute, 0);
    
    if (alarm < now) {
      alarm.setDate(alarm.getDate() + 1);
    }
    
    const diff = alarm.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const timeUntil = getTimeUntil();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group rounded-2xl transition-all duration-500 ${
        isEnabled 
          ? glassEffect.light + " " + glassEffect.dark + " " + (isHovered ? neonGlow : "")
          : "bg-gray-100/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30"
      } overflow-hidden`}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"
        animate={{
          opacity: isHovered ? 0.15 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Status Indicator with Pulse Animation */}
      <motion.div
        animate={{
          scale: isEnabled ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isEnabled ? Infinity : 0,
          ease: "easeInOut",
        }}
        className={`absolute top-0 left-0 w-1.5 h-full ${
          isEnabled 
            ? "bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500"
            : "bg-gradient-to-b from-gray-400 to-gray-500"
        }`}
      />

      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Time Display with 3D Effect */}
          <div className="relative flex-shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${
                isEnabled
                  ? "bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600"
                  : "bg-gradient-to-br from-gray-400 to-gray-500"
              } shadow-xl flex items-center justify-center relative overflow-hidden`}
            >
              {/* Animated Ring */}
              {isEnabled && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)",
                  }}
                />
              )}
              <FiClock className="text-3xl sm:text-4xl text-white relative z-10" />
            </motion.div>
            
            {/* Index Badge with Animation */}
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white dark:border-gray-800"
            >
              {schedule.index + 1}
            </motion.div>

            {/* Favorite Badge */}
            {isFavorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg"
              >
                <FiStar className="text-white text-xs" />
              </motion.div>
            )}
          </div>

          {/* Schedule Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className={`text-3xl sm:text-4xl font-black ${gradientText}`}>
                {time}
              </h3>
              <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {period}
              </span>
            </div>

            {/* Tags with Hover Effects */}
            <div className="flex flex-wrap gap-2 mt-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  isEnabled
                    ? "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 border border-cyan-200 dark:border-cyan-800/40"
                    : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <FiBell className={isEnabled ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500"} />
                <span className={`text-sm font-semibold ${isEnabled ? "text-cyan-700 dark:text-cyan-300" : "text-gray-500"}`}>
                  {schedule.count} {schedule.count === 1 ? 'ring' : 'rings'}
                </span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  isEnabled
                    ? "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800/40"
                    : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <FiWatch className={isEnabled ? "text-violet-600 dark:text-violet-400" : "text-gray-500"} />
                <span className={`text-sm font-semibold ${isEnabled ? "text-violet-700 dark:text-violet-300" : "text-gray-500"}`}>
                  {schedule.duration}s
                </span>
              </motion.div>

              {/* Time Until Badge */}
              {isEnabled && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800/40"
                >
                  <FiZap className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {timeUntil.hours > 0 ? `${timeUntil.hours}h` : ''} {timeUntil.minutes}m
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <motion.button
              onClick={() => onToggleEnable(schedule.index, !isEnabled)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-xl transition-all ${
                isEnabled
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl"
              }`}
              title={isEnabled ? "Disable" : "Enable"}
            >
              {isEnabled ? <FiToggleRight className="text-xl" /> : <FiToggleLeft className="text-xl" />}
            </motion.button>
            
            <motion.button
              onClick={() => onEdit(schedule)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
              title="Edit"
            >
              <FiEdit2 className="text-xl" />
            </motion.button>
            
            {onDuplicate && (
              <motion.button
                onClick={() => onDuplicate(schedule)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                title="Duplicate"
              >
                <FiCopy className="text-xl" />
              </motion.button>
            )}
            
            <motion.button
              onClick={() => onDelete(schedule.index)}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl"
              title="Delete"
            >
              <FiTrash2 className="text-xl" />
            </motion.button>
          </div>

          {/* Mobile Action Button */}
          <div className="lg:hidden absolute top-4 right-4">
            <motion.button
              onClick={() => setShowActions(!showActions)}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
            >
              <FiMoreVertical className="text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Action Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden mt-4 grid grid-cols-4 gap-2"
            >
              <button
                onClick={() => {
                  onToggleEnable(schedule.index, !isEnabled);
                  setShowActions(false);
                }}
                className={`p-3 rounded-xl ${
                  isEnabled
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {isEnabled ? <FiToggleRight className="text-xl mx-auto" /> : <FiToggleLeft className="text-xl mx-auto" />}
              </button>
              <button
                onClick={() => {
                  onEdit(schedule);
                  setShowActions(false);
                }}
                className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
              >
                <FiEdit2 className="text-xl mx-auto" />
              </button>
              {onDuplicate && (
                <button
                  onClick={() => {
                    onDuplicate(schedule);
                    setShowActions(false);
                  }}
                  className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                >
                  <FiCopy className="text-xl mx-auto" />
                </button>
              )}
              <button
                onClick={() => {
                  onDelete(schedule.index);
                  setShowActions(false);
                }}
                className="p-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
              >
                <FiTrash2 className="text-xl mx-auto" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Badge with Enhanced Animation */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
          <motion.div
            animate={{
              scale: isEnabled ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isEnabled ? Infinity : 0,
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5 ${
              isEnabled
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
            }`}
          >
            {isEnabled && <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />}
            <span>{isEnabled ? "Active" : "Disabled"}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

ScheduleItem.displayName = "ScheduleItem";

export default function ScheduleControl({ schedules, reload }: Props) {
  // State Management
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [count, setCount] = useState(1);
  const [duration, setDuration] = useState(3);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
    icon?: React.ReactNode;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "list">("list");
  const [inputMode, setInputMode] = useState<InputMode>("slider");
  const [timeString, setTimeString] = useState("09:00");
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "disabled">("all");
  const [sortBy, setSortBy] = useState<"time" | "index" | "duration">("time");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">("connected");
  const [statsView, setStatsView] = useState<"compact" | "detailed">("compact");
  const previousSchedulesLength = useRef(schedules.length);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtered and sorted schedules
  const filteredSchedules = schedules
    .filter(s => {
      if (filterStatus === "active") return s.enabled !== false;
      if (filterStatus === "disabled") return s.enabled === false;
      return true;
    })
    .filter(s => {
      if (!searchQuery) return true;
      const timeStr = `${s.hour}:${s.minute}`;
      return timeStr.includes(searchQuery) || s.index.toString().includes(searchQuery);
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return a.hour * 60 + a.minute - (b.hour * 60 + b.minute);
      } else if (sortBy === "duration") {
        return a.duration - b.duration;
      }
      return a.index - b.index;
    });

  // Statistics
  const totalRings = schedules.reduce((sum, s) => sum + (s.enabled !== false ? s.count : 0), 0);
  const totalDuration = schedules.reduce((sum, s) => sum + (s.enabled !== false ? s.count * s.duration : 0), 0);
  const enabledCount = schedules.filter(s => s.enabled !== false).length;
  const disabledCount = schedules.length - enabledCount;
  const averageDuration = schedules.length > 0 
    ? Math.round(schedules.reduce((sum, s) => sum + s.duration, 0) / schedules.length) 
    : 0;
  const mostActiveHour = schedules.reduce((acc, s) => {
    acc[s.hour] = (acc[s.hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const peakHour = Object.entries(mostActiveHour).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Effects
  useEffect(() => {
    setTimeString(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
  }, [hour, minute]);

  useEffect(() => {
    // Simulate connection status changes
    const interval = setInterval(() => {
      setConnectionStatus(prev => {
        if (prev === "connected") return Math.random() > 0.9 ? "reconnecting" : "connected";
        if (prev === "reconnecting") return Math.random() > 0.7 ? "connected" : "reconnecting";
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        setIsAdding(true);
        setActiveTab("form");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper Functions
  const showNotification = useCallback((
    type: "success" | "error" | "info" | "warning", 
    message: string,
    icon?: React.ReactNode
  ) => {
    setNotification({ type, message, icon });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handleTimeStringChange = (value: string) => {
    setTimeString(value);
    const [h, m] = value.split(":").map(Number);
    if (!isNaN(h) && h >= 0 && h <= 23 && !isNaN(m) && m >= 0 && m <= 59) {
      setHour(h);
      setMinute(m);
    }
  };

  const handleReload = useCallback(() => {
    setIsLoading(true);
    reload();
    showNotification("info", "Refreshing schedules...", <FiRefreshCw className="animate-spin" />);
    setTimeout(() => setIsLoading(false), 1000);
  }, [reload, showNotification]);

  const toggleScheduleEnable = useCallback((index: number, enabled: boolean) => {
    try {
      const schedule = schedules.find(s => s.index === index);
      if (schedule) {
        publish(`UPD:${index}:${schedule.hour}:${schedule.minute}:${schedule.count}:${schedule.duration}:${enabled ? 1 : 0}`);
        showNotification("success", `Schedule ${enabled ? "enabled" : "disabled"}`, 
          enabled ? <FiToggleRight /> : <FiToggleLeft />
        );
        reload();
      }
    } catch (error) {
      showNotification("error", `Failed to ${enabled ? "enable" : "disable"} schedule`);
    }
  }, [schedules, reload, showNotification]);

  const toggleMasterEnable = useCallback((enabled: boolean) => {
    try {
      publish(enabled ? "ENABLE_ALL" : "DISABLE_ALL");
      setMasterEnabled(enabled);
      showNotification("success", `All schedules ${enabled ? "enabled" : "disabled"}`, 
        enabled ? <FiToggleRight /> : <FiToggleLeft />
      );
      setTimeout(() => reload(), 100);
    } catch (error) {
      showNotification("error", `Failed to ${enabled ? "enable" : "disable"} all schedules`);
    }
  }, [reload, showNotification]);

  const addSchedule = useCallback(() => {
    try {
      publish(`ADD:${hour}:${minute}:${count}:${duration}`);
      showNotification("success", "Schedule created!", <FiCheck />);
      clearForm();
      reload();
      setIsAdding(false);
      setActiveTab("list");
    } catch (error) {
      showNotification("error", "Failed to create schedule");
    }
  }, [hour, minute, count, duration, reload, showNotification]);

  const updateSchedule = useCallback(() => {
    if (editIndex === null) return;
    try {
      const existingSchedule = schedules.find(s => s.index === editIndex);
      const enabled = existingSchedule ? existingSchedule.enabled !== false : true;
      publish(`UPD:${editIndex}:${hour}:${minute}:${count}:${duration}:${enabled ? 1 : 0}`);
      showNotification("success", "Schedule updated!", <FiCheck />);
      clearForm();
      reload();
      setActiveTab("list");
    } catch (error) {
      showNotification("error", "Failed to update schedule");
    }
  }, [editIndex, hour, minute, count, duration, schedules, reload, showNotification]);

  const deleteSchedule = useCallback((index: number) => {
    try {
      publish(`DEL:${index}`);
      showNotification("success", "Schedule deleted", <FiTrash2 />);
      reload();
    } catch (error) {
      showNotification("error", "Failed to delete schedule");
    }
  }, [reload, showNotification]);

  const duplicateSchedule = useCallback((schedule: Schedule) => {
    try {
      publish(`ADD:${schedule.hour}:${schedule.minute}:${schedule.count}:${schedule.duration}`);
      showNotification("success", "Schedule duplicated!", <FiCopy />);
      reload();
    } catch (error) {
      showNotification("error", "Failed to duplicate schedule");
    }
  }, [reload, showNotification]);

  const toggleFavorite = useCallback((index: number) => {
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

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

  // Create schedule button handler
  const handleCreateClick = useCallback(() => {
    setIsAdding(true);
    setActiveTab("form");
    // Clear any existing edit state
    setEditIndex(null);
    setHour(9);
    setMinute(0);
    setCount(1);
    setDuration(3);
    setTimeString("09:00");
  }, []);

  const requestList = useCallback(() => {
    try {
      publish("LIST");
      showNotification("info", "Requesting schedule list...", <FiDownload />);
      setTimeout(() => reload(), 500);
    } catch (error) {
      showNotification("error", "Failed to request schedule list");
    }
  }, [reload, showNotification]);

  const exportSchedules = useCallback(() => {
    try {
      const dataStr = JSON.stringify(schedules, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `schedules_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showNotification("success", "Schedules exported!", <FiUpload />);
    } catch (error) {
      showNotification("error", "Failed to export schedules");
    }
  }, [schedules, showNotification]);

  // Enhanced Notification Component
  const Notification = ({ notification:any }: { notification: typeof notification }) => {
    const icons = {
      success: <FiCheck className="text-emerald-500" />,
      error: <FiAlertCircle className="text-rose-500" />,
      info: <FiActivity className="text-cyan-500" />,
      warning: <FiAlertCircle className="text-amber-500" />
    };

    return (
      <motion.div
        initial={{ y: -100, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.5 }}
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] max-w-md ${
          notification?.type === "success" ? "bg-gradient-to-r from-emerald-500 to-teal-600" :
          notification?.type === "error" ? "bg-gradient-to-r from-rose-500 to-pink-600" :
          notification?.type === "warning" ? "bg-gradient-to-r from-amber-500 to-orange-600" :
          "bg-gradient-to-r from-cyan-500 to-blue-600"
        } text-white border border-white/20`}
      >
        <div className="p-2 rounded-lg bg-white/20 backdrop-blur">
          {notification?.icon || null }
        </div>
        <span className="font-medium text-sm flex-1">{notification?.message}</span>
        <button
          onClick={() => setNotification(null)}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        >
          <FiX size={18} />
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-cyan-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-900/20" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Notification */}
        <AnimatePresence mode="wait">
          {notification && <Notification notification={notification} />}
        </AnimatePresence>

        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 lg:mb-8"
        >
          <div className={`p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl ${glassEffect.light} ${glassEffect.dark} shadow-2xl`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl"
                >
                  <FiCalendar className="text-xl sm:text-2xl lg:text-3xl text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Bell Scheduler Pro
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-2 h-2 rounded-full ${
                          connectionStatus === "connected" ? "bg-emerald-500" :
                          connectionStatus === "reconnecting" ? "bg-amber-500" : "bg-rose-500"
                        }`}
                      />
                      <span className={`text-xs sm:text-sm font-medium ${
                        connectionStatus === "connected" ? "text-emerald-600 dark:text-emerald-400" :
                        connectionStatus === "reconnecting" ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
                      }`}>
                        {connectionStatus === "connected" ? "Connected" :
                         connectionStatus === "reconnecting" ? "Reconnecting..." : "Disconnected"}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {enabledCount} active • {disabledCount} disabled
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Header Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Create Schedule Button - Prominent in Header */}
                <motion.button
                  onClick={handleCreateClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl"
                >
                  <FiPlus className="text-lg" />
                  <span className="hidden sm:inline">Create Schedule</span>
                </motion.button>

                {/* Export Button */}
                <motion.button
                  onClick={exportSchedules}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl"
                  title="Export schedules"
                >
                  <FiUpload />
                </motion.button>

                {/* Master Control */}
                <motion.button
                  onClick={() => toggleMasterEnable(!masterEnabled)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all ${
                    masterEnabled
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {masterEnabled ? <FiToggleRight className="text-lg" /> : <FiToggleLeft className="text-lg" />}
                  <span className="hidden sm:inline">{masterEnabled ? "All Enabled" : "All Disabled"}</span>
                </motion.button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search schedules... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  <FiCommand className="inline" /> K
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="time">Sort by Time</option>
                  <option value="index">Sort by Index</option>
                  <option value="duration">Sort by Duration</option>
                </select>
                
                <button
                  onClick={() => setCompactView(!compactView)}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  {compactView ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800/30">
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{totalRings}</div>
                <div className="text-xs text-cyan-600 dark:text-cyan-400">Total Rings</div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/30">
                <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">{totalDuration}s</div>
                <div className="text-xs text-violet-600 dark:text-violet-400">Total Time</div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30">
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{averageDuration}s</div>
                <div className="text-xs text-amber-600 dark:text-amber-400">Avg Duration</div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/30">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{peakHour}:00</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Peak Hour</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Create Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <motion.button
            onClick={handleCreateClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl flex items-center justify-center"
          >
            <FiPlus className="text-2xl" />
          </motion.button>
        </div>

        {/* Desktop Create Button - Prominent Card for empty state */}
        {schedules.length === 0 && !isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 lg:mb-8"
          >
            <div className={`p-8 rounded-2xl lg:rounded-3xl ${glassEffect.light} ${glassEffect.dark} shadow-2xl text-center`}>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <FiBell className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Schedules Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first schedule to start managing bells</p>
              <motion.button
                onClick={handleCreateClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl"
              >
                <FiPlus />
                Create First Schedule
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className={`lg:col-span-4 ${activeTab !== "form" ? "hidden lg:block" : "block"}`}>
            {(isAdding || editIndex !== null || activeTab === "form") && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`sticky top-6 ${glassEffect.light} ${glassEffect.dark} rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden`}
              >
                {/* Form Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
                        {editIndex === null ? <FiPlus className="text-white" /> : <FiEdit2 className="text-white" />}
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                          {editIndex === null ? "Create Schedule" : "Edit Schedule"}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {editIndex === null ? "Add a new alarm" : `Editing schedule #${editIndex + 1}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearForm}
                      className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FiX className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Time Preview */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 sm:p-6 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800/30 text-center"
                  >
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Preview</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {count} {count === 1 ? 'ring' : 'rings'} • {duration}s each
                    </p>
                  </motion.div>

                  {/* Input Mode Tabs */}
                  <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {(["slider", "text"] as InputMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setInputMode(mode)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                          inputMode === mode
                            ? "bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Time Input */}
                  {inputMode === "slider" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hour: {hour.toString().padStart(2, "0")}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="23"
                          value={hour}
                          onChange={(e) => setHour(+e.target.value)}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>00</span>
                          <span>12</span>
                          <span>23</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Minute: {minute.toString().padStart(2, "0")}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="59"
                          value={minute}
                          onChange={(e) => setMinute(+e.target.value)}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>00</span>
                          <span>30</span>
                          <span>59</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Time (24h format)
                      </label>
                      <input
                        type="text"
                        value={timeString}
                        onChange={(e) => handleTimeStringChange(e.target.value)}
                        placeholder="HH:MM"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-center text-xl font-bold focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: 00:00 to 23:59</p>
                    </div>
                  )}

                  {/* Count and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rings
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={count}
                        onChange={(e) => setCount(Math.max(1, Math.min(10, +e.target.value || 1)))}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (s)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={duration}
                        onChange={(e) => setDuration(Math.max(1, Math.min(60, +e.target.value || 1)))}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-center font-bold"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {editIndex === null ? (
                      <motion.button
                        onClick={addSchedule}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                      >
                        Create Schedule
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={updateSchedule}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                      >
                        Update Schedule
                      </motion.button>
                    )}
                    <button
                      onClick={clearForm}
                      className="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Schedule List Section */}
          <div className={`lg:col-span-8 ${activeTab !== "list" ? "hidden lg:block" : "block"}`}>
            <div className={`rounded-2xl lg:rounded-3xl ${glassEffect.light} ${glassEffect.dark} shadow-2xl overflow-hidden`}>
              {/* List Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg">
                      <FiBell className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                        Schedules ({filteredSchedules.length})
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {enabledCount} active, {disabledCount} disabled
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReload}
                    className="p-2 sm:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    <FiRefreshCw className={`text-gray-700 dark:text-gray-300 ${isLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Schedule List */}
              <div className="overflow-y-auto max-h-[600px] lg:max-h-[700px] p-4 sm:p-6">
                {filteredSchedules.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                      <FiClock className="text-3xl text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      No schedules found
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {searchQuery ? "Try adjusting your search" : "Create your first schedule to get started"}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={handleCreateClick}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        Create First Schedule
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    className="space-y-3"
                  >
                    {filteredSchedules.map((schedule) => (
                      <ScheduleItem
                        key={schedule.index}
                        schedule={schedule}
                        onEdit={loadSchedule}
                        onDelete={deleteSchedule}
                        onToggleEnable={toggleScheduleEnable}
                        onDuplicate={duplicateSchedule}
                        onFavorite={toggleFavorite}
                        isFavorite={favorites.includes(schedule.index)}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Stats Footer */}
              {schedules.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/30 dark:to-gray-900/30">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">{schedules.length}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                      <div className="text-lg font-bold text-emerald-600">{enabledCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Disabled</div>
                      <div className="text-lg font-bold text-gray-500">{disabledCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Rings/Day</div>
                      <div className="text-lg font-bold text-cyan-600">{totalRings}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 lg:mt-8"
        >
          <div className={`p-4 rounded-xl ${glassEffect.light} ${glassEffect.dark} shadow-lg`}>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
                  connectionStatus === "connected" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                  connectionStatus === "reconnecting" ? "bg-amber-100 dark:bg-amber-900/30" :
                  "bg-rose-100 dark:bg-rose-900/30"
                }`}>
                  {connectionStatus === "connected" ? <FiWifi className="text-emerald-600" /> : <FiWifiOff className="text-rose-600" />}
                  <span className={`font-medium ${
                    connectionStatus === "connected" ? "text-emerald-700" :
                    connectionStatus === "reconnecting" ? "text-amber-700" :
                    "text-rose-700"
                  }`}>
                    {connectionStatus}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">ESP8266 Bell Controller</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400">Max: 30 schedules</span>
                <span className="text-gray-600 dark:text-gray-400">v2.0.0</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}