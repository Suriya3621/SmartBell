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
  FiToggleLeft,
  FiToggleRight,
  FiRefreshCw,
  FiDownload,
  FiCopy,
  FiSearch,
  FiActivity,
  FiWifi,
  FiWifiOff,
  FiMoreVertical,
} from "react-icons/fi";
import { publish } from "../mqtt/mqttService";
import type { Schedule } from "../types/schedule";

type Props = {
  schedules: Schedule[];
  reload: () => void;
};

// Schedule Item Component with working 3-dot menu
const ScheduleItem = memo(({
  schedule,
  onEdit,
  onDelete,
  onToggleEnable,
  onDuplicate,
}: {
  schedule: Schedule;
  onEdit: (s: Schedule) => void;
  onDelete: (index: number) => void;
  onToggleEnable: (index: number, enabled: boolean) => void;
  onDuplicate?: (s: Schedule) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const time = `${String(schedule.hour).padStart(2, "0")}:${String(schedule.minute).padStart(2, "0")}`;
  const period = schedule.hour >= 12 ? "PM" : "AM";
  const isEnabled = schedule.enabled !== false;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-lg border ${
      isEnabled ? 'border-l-4 border-l-emerald-500 border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700 opacity-75'
    }`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Time Display */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-lg ${
            isEnabled ? 'bg-emerald-500' : 'bg-gray-400'
          } flex items-center justify-center text-white font-bold`}>
            <div className="text-center">
              <div className="text-lg">{time}</div>
              <div className="text-xs">{period}</div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500">#{schedule.index + 1}</span>
              <span className="text-xs text-gray-500">•</span>
              <FiBell className="text-gray-400" size={12} />
              <span className="text-xs text-gray-600 dark:text-gray-300">{schedule.count}</span>
              <span className="text-xs text-gray-500">•</span>
              <FiWatch className="text-gray-400" size={12} />
              <span className="text-xs text-gray-600 dark:text-gray-300">{schedule.duration}s</span>
            </div>
            
            {/* Status */}
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
              isEnabled
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {isEnabled ? 'Active' : 'Disabled'}
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <button
            onClick={() => onToggleEnable(schedule.index, !isEnabled)}
            className={`p-2 rounded-lg ${
              isEnabled
                ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
            }`}
            title={isEnabled ? 'Disable' : 'Enable'}
          >
            {isEnabled ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
          </button>

          {/* 3-dot Menu - Now working properly */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMoreVertical size={18} className="text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
                <button
                  onClick={() => {
                    onEdit(schedule);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FiEdit2 size={14} className="text-blue-500" />
                  Edit
                </button>
                
                {onDuplicate && (
                  <button
                    onClick={() => {
                      onDuplicate(schedule);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FiCopy size={14} className="text-purple-500" />
                    Duplicate
                  </button>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Schedule</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete the schedule at {time}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onDelete(schedule.index);
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ScheduleItem.displayName = "ScheduleItem";

export default function ScheduleControl({ schedules, reload }: Props) {
  // State
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [count, setCount] = useState(1);
  const [duration, setDuration] = useState(3);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'disabled'>('all');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtered schedules
  const filteredSchedules = schedules
    .filter(s => {
      if (filterStatus === 'active') return s.enabled !== false;
      if (filterStatus === 'disabled') return s.enabled === false;
      return true;
    })
    .filter(s => {
      if (!searchQuery) return true;
      const timeStr = `${s.hour}:${s.minute}`;
      return timeStr.includes(searchQuery) || s.index.toString().includes(searchQuery);
    });

  // Stats
  const enabledCount = schedules.filter(s => s.enabled !== false).length;

  // Connection status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.9 ? 'disconnected' : 'connected');
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        setIsAdding(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleReload = useCallback(() => {
    setIsLoading(true);
    reload();
    showNotification('info', 'Refreshing schedules...');
    setTimeout(() => setIsLoading(false), 1000);
  }, [reload, showNotification]);

  const toggleScheduleEnable = useCallback((index: number, enabled: boolean) => {
    const schedule = schedules.find(s => s.index === index);
    if (schedule) {
      publish(`UPD:${index}:${schedule.hour}:${schedule.minute}:${schedule.count}:${schedule.duration}:${enabled ? 1 : 0}`);
      showNotification('success', `Schedule ${enabled ? 'enabled' : 'disabled'}`);
      reload();
    }
  }, [schedules, reload, showNotification]);

  const addSchedule = useCallback(() => {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      showNotification('error', 'Invalid time');
      return;
    }
    if (count < 1 || count > 20) {
      showNotification('error', 'Rings must be 1-20');
      return;
    }
    if (duration < 1 || duration > 300) {
      showNotification('error', 'Duration must be 1-300 seconds');
      return;
    }
    
    publish(`ADD:${hour}:${minute}:${count}:${duration}`);
    showNotification('success', 'Schedule created');
    clearForm();
    reload();
  }, [hour, minute, count, duration, reload, showNotification]);

  const updateSchedule = useCallback(() => {
    if (editIndex === null) return;
    
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      showNotification('error', 'Invalid time');
      return;
    }
    if (count < 1 || count > 20) {
      showNotification('error', 'Rings must be 1-20');
      return;
    }
    if (duration < 1 || duration > 300) {
      showNotification('error', 'Duration must be 1-300 seconds');
      return;
    }

    const existing = schedules.find(s => s.index === editIndex);
    const enabled = existing ? existing.enabled !== false : true;
    publish(`UPD:${editIndex}:${hour}:${minute}:${count}:${duration}:${enabled ? 1 : 0}`);
    showNotification('success', 'Schedule updated');
    clearForm();
    reload();
  }, [editIndex, hour, minute, count, duration, schedules, reload, showNotification]);

  const deleteSchedule = useCallback((index: number) => {
    publish(`DEL:${index}`);
    showNotification('success', 'Schedule deleted');
    reload();
  }, [reload, showNotification]);

  const duplicateSchedule = useCallback((schedule: Schedule) => {
    publish(`ADD:${schedule.hour}:${schedule.minute}:${schedule.count}:${schedule.duration}`);
    showNotification('success', 'Schedule duplicated');
    reload();
  }, [reload, showNotification]);

  const loadSchedule = useCallback((s: Schedule) => {
    setEditIndex(s.index);
    setHour(s.hour);
    setMinute(s.minute);
    setCount(s.count);
    setDuration(s.duration);
    setIsAdding(true);
  }, []);

  const clearForm = useCallback(() => {
    setEditIndex(null);
    setHour(9);
    setMinute(0);
    setCount(1);
    setDuration(3);
    setIsAdding(false);
  }, []);

  const requestList = useCallback(() => {
    publish('LIST');
    showNotification('info', 'Requesting schedule list...');
    setTimeout(() => reload(), 500);
  }, [reload, showNotification]);

  // Notification Component
  const Notification = ({ notification:any }: { notification: typeof notification }) => {
    const colors = {
      success: 'bg-emerald-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };

    const icons = {
      success: <FiCheck size={18} />,
      error: <FiAlertCircle size={18} />,
      info: <FiActivity size={18} />
    };

    if (!notification) return null;

    return (
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${colors[notification?.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
      >
        {icons[notification?.type]}
        <span className="text-sm flex-1">{notification?.message}</span>
        <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/20 rounded">
          <FiX size={16} />
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Notification */}
        <AnimatePresence>
          {notification && <Notification notification={notification} />}
        </AnimatePresence>

        {/* Header */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FiBell className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bell Scheduler</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-500">
                      {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{enabledCount} active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={requestList}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Request List"
                >
                  <FiDownload size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={handleReload}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  disabled={isLoading}
                >
                  <FiRefreshCw className={`text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} size={18} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search schedules... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {editIndex !== null ? `Edit Schedule #${editIndex + 1}` : isAdding ? 'New Schedule' : 'Schedule Manager'}
                </h2>
              </div>

              {isAdding || editIndex !== null ? (
                <div className="p-4 space-y-4">
                  {/* Time */}
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Time</label>
                    <div className="flex gap-2">
                      <select
                        value={hour}
                        onChange={(e) => setHour(+e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      <span className="text-gray-500 self-center">:</span>
                      <select
                        value={minute}
                        onChange={(e) => setMinute(+e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Rings - Fixed: Now allows up to 20 */}
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Rings (1-20)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={count}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val)) setCount(1);
                        else if (val < 1) setCount(1);
                        else if (val > 20) setCount(20);
                        else setCount(val);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Duration (1-300s)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={duration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val)) setDuration(3);
                        else if (val < 1) setDuration(1);
                        else if (val > 300) setDuration(300);
                        else setDuration(val);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                    />
                  </div>

                  {/* Preview */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Preview</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {count} ring{count !== 1 ? 's' : ''} • {duration}s
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {editIndex === null ? (
                      <button
                        onClick={addSchedule}
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Create
                      </button>
                    ) : (
                      <button
                        onClick={updateSchedule}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        Update
                      </button>
                    )}
                    <button
                      onClick={clearForm}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPlus size={18} />
                    Add Schedule
                  </button>

                  {/* Tips */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Quick Tips</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Ctrl+N for new schedule</li>
                      <li>• Ctrl+K to search</li>
                      <li>• Click ⋮ for more options</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Schedule List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Schedules ({filteredSchedules.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {filteredSchedules.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiClock className="mx-auto text-3xl text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      {searchQuery ? 'No matches found' : 'No schedules yet'}
                    </p>
                  </div>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <ScheduleItem
                      key={schedule.index}
                      schedule={schedule}
                      onEdit={loadSchedule}
                      onDelete={deleteSchedule}
                      onToggleEnable={toggleScheduleEnable}
                      onDuplicate={duplicateSchedule}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}