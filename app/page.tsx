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
  const [velocity, setVelocity] = useState(0);
  useEffect(() => {
    if (!moving) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

      const TARGET_PRICE = 3500; // 収束させたい価格

      // 1. 直前のデータ配列（prevData）から、直前の価格（price）を取得する
      // （データが空の場合は初期値として 3500 あたりを設定）
      setData((prevData: DataItem[]) => {
        const lastPrice =
          prevData.length > 0
            ? prevData[prevData.length - 1].price
            : TARGET_PRICE;

        // 2. シミュレーション計算（外側の velocity 状態を利用）
        const noise = (Math.random() - 0.5) * 300.0;
        const pullToCenter = (TARGET_PRICE - lastPrice) * 0.05;

        // 例：ランダムな確率（例: 10%の確率）でニュースが発生すると仮定
        const isNewsHappened = Math.random() < 0.1;

        let newsShock = 0;
        if (isNewsHappened) {
          // プラス（好材料）かマイナス（悪材料）かをランダムに決定し、大きめの値を設定
          const isPositive = Math.random() >= 0.5;
          newsShock = isPositive ? 400 : -400; // 400 や -400 の衝撃を与える

          console.log(
            isPositive
              ? "【速報】好材料ニュース発生！"
              : "【速報】悪材料ニュース発生！",
          );
        }

        // 加速度（acceleration）の計算にニュースのショックを混ぜる
        const acceleration = noise + pullToCenter + newsShock;

        // velocityState を更新（setStateは非同期なのでここでは計算値を使う）
        const newVelocity = velocity * 0.9 + acceleration;
        setVelocity(newVelocity); // 次回のために保存

        // 新しい価格を算出
        const rawPrice = Math.round(lastPrice + newVelocity);
        const newPrice =
          rawPrice > 5500 ? 5500 : rawPrice < 1500 ? 1500 : rawPrice;

        // 3. データの更新処理
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
  }, [moving, velocity, fixedprice]);

  const toggleStart = () => {
    setMoving(!moving);
  };

  return (
    <div>
      制作中...
      <LineChart width={800} height={400} data={data}>
        <Line
          type="monotone"
          dataKey="price"
          name="許容価格"
          stroke="#f39965"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="fixedprice"
          name="設定価格"
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
