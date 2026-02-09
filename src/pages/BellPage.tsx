import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { connectMQTT, publish } from "../mqtt/mqttService";
import ScheduleControl from "../components/ScheduleControl";
import ManualControl from "../components/ManualControl";
import type { Schedule } from "../types/schedule";
import Nav from "../components/Nav";
import About from "../components/About";

export default function BellPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    connectMQTT(handleMessage, requestList);
  }, []);

  const handleMessage = (_topic: string, msg: string) => {
    if (!msg.startsWith("LIST:RESP")) return;

    const [, , index, h, m, c, d] = msg.split(":");

    setSchedules((prev) => {
      const filtered = prev.filter((s) => s.index !== +index);
      return [
        ...filtered,
        {
          index: +index,
          hour: +h,
          minute: +m,
          count: +c,
          duration: +d,
        },
      ].sort((a, b) => a.index - b.index);
    });
  };

  const requestList = () => {
    setSchedules([]);
    publish("LIST");
  };

  return (
    <div>
      {/* 🔹 TOP NAV */}
      <div>
        <Nav />
      </div>

      {/* 🔹 NESTED ROUTES */}
      <Routes>
        <Route path="/" element={<Navigate to="schedules" />} />
        <Route
          path="schedules"
          element={
            <ScheduleControl schedules={schedules} reload={requestList} />
          }
        />
        <Route path="manual" element={<ManualControl />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}
