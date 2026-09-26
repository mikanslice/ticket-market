"use client";

import { useState, useEffect, useRef } from "react";
import {
  Line,
  LineChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type DataItem = { time: string; price: number; fixedprice: number };
type newsItem = { reason: string; effect: number };

const NEWS: newsItem[] = [
  { reason: "クラブが世界企業に買収される", effect: 300 },
  { reason: "世界的スーパースターの加入", effect: 300 },
  { reason: "前人未到の主要大会三冠", effect: 300 },
  { reason: "国内最多の観客動員を記録", effect: 300 },
  { reason: "新スタジアムが世界最高評価", effect: 300 },
  { reason: "地元全体が空前のサッカーブーム", effect: 260 },
  { reason: "歴史的快挙となる公式戦連勝", effect: 260 },
  { reason: "海外ビッグクラブとの定期戦", effect: 260 },
  { reason: "全国ネットで連日大々的報道", effect: 260 },
  { reason: "チケット争奪戦が社会現象化", effect: 260 },
  { reason: "世界的人気選手の加入", effect: 220 },
  { reason: "年間チケットが即座に完売", effect: 220 },
  { reason: "地元テレビの全試合独占中継", effect: 220 },
  { reason: "全試合で圧倒的な満員御礼", effect: 220 },
  { reason: "レジェンド級選手の劇的復帰", effect: 220 },
  { reason: "快進撃で圧巻の首位独走", effect: 180 },
  { reason: "優勝争いに完全に定着", effect: 180 },
  { reason: "サポーター数が爆発的に増加", effect: 180 },
  { reason: "メディアが連日の特別番組", effect: 180 },
  { reason: "ライバルに歴史的大勝を記録", effect: 180 },
  { reason: "巨大企業がメインスポンサーに", effect: 140 },
  { reason: "世界的人気の有名監督が就任", effect: 140 },
  { reason: "最新鋭の新スタジアムが完成", effect: 140 },
  { reason: "駅からのアクセスが劇的改善", effect: 140 },
  { reason: "クラブ創立の記念大イベント", effect: 140 },
  { reason: "豪華な記念グッズを全員配布", effect: 100 },
  { reason: "人気マスコットが全国で話題", effect: 100 },
  { reason: "有名店との大規模グルメコラボ", effect: 100 },
  { reason: "試合前の豪華アーティストライブ", effect: 100 },
  { reason: "限定デザインのユニ配布", effect: 100 },
  { reason: "少し肌寒い気候予報", effect: -100 },
  { reason: "売店周辺で長い行列が発生", effect: -100 },
  { reason: "最寄り駅からの道のりが混雑", effect: -100 },
  { reason: "人気限定グッズが即品切れ", effect: -100 },
  { reason: "周辺駐車場の予約が困難に", effect: -100 },
  { reason: "物価高騰の深刻な影響", effect: -140 },
  { reason: "夜遅くの試合開催が増加", effect: -140 },
  { reason: "テレビ放映枠が大幅に減少", effect: -140 },
  { reason: "最寄り駅周辺で大規模工事", effect: -140 },
  { reason: "スタジアム応援ルールの厳格化", effect: -140 },
  { reason: "チームが大スランプに陥る", effect: -180 },
  { reason: "シーズン後半に痛恨の失速", effect: -180 },
  { reason: "ホームの客足が急速に冷え込む", effect: -180 },
  { reason: "主力選手との契約交渉が難航", effect: -180 },
  { reason: "監督の解任説が現実味を帯びる", effect: -180 },
  { reason: "チームの屋台骨であるエースが離脱", effect: -220 },
  { reason: "絶対的スター選手が電撃移籍", effect: -220 },
  { reason: "サポーターの重大な不祥事が発生", effect: -220 },
  { reason: "試合中止が相次ぐ異常事態", effect: -220 },
  { reason: "深刻なクラブ経営の重大危機", effect: -220 },
  { reason: "クラブ存続を揺るがす不正が発覚", effect: -260 },
  { reason: "スタジアム閉鎖の危機に直面", effect: -260 },
  { reason: "チーム解散の噂が大きく浮上", effect: -260 },
  { reason: "大黒柱の選手が突如引退を発表", effect: -260 },
  { reason: "ライセンス剥奪クラスの重大違反", effect: -260 },
  { reason: "親会社が経営破綻し撤退へ", effect: -300 },
  { reason: "歴史的ワーストの連敗記録を更新", effect: -300 },
  { reason: "クラブの全財産が消える巨額負債", effect: -300 },
  { reason: "サポーターの暴動で無期限活動停止", effect: -300 },
  { reason: "リーグからの強制降格処分が決定", effect: -300 },
];

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [moving, setMoving] = useState(true);
  const [fixedprice, setFixedprice] = useState(3000);
  const [news, setNews] = useState(-1);
  const [showNews, setShowNews] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const velocityRef = useRef(0);
  const fixedpriceRef = useRef(fixedprice);

  const addSales = (p: number, isAdd: boolean) => {
    setTotalSalesCount((prevCount) => prevCount + 1);
    if (isAdd) setTotalSales((prevSales) => prevSales + p);
  };

  useEffect(() => {
    if (!moving) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

      const TARGET_PRICE = 3500; // 収束させたい価格

      let calculatedNewPrice = 0;

      // 1. 直前のデータ配列（prevData）から、直前の価格（price）を取得する
      // （データが空の場合は初期値として 3500 あたりを設定）
      setData((prevData: DataItem[]) => {
        const lastPrice =
          prevData.length > 0
            ? prevData[prevData.length - 1].price
            : TARGET_PRICE;

        // 2. シミュレーション計算（外側の velocity 状態を利用）
        const noise = (Math.random() - 0.5) * 30.0;
        const pullToCenter = (TARGET_PRICE - lastPrice) * 0.01;

        // 例：ランダムな確率（例: 10%の確率）でニュースが発生すると仮定
        const isNewsHappened = Math.random() < 0.1;

        let newsShock = 0;
        if (isNewsHappened) {
          const randomIndex = Math.floor(Math.random() * NEWS.length);
          const currentNews = NEWS[randomIndex];
          setNews(randomIndex);
          newsShock = currentNews.effect;
        }

        // 加速度（acceleration）の計算にニュースのショックを混ぜる
        const acceleration = noise + pullToCenter + newsShock;

        // velocityState を更新（setStateは非同期なのでここでは計算値を使う）
        const newVelocity = velocityRef.current * 0.9 + acceleration;
        velocityRef.current = newVelocity; // 次回のために保存

        // 新しい価格を算出
        calculatedNewPrice = Math.max(
          1500,
          Math.min(5500, Math.round(lastPrice + newVelocity)),
        );

        // 3. データの更新処理
        const updatedData = [
          ...prevData,
          {
            time: timeString,
            price: calculatedNewPrice,
            fixedprice: fixedpriceRef.current,
          },
        ];

        if (updatedData.length > 20) {
          updatedData.shift();
        }

        return updatedData;
      });

      addSales(
        fixedpriceRef.current,
        calculatedNewPrice > fixedpriceRef.current,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [moving]);

  useEffect(() => {
    setShowNews(true);
    const timeout = setTimeout(() => {
      setShowNews(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [news]);

  useEffect(() => {
    fixedpriceRef.current = fixedprice;
  }, [fixedprice]);

  const toggleStart = () => {
    setMoving(!moving);
  };
  const changePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const clampedValue = Math.max(1500, Math.min(5500, value));
    setFixedprice(clampedValue);
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
      <input
        type="range"
        value={fixedprice}
        min="1500"
        max="5500"
        step="500"
        onChange={changePrice}
      />
      {fixedprice}
      <br />
      {totalSales}円/{totalSalesCount}個 =
      {totalSalesCount > 0 ? Math.floor(totalSales / totalSalesCount) : 0}円/個
      <br />
      {showNews && <div>{NEWS[news]?.reason}</div>}
    </div>
  );
}
