import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiBell,
  FiInfo,
  FiMenu,
  FiX,
  FiClock,
  FiPlayCircle,
  FiSun,
  FiMoon,
  FiZap,
} from "react-icons/fi";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light",
  );
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close menu with animation
  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200); // Match this with CSS transition
  };

  const navItems = [
    {
      path: "/home/schedules",
      label: "Schedules",
      icon: FiClock,
      gradient: "from-cyan-400 to-blue-500",
      color: "text-cyan-500",
    },
    {
      path: "/home/manual",
      label: "Manual",
      icon: FiPlayCircle,
      gradient: "from-emerald-400 to-green-500",
      color: "text-emerald-500",
    },
    {
      path: "/home/about",
      label: "About",
      icon: FiInfo,
      gradient: "from-amber-400 to-orange-500",
      color: "text-amber-500",
    },
  ];

  const getCurrentPage = () => {
    return (
      navItems.find((item) => location.pathname === item.path) || navItems[0]
    );
  };

  const currentPage = getCurrentPage();

  return (
    <>
      {/* Main Navigation - Colorful Glass Design */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 rounded-2xl">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${currentPage.gradient} opacity-20 blur-xl`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${currentPage.gradient} opacity-10 blur-lg`}
          />
        </div>

        {/* Main Nav Container */}
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden">
          {/* Colorful Top Border */}
          <div className={`h-1.5 bg-gradient-to-r ${currentPage.gradient}`} />

          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${currentPage.gradient} blur-md opacity-70 transition-opacity`}
                  />
                  <div
                    className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${currentPage.gradient} shadow-lg flex items-center justify-center transition-all`}
                  >
                    <FiBell className="text-white text-xl" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <FiZap className="text-white text-xs" />
                  </div>
                </div>

                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    AutoBell
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${currentPage.gradient} text-white`}
                    >
                      {currentPage.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation - Colorful Cards */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink key={item.path} to={item.path} className="block">
                      <div
                        className={`relative px-5 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:shadow-md"
                        }`}
                      >
                        {/* Hover Effect */}
                        {!isActive && (
                          <div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-0 hover:opacity-10 transition-opacity`}
                          />
                        )}

                        <div className="relative flex items-center gap-2.5">
                          <Icon
                            className={`text-lg ${
                              isActive ? "text-white" : item.color
                            }`}
                          />
                          <span className="font-semibold">{item.label}</span>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-white/60" />
                        )}
                      </div>
                    </NavLink>
                  );
                })}

                {/* Theme Toggle with Gradient */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`ml-3 p-3 rounded-xl shadow-lg transition-all ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:shadow-xl"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl"
                  }`}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <FiSun size={18} />
                  ) : (
                    <FiMoon size={18} />
                  )}
                </button>
              </div>

              {/* Mobile Menu Button with Gradient */}
              <button
                onClick={() => setIsOpen(true)}
                className={`md:hidden p-3 rounded-xl shadow-lg transition-all ${
                  isOpen
                    ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white"
                    : `bg-gradient-to-r ${currentPage.gradient} text-white hover:shadow-xl`
                }`}
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Optimized for Performance */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-50 md:hidden transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop - Simple overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
            isOpen && !isClosing ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        {/* Menu Panel - CSS transform instead of Framer Motion */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50 transform transition-transform duration-200 ease-out ${
            isOpen && !isClosing ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Menu Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Navigation
              </h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiX className="text-gray-600 dark:text-gray-400" size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentPage.gradient} shadow-xl flex items-center justify-center`}
              >
                <FiBell className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                  {currentPage.label}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a page
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items - Simple list */}
          <div className="p-4 space-y-2 h-[calc(100%-250px)] overflow-y-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`block rounded-xl p-4 transition-all duration-150 ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 30}ms` : "0ms",
                    transform: isOpen ? "translateX(0)" : "translateX(20px)",
                    opacity: isOpen ? 1 : 0,
                    transitionProperty: "transform, opacity",
                    transitionDuration: "200ms",
                    transitionTimingFunction: "ease-out",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <Icon
                          className={
                            isActive ? "text-white" : item.color + " opacity-70"
                          }
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-sm opacity-75 mt-0.5">
                          {item.path.includes("schedules") &&
                            "Manage schedules"}
                          {item.path.includes("manual") && "Manual control"}
                          {item.path.includes("about") && "About project"}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="p-2 rounded-full bg-white/20">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </div>

          {/* Menu Footer - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 dark:border-gray-700 bg-inherit">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Theme
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </p>
              </div>
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  closeMenu();
                }}
                className={`p-3 rounded-xl shadow-lg transition-all ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:shadow-xl"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl"
                }`}
              >
                {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>

            {/* Status Indicator */}
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${currentPage.gradient} bg-opacity-10 border ${currentPage.color.replace(
                "text",
                "border",
              )}/20`}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  System Status: Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add space for fixed nav */}
      <div className="h-30" />
    </>
  );
}
