"use client";

import { useState, useEffect, useRef } from "react";
import {
  Line,
  LineChart,
  Legend,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Welford } from "@/lib/welford";
import { IconTicket, IconEffect, IconEyeOff, IconEye, IconFlame, IconGauge, IconPlay, IconChart, IconCheck, IconWaiting, IconX, IconCoin, IconInfinity, IconLimit, IconPause, IconRefresh, IconCat, IconDeviation } from "@/icon/Icons";

type DataItem = { time: string; price: number; fixedprice: number };
type ChartDataItem = { time: string; price: number | null; fixedprice: number | null };
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
  { reason: "少し肌寒い予報", effect: -100 },
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
  const TARGET_PRICE = 3500;

  const [welford, setWelford] = useState(() => new Welford());

  const [turbo, setTurbo] = useState(false);
  const [hard, setHard] = useState(false);
  const [limited, setLimited] = useState(true);
  const [showchart, setShowchart] = useState(false);
  const [data, setData] = useState<DataItem[]>([]);
  const [moving, setMoving] = useState(false);
  const [dealLimit, setDealLimit] = useState(20);
  const [dealLimitInput, setDealLimitInput] = useState("20");
  const [showResult, setShowResult] = useState(false);
  const [fixedprice, setFixedprice] = useState(3000);
  const [news, setNews] = useState(-1);
  const [newsSequence, setNewsSequence] = useState(0);
  const [showNews, setShowNews] = useState(false);
  const [newsProgress, setNewsProgress] = useState(0);
  const [totalSales, setTotalSales] = useState(0);//売上合計
  const [totalSalesCount, setTotalSalesCount] = useState(0); //売上件数
  const [totalDealCount, setTotalDealCount] = useState(0); //総取引件数
  const velocityRef = useRef(0);
  const fixedpriceRef = useRef(fixedprice);
  const lastPriceRef = useRef(data.length > 0 ? data[data.length - 1].price : TARGET_PRICE);

  const addSales = (p: number, isAdd: boolean) => {
    setTotalDealCount((prevCount) => prevCount + 1);
    if (limited) {
      setDealLimit((prevLimit) => Math.max(0, Math.min(1000, prevLimit - 1)));
    }
    if (isAdd) {
      setTotalSales((prevSales) => prevSales + p);
      setTotalSalesCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    if (dealLimit < 1) {
      if (limited) {
        setMoving(false);
        if (totalDealCount > 0) setShowResult(true);
      }
    }
  }, [dealLimit, limited, totalDealCount]);

  useEffect(() => {
    setDealLimitInput(String(dealLimit));
  }, [dealLimit]);

  const changeDealLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDealLimitInput(e.target.value);
  };

  const finishDealLimitEdit = () => {
    if (dealLimitInput === "") {
      setDealLimitInput(String(dealLimit));
      return;
    }

    const value = Number(dealLimitInput);
    const clampedValue = Math.max(1, Math.min(1000, value));

    setDealLimit(clampedValue);
    setDealLimitInput(String(clampedValue));
  };

  useEffect(() => {
    if (!limited) {
      setDealLimitInput("0");
      setDealLimit(0);
    }
  }, [limited]);

  const toggleMode = () => {
    setMoving(false);
    if (limited) {
      setLimited(false);
      setDealLimit(0);
      setDealLimitInput("0");
      return;
    }
    setLimited(true);
    setDealLimit(20);
    setDealLimitInput("20");
    setShowResult(false);
  };

  const toggleHard = () => {
    setHard((previousHard) => {
      const nextHard = !previousHard;
      if (!nextHard) {
        setShowNews(false);
        setNews(-1);
        setNewsProgress(0);
      }
      return nextHard;
    });
  };

  useEffect(() => {
    if (!moving) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toTimeString().split(" ")[0];

      let calculatedNewPrice = 0;

      const noise = (Math.random() - 0.5) * (hard ? 60.0 : 30.0);
      const pullToCenter = (TARGET_PRICE - lastPriceRef.current) * 0.01;
      const isNewsHappened = Math.random() < (hard ? 0.3 : 0.1);

      let newsShock = 0;
      if (isNewsHappened) {
        const randomIndex = Math.floor(Math.random() * NEWS.length);
        const currentNews = NEWS[randomIndex];
        setNews(randomIndex);
        setNewsSequence((previousSequence) => previousSequence + 1);
        newsShock = currentNews.effect * (hard ? 3 : 1.0);
      }

      const acceleration = noise + pullToCenter + newsShock;
      const newVelocity = velocityRef.current * 0.9 + acceleration;
      velocityRef.current = newVelocity;

      calculatedNewPrice = Math.max(
        1500,
        Math.min(5500, Math.round(lastPriceRef.current + newVelocity)),
      );
      welford.add(calculatedNewPrice);
      const nextWelford = welford.clone();
      setWelford(nextWelford);
      setData((prevData: DataItem[]) => {
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
        calculatedNewPrice >= fixedpriceRef.current,
      );
      lastPriceRef.current = calculatedNewPrice;
    }, turbo ? 100 : 1000);

    return () => clearInterval(interval);
  }, [moving, turbo, limited, hard]);

  useEffect(() => {
    if (hard || news < 0) {
      setShowNews(false);
      return;
    }

    setShowNews(true);
    setNewsProgress(100);
    const startedAt = Date.now();
    const newsDuration = turbo ? 300 : 3000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.max(0, 100 - (elapsed / newsDuration) * 100);
      setNewsProgress(progress);
      if (progress === 0) {
        setShowNews(false);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [hard, news, newsSequence, turbo]);

  useEffect(() => {
    fixedpriceRef.current = fixedprice;
  }, [fixedprice]);

  const currentPrice = data[data.length - 1]?.price ?? 3500;
  const averagePrice =
    totalDealCount > 0 ? Math.floor(totalSales / totalDealCount) : 0;
  const priceStandardDeviation = welford.standardDeviation();
  const gap = currentPrice - fixedprice;
  const successRate = totalDealCount > 0 ? (totalSalesCount / totalDealCount) * 100 : 0;
  const chartData: ChartDataItem[] = [
    ...data,
    ...Array.from({ length: Math.max(0, 20 - data.length) }, (_, index) => ({
      time: `empty-${index}`,
      price: null,
      fixedprice: null,
    })),
  ];
  const chartRenderData: ChartDataItem[] = data.length > 0
    ? chartData
    : [
      { time: "initial", price: TARGET_PRICE, fixedprice },
      ...Array.from({ length: 19 }, (_, index) => ({
        time: `empty-${index}`,
        price: null,
        fixedprice: null,
      })),
    ];

  const toggleStart = () => {
    if (limited && dealLimit < 1) return;
    if (!moving && data.length === 0) {
      const initialData: DataItem = {
        time: new Date().toTimeString().split(" ")[0],
        price: TARGET_PRICE,
        fixedprice: fixedpriceRef.current,
      };
      welford.add(initialData.price);
      setWelford(welford.clone());
      setData([initialData]);
      addSales(initialData.fixedprice, initialData.price >= initialData.fixedprice);
      lastPriceRef.current = initialData.price;
    }
    setMoving((prev) => !prev);
  };

  const resetSimulation = () => {
    setData([]);
    setTotalSales(0);
    setTotalSalesCount(0);
    setTotalDealCount(0);
    setNews(-1);
    setShowNews(false);
    setNewsProgress(0);
    velocityRef.current = 0;
    lastPriceRef.current = TARGET_PRICE;
    if (limited) {
      setDealLimit(20);
      setDealLimitInput("20");
    }
    setShowResult(false);
    setMoving(false);
    setHard(false);
    setWelford(new Welford());
  };

  const changePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const clampedValue = Math.max(1500, Math.min(5500, value));
    setFixedprice(clampedValue);
  };

  const stats = [
    {
      label: "許容価格",
      value: showchart ? `${currentPrice.toLocaleString()}円` : "非表示",
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
      icon: <IconCoin />,
    },
    {
      label: "取引件数",
      value: `${totalSalesCount} / ${totalDealCount}件`,
      tone: "text-amber-600",
      icon: <IconChart />,
      detail: `成立 / 全体・成立率 ${successRate.toFixed(1)}%`,
    },
    {
      label: "標準偏差",
      value: `${Math.round(priceStandardDeviation).toLocaleString()}円`,
      tone: "text-rose-500",
      icon: <IconDeviation />,
      detail: "平均からの距離",
    },
  ];

  const salesCard = (
    <div className="min-w-0 rounded-[20px] border border-violet-100 bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-500 p-4 text-white shadow-[0_18px_35px_rgba(109,40,217,0.18)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(109,40,217,0.25)] xl:col-span-2">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-100 uppercase">
        sales
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-violet-100">合計売上</p>
          <p className="mt-2 whitespace-nowrap text-[clamp(1.35rem,2.3vw,2rem)] font-black leading-none tracking-tight text-white">
            {totalSales.toLocaleString()}円
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-white/20 bg-white/10 p-2">
            <p className="text-violet-100">成立 / 全体</p>
            <p className="mt-1 whitespace-nowrap text-base font-bold text-white">
              {totalSalesCount} / {totalDealCount}
            </p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-2">
            <p className="text-violet-100">平均</p>
            <p className="mt-1 whitespace-nowrap text-base font-bold text-white">
              {Math.floor(totalSales / totalDealCount || 0).toLocaleString()}円
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="market-enter min-h-screen bg-[radial-gradient(circle_at_top,_#f5f7ff_0%,_#eef2ff_28%,_#f8fafc_100%)] px-3 py-4 text-slate-800 sm:px-4 sm:py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="market-enter market-enter-delay-1 mb-5 flex flex-col gap-4 rounded-[30px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-md transition-shadow duration-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] text-violet-600 uppercase">
              Ticket Market
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              チケット・マーケット
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            <button
              type="button"
              onClick={toggleMode}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${!limited ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100" : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"}`}
              title="モードを切り替える"
            >
              {!limited ? <IconInfinity /> : <IconLimit />}
              {!limited ? "UnlimitedMode" : "LimitedMode"}
            </button>
            <label className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 shadow-sm ${!limited ? "opacity-60" : ""}`}>
              <span className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">Deal Limit</span>
              <input
                type="number"
                value={dealLimitInput}
                min="1"
                max="1000"
                onChange={changeDealLimit}
                onBlur={finishDealLimitEdit}
                disabled={!limited}
                className={`${!limited ? "w-10" : "w-14"} border-0 bg-transparent text-right text-sm font-black text-slate-700 outline-none transition-colors duration-300 focus:text-violet-700`}
                title="取引件数の上限を設定"
              />
            </label>
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-all duration-300 ease-out active:scale-95 ${turbo ? "border-orange-200 bg-orange-50 text-orange-700 shadow-[0_6px_18px_rgba(249,115,22,0.16)]" : "border-slate-200 bg-white/70 text-slate-500"}`} title="ターボモード">
              <IconGauge />
              <span>Turbo</span>
              <input
                type="checkbox"
                checked={turbo}
                onChange={() => setTurbo(!turbo)}
                className="peer sr-only"
              />
              <span className={`relative h-5 w-9 rounded-full transition-all duration-300 ease-out ${turbo ? "bg-orange-500" : "bg-slate-200"}`}>
                <span className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-[left,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${turbo ? "left-5 scale-110" : "left-1 scale-100"}`} />
              </span>
            </label>
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-all duration-300 ease-out active:scale-95 ${showchart ? "border-cyan-200 bg-cyan-50 text-cyan-700 shadow-[0_6px_18px_rgba(6,182,212,0.16)]" : "border-slate-200 bg-white/70 text-slate-500"}`} title="グラフと現在価格の表示切替">
              {showchart ? <IconEye /> : <IconEyeOff />}
              <span>Chart</span>
              <input
                type="checkbox"
                checked={showchart}
                onChange={() => setShowchart(!showchart)}
                className="peer sr-only"
              />
              <span className={`relative h-5 w-9 rounded-full transition-all duration-300 ease-out ${showchart ? "bg-cyan-500" : "bg-slate-200"}`}>
                <span className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-[left,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${showchart ? "left-5 scale-110" : "left-1 scale-100"}`} />
              </span>
            </label>
            <label className={`inline-flex cursor-pointer items-center gap-2 self-start rounded-full border px-3 py-2 text-xs font-bold transition-all duration-300 ease-out active:scale-95 md:self-auto ${hard ? "border-rose-200 bg-rose-50 text-rose-700 shadow-[0_6px_18px_rgba(244,63,94,0.16)]" : "border-slate-200 bg-white/70 text-slate-500"}`} title="Hardモードの切替">
              <IconFlame />
              <span>Hard</span>
              <input
                type="checkbox"
                checked={hard}
                onChange={toggleHard}
                className="peer sr-only"
              />
              <span className={`relative h-5 w-9 rounded-full transition-all duration-300 ease-out ${hard ? "bg-rose-500" : "bg-slate-200"}`}>
                <span className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-[left,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${hard ? "left-5 scale-110" : "left-1 scale-100"}`} />
              </span>
            </label>
          </div>

          <button
            onClick={resetSimulation}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-sm font-semibold text-slate-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 md:ml-auto md:self-auto"
            title="シミュレーションをリセット"
          >
            <IconRefresh />
            <span>Reset</span>
          </button>
          <button
            onClick={toggleStart}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition ${moving
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

        <section className="market-enter market-enter-delay-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="min-w-0 rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)] xl:col-span-2"
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
              <p className={`mt-3 break-words text-lg font-black sm:text-xl ${item.tone}`}>
                {item.value}
              </p>
              {item.detail && (
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {item.detail}
                </p>
              )}
            </div>
          ))}
          {salesCard}
        </section>

        <section className="mt-5 grid gap-4 sm:gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <div className="min-w-0 rounded-[30px] border border-slate-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-shadow duration-500 sm:p-4 md:p-6">
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

            <div className={`${showchart ? "h-[260px]" : "h-0 overflow-hidden"} w-full transition-[height] duration-500 ease-out`}>
              <ResponsiveContainer width="100%" height="100%">
                {showchart && <LineChart
                  data={chartRenderData}
                  margin={{ top: 8, right: 20, left: 12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="5 5"
                    stroke="#dfe7f3"
                    vertical={false}
                  />
                  <YAxis
                    domain={[1500, 5500]}
                    ticks={[1500, 2500, 3500, 4500, 5500]}
                    tickCount={5}
                    tickLine={false}
                    axisLine={false}
                    width={48}
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
                </LineChart>}
              </ResponsiveContainer>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2.5">
                <p className="min-w-0 text-xs font-bold text-slate-700">直近20件の取引判定</p>
                <div className="flex shrink-0 items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-1 text-emerald-600"><IconCheck /> 成立</span>
                  <span className="inline-flex items-center gap-1 text-rose-500"><IconX /> 不成立</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-center text-xs">
                  <tbody>
                    <tr className="text-slate-400">
                      <th className="sticky left-0 bg-slate-50 px-3 py-2 text-left font-semibold">番号</th>
                      {chartData.map((_, index) => <td className="px-2 py-2 font-semibold" key={index}>{index + 1}</td>)}
                    </tr>
                    <tr className="border-t border-slate-200">
                      <th className="sticky left-0 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-500">判定</th>
                      {chartData.map((item, index) => {
                        const isEmpty = item.fixedprice === null || item.price === null;
                        const isSuccess = item.price !== null && item.fixedprice !== null && item.price >= item.fixedprice;
                        return (
                          <td className="w-10 min-w-10 px-2 py-2" key={index}>
                            <span className="inline-flex h-6 w-6 items-center justify-center">
                              {isEmpty ? <span className="text-slate-300">-</span> : isSuccess ? <span className="inline-flex text-emerald-500"><IconCheck /></span> : <span className="inline-flex text-rose-400"><IconX /></span>}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex h-full min-h-[420px] flex-col gap-3">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_35px_rgba(15,23,42,0.05)] transition-all duration-500 hover:shadow-[0_22px_42px_rgba(15,23,42,0.08)]">
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
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-violet-200 via-violet-400 to-emerald-300 accent-violet-600 transition-transform duration-300 ease-out hover:brightness-105 active:scale-[1.015]"
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
                  <span>1,500</span>
                  <span>3,500</span>
                  <span>5,500</span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                  利益
                </p>
                <p
                  className={`mt-1 text-xl font-black transition-colors duration-300 ${showchart ? gap >= 0 ? "text-emerald-600" : "text-rose-500" : "text-slate-400"}`}
                >
                  {showchart ? `${gap >= 0 ? "+" : ""}${gap.toLocaleString()}円` : "非表示"}
                </p>
              </div>
            </div>

            <div
              className={`flex min-h-[180px] flex-1 flex-col justify-between rounded-[24px] border p-4 shadow-[0_12px_25px_rgba(15,23,42,0.06)] transition-all duration-700 ${!hard
                ? "border-slate-200 bg-slate-100/80 text-slate-400"
                : showNews && news >= 0
                  ? NEWS[news].effect > 0
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-100 via-green-50 to-white"
                    : "border-rose-200 bg-gradient-to-br from-rose-100 via-red-50 to-white"
                  : "border-slate-200 bg-white"
                }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${!hard ? "text-amber-700" : "text-slate-400"}`}>
                    News flash
                  </p>
                  {!hard && showNews && news >= 0 && (
                    <IconEffect effect={NEWS[news].effect} />
                  )}
                  {(hard || !showNews) && <IconWaiting />}
                </div>
                <p key={newsSequence} className={`market-enter mt-4 text-base font-semibold leading-6 ${!hard ? "text-slate-800" : "text-slate-400"}`}>
                  {hard ? "HardモードON" : showNews && news >= 0 ? NEWS[news].reason : "ニュースはありません"}
                </p>
                {!hard && showNews && news >= 0 && (
                  <p className="mt-2 text-xs font-semibold text-amber-700">
                    Effect {NEWS[news].effect > 0 ? "+" : ""}
                    {NEWS[news].effect}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <div className="h-2 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={`h-full rounded-full transition-[width] duration-100 ease-linear ${showNews && news >= 0
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

        {(showResult || !limited) && (
          <section className="market-enter mt-6 overflow-hidden rounded-[28px] border border-emerald-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition-all duration-700">
            <div className="flex flex-col gap-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  <IconCheck />
                  シミュレーション完了
                </div>
                <h2 className="mt-3 text-xl font-black text-slate-900">取引結果</h2>
                <p className="mt-1 text-sm text-slate-500">{limited ? "設定した取引上限に到達したため、シミュレーションを停止しました。" : "無制限でシミュレーションを実行しています。"}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">成立率</p>
                <p className="mt-1 text-3xl font-black text-emerald-600">{successRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>成立件数 / 総取引件数</span>
                  <span className="text-slate-800">{totalSalesCount} / {totalDealCount}件</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-[width] duration-1000 ease-out" style={{ width: `${successRate}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 md:min-w-[360px]">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-600">成立</p>
                  <p className="mt-1 font-black text-emerald-700">{totalSalesCount}件</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">総取引</p>
                  <p className="mt-1 font-black text-slate-800">{totalDealCount}件</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-violet-50 p-3 sm:col-span-1">
                  <p className="text-xs text-violet-600">総売上</p>
                  <p className="mt-1 font-black text-violet-700">{totalSales.toLocaleString()}円</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-sky-50 p-3 sm:col-span-1">
                  <p className="text-xs text-sky-600">平均取引価格</p>
                  <p className="mt-1 font-black text-sky-700">{averagePrice.toLocaleString()}円</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="market-enter mt-10 mb-10 flex min-w-0 items-start gap-3 rounded-2xl border border-violet-100 bg-white/70 px-3 py-3 text-[13px] leading-6 text-slate-600 shadow-sm sm:items-center sm:px-4 sm:text-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
            <IconCat />
          </span>
          <p>
            原作 <a className="font-bold text-violet-600 underline decoration-violet-300 underline-offset-2" href="https://scratch.mit.edu/projects/1381610446" target="_blank" rel="noreferrer">チケット・マーケット</a> を作った <a className="font-bold text-violet-600 underline decoration-violet-300 underline-offset-2" href="https://scratch.mit.edu/users/social_ceder" target="_blank" rel="noreferrer">social_ceder</a>さんに感謝します。
          </p>
        </div>

        <section className="border-y border-slate-200/80 px-2 py-7 md:px-4">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-600 uppercase">
              About the market
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              このシミュレーションについて
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              ニュースや需要の変化で、チケットの許容価格がリアルタイムに変わります。
              設定価格を調整しながら、売れ方と売上の変化を確認できます。
            </p>
            <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <h3 className="font-bold text-slate-800">基本操作</h3>
                <p className="mt-1 leading-6">Startで開始、Stopで一時停止します。Resetを押すと、価格・売上・件数・ニュースを最初の状態に戻せます。</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">価格と売上</h3>
                <p className="mt-1 leading-6">価格設定のバーで設定価格を変えます。許容価格が設定価格以上になると、売上と成立件数に加算されます。</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">ニュースと価格変動</h3>
                <p className="mt-1 leading-6">シミュレーション中には様々なニュースが発生します。プラスのニュースは許容価格を大きく押し上げ、マイナスのニュースは価格を押し下げます。効果の大きさはニュース内容によって異なります。</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">モードと速さ</h3>
                <p className="mt-1 leading-6">Limitedは指定した件数で停止します。Unlimitedは停止せず続きます。TurboをONにすると価格の更新が速くなり、ニュースも通常の10倍速く消えます。</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Hardモード</h3>
                <p className="mt-1 leading-6">HardをONにするとニュースは非表示になり、価格のブレが大きくなります。OFFにするとニュース欄が表示されます。</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">表示と結果</h3>
                <p className="mt-1 leading-6">「グラフ表示」をOFFにすると、グラフと許容価格を隠せます。下の判定表では、成立をチェック、不成立を×で表示します。平均と標準偏差で価格の傾向も確認できます。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 mb-8 border-b border-slate-200/80 px-2 py-7 md:px-4">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-violet-600 uppercase">
              Dynamic pricing
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              ダイナミックプライシングとは
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              需要やニュース、売れ行きなどの変化に合わせて、設定価格をその時々で調整する仕組みです。需要が高いときは価格が上がり、需要が落ち着くと価格が下がるため、固定価格よりも市場の動きを反映した販売ができます。
            </p>
          </div>
        </section>

        <footer className="px-2 py-3 text-center text-xs tracking-widest text-slate-400/80">
          <p className="font-mono">© 2026 Mikan</p>
          <p className="mt-1">
            Logic by Mikan / Interface & News by Github Copilot
          </p>
        </footer>
      </div>
    </main>
  );
}
