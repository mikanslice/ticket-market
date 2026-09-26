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
  ResponsiveContainer,
} from "recharts";

type DataItem = { time: string; price: number; fixedprice: number };
type NewsItem = { reason: string; effect: number };

const NEWS: NewsItem[] = [
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

function IconTicket() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h13A2.5 2.5 0 0 1 21 8.5v1.3a2.5 2.5 0 0 0 0 5V16a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16v-1.2a2.5 2.5 0 0 0 0-5Z" />
      <path d="M8 6v12M16 6v12" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 18h16" />
      <path d="M7 15l4-5 3 3 6-8" />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M9.5 9.5c0-1.5 1.3-2.5 2.5-2.5s2.5 1 2.5 2.5S13.7 12 12 12s-2.5 1-2.5 2.5S10.3 17 12 17s2.5-1 2.5-2.5" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 2L5 13h5l-1 9 8-11h-5l1-9Z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7-11-7Z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconWaiting() {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400"
      aria-label="waiting"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </svg>
    </span>
  );
}

function IconEffect({ effect }: { effect: number }) {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg font-black"
      aria-label={effect > 0 ? "positive effect" : "negative effect"}
      style={
        effect > 0
          ? {
              color: `rgb(${Math.round(255 - (effect / 300) * 155)}, 185, 125)`,
              borderColor: `rgb(${Math.round(230 - (effect / 300) * 110)}, 220, 175)`,
              backgroundColor: `rgb(${Math.round(255 - (effect / 300) * 35)}, ${Math.round(255 - (effect / 300) * 25)}, ${Math.round(255 - (effect / 300) * 75)})`,
            }
          : {
              color: `rgb(220, ${Math.round(185 - (Math.abs(effect) / 300) * 125)}, ${Math.round(185 - (Math.abs(effect) / 300) * 125)})`,
              borderColor: `rgb(245, ${Math.round(220 - (Math.abs(effect) / 300) * 110)}, ${Math.round(220 - (Math.abs(effect) / 300) * 110)})`,
              backgroundColor: `rgb(255, ${Math.round(255 - (Math.abs(effect) / 300) * 35)}, ${Math.round(255 - (Math.abs(effect) / 300) * 35)})`,
            }
      }
    >
      {effect > 0 ? "+" : "-"}
    </span>
  );
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [moving, setMoving] = useState(true);
  const [fixedprice, setFixedprice] = useState(3000);
  const [news, setNews] = useState(-1);
  const [newsSequence, setNewsSequence] = useState(0);
  const [showNews, setShowNews] = useState(false);
  const [newsProgress, setNewsProgress] = useState(0);
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
      const timeString = now.toTimeString().split(" ")[0];
      const TARGET_PRICE = 3500;

      let calculatedNewPrice = 0;

      setData((prevData: DataItem[]) => {
        const lastPrice =
          prevData.length > 0
            ? prevData[prevData.length - 1].price
            : TARGET_PRICE;

        const noise = (Math.random() - 0.5) * 30.0;
        const pullToCenter = (TARGET_PRICE - lastPrice) * 0.01;
        const isNewsHappened = Math.random() < 0.1;

        let newsShock = 0;
        if (isNewsHappened) {
          const randomIndex = Math.floor(Math.random() * NEWS.length);
          const currentNews = NEWS[randomIndex];
          setNews(randomIndex);
          setNewsSequence((previousSequence) => previousSequence + 1);
          newsShock = currentNews.effect;
        }

        const acceleration = noise + pullToCenter + newsShock;
        const newVelocity = velocityRef.current * 0.9 + acceleration;
        velocityRef.current = newVelocity;

        calculatedNewPrice = Math.max(
          1500,
          Math.min(5500, Math.round(lastPrice + newVelocity)),
        );

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
    if (news < 0) return;

    setShowNews(true);
    setNewsProgress(100);
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.max(0, 100 - (elapsed / 3000) * 100);
      setNewsProgress(progress);
      if (progress === 0) {
        setShowNews(false);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [news, newsSequence]);

  useEffect(() => {
    fixedpriceRef.current = fixedprice;
  }, [fixedprice]);

  const currentPrice = data[data.length - 1]?.price ?? 3500;
  const averagePrice =
    totalSalesCount > 0 ? Math.floor(totalSales / totalSalesCount) : 0;
  const gap = currentPrice - fixedprice;

  const toggleStart = () => {
    setMoving((prev) => !prev);
  };

  const changePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const clampedValue = Math.max(1500, Math.min(5500, value));
    setFixedprice(clampedValue);
  };

  const stats = [
    {
      label: "現在価格",
      value: `${currentPrice.toLocaleString()}円`,
      tone: "text-violet-600",
      icon: <IconTicket />,
    },
    {
      label: "設定価格",
      value: `${fixedprice.toLocaleString()}円`,
      tone: "text-sky-600",
      icon: <IconCoin />,
    },
    {
      label: "平均単価",
      value: `${averagePrice.toLocaleString()}円`,
      tone: "text-emerald-600",
      icon: <IconBolt />,
    },
    {
      label: "取引件数",
      value: `${totalSalesCount}件`,
      tone: "text-amber-600",
      icon: <IconChart />,
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f7ff_0%,_#eef2ff_28%,_#f8fafc_100%)] px-4 py-6 text-slate-800 md:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 rounded-[30px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] text-violet-600 uppercase">
              Ticket Market
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              クラブチケット価格シミュレーター
            </h1>
          </div>

          <button
            onClick={toggleStart}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
              moving
                ? "bg-slate-900 text-white hover:bg-slate-700"
                : "bg-emerald-500 text-white hover:bg-emerald-400"
            }`}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
              {moving ? <IconPause /> : <IconPlay />}
            </span>
            {moving ? "Stop" : "Start"}
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_10px_20px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium tracking-[0.18em] text-slate-500 uppercase">
                  {item.label}
                </p>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 ${item.tone}`}
                >
                  {item.icon}
                </span>
              </div>
              <p className={`mt-3 text-xl font-black ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Market trend
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  価格推移
                </h2>
              </div>
              <div className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                直近20件
              </div>
            </div>

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 8, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="5 5"
                    stroke="#dfe7f3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[1500, 5500]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => {
                      const numericValue = Number(value ?? 0);
                      return `${numericValue.toLocaleString()}円`;
                    }}
                    labelStyle={{ color: "#0f172a" }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 14 }} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name="許容価格"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, fill: "#f59e0b" }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="fixedprice"
                    name="設定価格"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex h-full min-h-[420px] flex-col gap-3">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_35px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">価格設定</h2>
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                  {fixedprice.toLocaleString()}円
                </span>
              </div>

              <div className="mt-4">
                <input
                  type="range"
                  value={fixedprice}
                  min="1500"
                  max="5500"
                  step="500"
                  onChange={changePrice}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-violet-200 via-violet-400 to-emerald-300 accent-violet-600"
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
                  <span>1,500</span>
                  <span>3,500</span>
                  <span>5,500</span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                  price gap
                </p>
                <p
                  className={`mt-1 text-xl font-black ${gap >= 0 ? "text-emerald-600" : "text-rose-500"}`}
                >
                  {gap >= 0 ? "+" : ""}
                  {gap.toLocaleString()}円
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-500 p-5 text-white shadow-[0_20px_35px_rgba(109,40,217,0.18)]">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-100 uppercase">
                sales
              </p>
              <div className="mt-5 flex items-end justify-between gap-5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-violet-100">合計売上</p>
                  <p className="mt-2 whitespace-nowrap text-[clamp(1.35rem,2.3vw,2rem)] font-black leading-none tracking-tight text-white">
                    {totalSales.toLocaleString()}円
                  </p>
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-2">
                    <p className="text-violet-100">件数</p>
                    <p className="mt-1 text-base font-bold text-white">
                      {totalSalesCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-2">
                    <p className="text-violet-100">平均</p>
                    <p className="mt-1 text-base font-bold text-white">
                      {averagePrice.toLocaleString()}円
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`flex min-h-[180px] flex-1 flex-col justify-between rounded-[24px] border p-4 shadow-[0_12px_25px_rgba(15,23,42,0.06)] transition-colors duration-300 ${
                showNews && news >= 0
                  ? NEWS[news].effect > 0
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-100 via-green-50 to-white"
                    : "border-rose-200 bg-gradient-to-br from-rose-100 via-red-50 to-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-amber-700 uppercase">
                    News flash
                  </p>
                  {showNews && news >= 0 && (
                    <IconEffect effect={NEWS[news].effect} />
                  )}
                  {!showNews && <IconWaiting />}
                </div>
                <p className="mt-4 text-base font-semibold leading-6 text-slate-800">
                  {showNews && news >= 0 ? NEWS[news].reason : "いまは何もない"}
                </p>
                {showNews && news >= 0 && (
                  <p className="mt-2 text-xs font-semibold text-amber-700">
                    Effect {NEWS[news].effect > 0 ? "+" : ""}
                    {NEWS[news].effect}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <div className="h-2 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
                      showNews && news >= 0
                        ? NEWS[news].effect > 0
                          ? "bg-emerald-400"
                          : "bg-rose-400"
                        : "bg-slate-300"
                    }`}
                    style={{ width: `${showNews ? newsProgress : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="px-2 py-3 text-center text-xs tracking-widest text-slate-400/80">
          <p className="font-mono">© 2026 Mikan</p>
          <p className="mt-1">Logic by Mikan / Interface by Github Copilot</p>
        </footer>
      </div>
    </main>
  );
}
