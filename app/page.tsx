"use client";

import { useState, useEffect } from "react";
import {
  Line,
  LineChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function Home() {
  type DataItem = { time: string; price: number; fixedprice: number };

  const [data, setData] = useState<DataItem[]>([]);
  const [moving, setMoving] = useState(true);
  const [fixedprice, setFixedprice] = useState(3000);
  useEffect(() => {
    if (!moving) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toTimeString().split(" ")[0]; // "HH:MM:SS"
      const newPrice = Math.floor(Math.random() * 2000) + 2000;

      setData((prevData: DataItem[]) => {
        const updatedData = [
          ...prevData,
          { time: timeString, price: newPrice, fixedprice: fixedprice },
        ];
        if (updatedData.length > 20) {
          updatedData.shift();
        }
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [moving]);

  const toggleStart = () => {
    setMoving(!moving);
  };

  return (
    <div>
      <LineChart width={800} height={400} data={data}>
        <Line
          type="monotone"
          dataKey="price"
          stroke="#f39965"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="fixedprice"
          stroke="#a19bff"
          isAnimationActive={false}
        />
        <Legend
          align="right"
          verticalAlign="top"
          wrapperStyle={{ top: 20, right: 0 }}
        />
        <XAxis dataKey="time" />
        <YAxis domain={[1500, 5500]} />
        <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
        <Tooltip />
      </LineChart>
      <button onClick={toggleStart}>{moving ? "Stop" : "Start"}</button>
    </div>
  );
}
