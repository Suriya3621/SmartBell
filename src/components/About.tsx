import {
  FiAward,
  FiBook,
  FiHeart,
  FiStar,
  FiTarget,
  FiZap,
  FiCpu,
  FiUser,
  FiClock,
  FiBell,
  FiUsers,
} from "react-icons/fi";
import { FaSchool, FaGraduationCap, FaMicrochip, FaWifi } from "react-icons/fa";
import { IoTerminal } from "react-icons/io5";
import { MdAdminPanelSettings, MdVerified, MdSchool } from "react-icons/md";

export default function About() {
  const teamMembers = [
    "R. SURIYAPRAKASH",
    "M. HARICIBA", 
    "M. RITHICK",
    "G. PRADHAP"
  ];

  const techStack = [
    {
      icon: FaMicrochip,
      label: "ESP8266",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      icon: FaWifi,
      label: "Wi-Fi",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: IoTerminal,
      label: "MQTT",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: FiCpu,
      label: "React",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      icon: FiZap,
      label: "TypeScript",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      icon: FiTarget,
      label: "Tailwind",
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
  ];

  return (
    <div className=" bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/50 dark:from-gray-900 dark:via-purple-900/10 dark:to-cyan-900/10 p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 shadow-2xl flex items-center justify-center">
              <FiBell className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg flex items-center justify-center">
              <FiStar className="w-5 h-5 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AutoBell Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            IoT-Powered Automatic Bell System for Educational Institutions
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse" />
            <span className="text-sm font-medium text-cyan-700 dark:text-cyan-400">
              Developed for GOVERNMENT HIGHER SECONDARY SCHOOL, CHINNA SALEM
            </span>
          </div>
        </div>

        {/* Main Content Grid - 3 Columns */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - School Information */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <FaSchool className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    School Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Educational Institution
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                  <div className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    GOVERNMENT HIGHER SECONDARY SCHOOL
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Chinna Salem, Tamil Nadu
                  </div>
                </div>

                <div className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Affiliated to Tamil Nadu State Board
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <MdSchool className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Government Institution
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Established
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center">
                      <FaGraduationCap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Higher Secondary
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Grade 1-12
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Head Master */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-yellow-900/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/30 dark:border-amber-700/30 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <div className="p-6 relative">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-sm" />
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-sm" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                    <MdAdminPanelSettings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      Head Master
                    </h2>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      School Leadership
                    </p>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-30" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl flex items-center justify-center">
                      <FiUser className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg flex items-center justify-center border-2 border-amber-50 dark:border-gray-900">
                      <MdVerified className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Mr. P. VELMURUGAN
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                      <FiAward className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Head Master
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats & Info */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-amber-200/20 dark:border-amber-700/20">
                    <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                      Leadership
                    </div>
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      15+ Years
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-amber-200/20 dark:border-amber-700/20">
                    <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                      Experience
                    </div>
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      25+ Years
                    </div>
                  </div>
                </div>

                {/* Role Description */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-900/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                      <FaGraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Educational Leader
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Academic Excellence
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                      <FiHeart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Student Mentor
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Guidance & Support
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/10">
                  <div className="flex items-start gap-2">
                    <div className="text-2xl text-amber-500">"</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      Embracing technology to enhance traditional education systems
                      and create better learning environments for our students.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Project Guide */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 dark:border-emerald-700/30 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
            <div className="p-6 relative">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-sm" />
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-sm" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      Project Guide
                    </h2>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Mentor & Supervisor
                    </p>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur-xl opacity-30" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-xl flex items-center justify-center">
                      <div className="text-2xl font-bold text-white">VG</div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg flex items-center justify-center border-2 border-emerald-50 dark:border-gray-900">
                      <MdVerified className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Mr. V. GOPINATH
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30">
                      <MdSchool className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Physics Faculty
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats & Info */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-emerald-200/20 dark:border-emerald-700/20">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                      Experience
                    </div>
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      12+ Years
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-emerald-200/20 dark:border-emerald-700/20">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                      Projects
                    </div>
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      20+ Guided
                    </div>
                  </div>
                </div>

                {/* Role Description */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-emerald-50/50 dark:from-gray-800 dark:to-emerald-900/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                      <FiBook className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Technical Mentor
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Project Guidance
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 flex items-center justify-center">
                      <FiZap className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Innovation Catalyst
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Technology Integration
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-green-500/5 border border-emerald-500/10">
                  <div className="flex items-start gap-2">
                    <div className="text-2xl text-emerald-500">"</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      Nurturing young minds to bridge the gap between theoretical
                      knowledge and practical implementation through innovative projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section - Simplified */}
        <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Project Team Members
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  The talented individuals behind AutoBell Pro
                </p>
              </div>
            </div>

            {/* Simple Team List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member, index) => {
                const colors = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500", 
                  "from-emerald-500 to-green-500",
                  "from-amber-500 to-orange-500"
                ];
                const emojis = ["👨‍💻", "⚡", "🔧", "🎯"];
                
                return (
                  <div
                    key={member}
                    className="group relative p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100 dark:border-gray-700"
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colors[index]} opacity-5 group-hover:opacity-10 transition-opacity`}
                    />

                    <div className="relative text-center">
                      <div className="text-4xl mb-3">{emojis[index]}</div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                        {member}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Project Member
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500">
                <IoTerminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Technology Stack
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Modern technologies powering the system
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.label}
                    className="group p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover:scale-105 text-center border border-gray-100 dark:border-gray-700"
                  >
                    <div
                      className={`inline-flex p-3 rounded-lg ${tech.bg} mb-3 group-hover:scale-110 transition-transform shadow-sm`}
                    >
                      <Icon className={`w-8 h-8 ${tech.color}`} />
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {tech.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Technology
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                <FiBook className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Project Vision
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Revolutionizing school time management
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  AutoBell 
                </span>{" "}
                is an innovative IoT-based automatic bell ringing system that
                brings modern technology to traditional educational
                environments. Developed specifically for{" "}
                <span className="font-semibold">
                  GOVERNMENT HIGHER SECONDARY SCHOOL, CHINNA SALEM
                </span>
                , this system represents a perfect blend of hardware and
                software engineering.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Automated Timing
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Pre-programmed schedules
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 flex items-center justify-center">
                      <FaWifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Wireless Operation
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Wi-Fi based MQTT communication
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                      <FiTarget className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        Precision Timing
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Accurate to the second scheduling
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 flex items-center justify-center">
                      <FiHeart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        User Friendly
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Intuitive interface for all users
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <FiHeart className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Made with Passion & Dedication
              </span>
              <FiHeart className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              For the students and staff of GOVERNMENT HIGHER SECONDARY SCHOOL,
              CHINNA SALEM
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} AutoBell Project Team • Version 2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}