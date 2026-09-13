'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Calculator,
  CreditCard,
  Download,
  Moon,
  PiggyBank,
  Plus,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const stats = [
  { label: 'Monthly spend', value: '₹24.8K', change: '+12.4%' },
  { label: 'Saved this month', value: '₹6.2K', change: '+8.1%' },
  { label: 'Trips shared', value: '18', change: '+5 new' },
  { label: 'AI insights', value: '94%', change: 'accuracy' },
];

const initialTransactions = [
  { name: 'Dinner at Zomato', category: 'Food', amount: 850, date: 'Today' },
  { name: 'Uber ride', category: 'Travel', amount: 420, date: 'Yesterday' },
  { name: 'Netflix', category: 'Subscription', amount: 499, date: 'Mon' },
  { name: 'Groceries', category: 'Essentials', amount: 1250, date: 'Sun' },
];

const billSplit = [
  { name: 'Aarav', share: 540 },
  { name: 'Mira', share: 540 },
  { name: 'Rohan', share: 540 },
];

export default function HomePage() {
  const [dark, setDark] = useState(true);
  const [text, setText] = useState('Spent 540 on dinner at Zomato with team');
  const [result, setResult] = useState({
    amount: 540,
    category: 'Dining',
    merchant: 'Zomato',
    date: '2026-08-22',
    type: 'expense',
  });
  const [transactions, setTransactions] = useState(initialTransactions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await fetch(`${API_BASE}/expenses`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setTransactions(
            data.slice(0, 4).map((item: any) => ({
              name: item.raw_text || 'Parsed expense',
              category: item.category || 'General',
              amount: Number(item.amount) || 0,
              date: item.date || 'Today',
            }))
          );
        }
      } catch {
        // fallback to demo data
      }
    };

    loadTransactions();
  }, []);

  const totalSpend = useMemo(
    () => transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [transactions]
  );

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/parse-expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const json = await res.json();
        const parsed = json.data || json;
        setResult({
          amount: Number(parsed.amount) || 0,
          category: parsed.category || 'General',
          merchant: parsed.merchant || 'Unknown',
          date: parsed.date || 'Today',
          type: parsed.type || 'expense',
        });
        const next = {
          name: parsed.raw_text || text,
          category: parsed.category || 'General',
          amount: Number(parsed.amount) || 0,
          date: 'Now',
        };
        setTransactions((prev) => [next, ...prev].slice(0, 4));
      }
    } catch {
      setResult({
        amount: 540,
        category: 'Dining',
        merchant: 'Zomato',
        date: '2026-08-22',
        type: 'expense',
      });
    } finally {
      setLoading(false);
    }
  };

  const theme = dark ? 'dark' : '';

  return (
    <main className={`${theme} min-h-screen text-slate-900 dark:text-slate-50`}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass sticky top-4 z-20 mb-8 rounded-2xl border border-white/10 px-5 py-3 shadow-glow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30">
                <PiggyBank className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">Pokety</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI spending OS</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm md:flex">
              <a href="#features" className="text-slate-600 transition hover:text-violet-500 dark:text-slate-300">Features</a>
              <a href="#dashboard" className="text-slate-600 transition hover:text-violet-500 dark:text-slate-300">Dashboard</a>
              <a href="#split" className="text-slate-600 transition hover:text-violet-500 dark:text-slate-300">Bill Split</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark(!dark)}
                className="rounded-full border border-slate-200 bg-white/70 p-2 text-slate-700 shadow-sm transition hover:scale-105 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="rounded-full border border-violet-500/30 bg-violet-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]">
                Get Started
              </button>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[32px] border border-white/30 bg-white/30 px-6 py-12 shadow-[0_30px_80px_rgba(99,102,241,0.18)] dark:bg-slate-900/60 md:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.22),transparent_30%)]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                <Sparkles className="h-3.5 w-3.5" /> AI-powered finance
              </span>
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Turn spending chaos into <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">smart decisions.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                Pokety combines AI expense parsing, smart category tracking, and effortless group bill splitting into one beautiful spending command center.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-violet-500/30 transition hover:-translate-y-0.5">
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 py-3.5 font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                  Watch Demo
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-300">
                <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-violet-500" /> 10K+ users</div>
                <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" /> 38% savings boost</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-sky-500" /> Shared bills</div>
              </div>
            </div>

            <div className="relative">
              <div className="glass rounded-3xl border border-violet-500/20 p-5 shadow-2xl shadow-violet-500/10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">This month</p>
                    <h3 className="mt-1 text-3xl font-bold">₹{totalSpend.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-900 p-4 text-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span>Food</span>
                      <span>₹8.2K</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                      <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-violet-50 p-4 dark:bg-slate-800/80">
                    <div className="flex items-center justify-between text-sm">
                      <span>Travel</span>
                      <span>₹5.8K</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full w-[48%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-slate-800/80">
                    <div className="flex items-center justify-between text-sm">
                      <span>Saved</span>
                      <span>₹6.2K</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass rounded-2xl border border-white/20 p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <div className="mt-3 flex items-end justify-between">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass rounded-3xl border border-white/20 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-violet-500">Expense Input</p>
                <h3 className="mt-1 text-2xl font-bold">AI Smart Parser</h3>
              </div>
              <div className="rounded-full bg-violet-500/10 p-2 text-violet-500">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 outline-none ring-0 transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
              placeholder="Spent 540 on dinner at Zomato with team"
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleParse}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" /> {loading ? 'Parsing...' : 'Parse & Save'}
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-5 py-3 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Parsed result</p>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                  Valid
                </span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Amount</p>
                  <p className="mt-1 text-xl font-bold">₹{result.amount}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
                  <p className="mt-1 text-xl font-bold">{result.category}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Merchant</p>
                  <p className="mt-1 text-xl font-bold">{result.merchant}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Date</p>
                  <p className="mt-1 text-xl font-bold">{result.date}</p>
                </div>
              </div>
            </div>
          </div>

          <div id="split" className="glass rounded-3xl border border-white/20 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-emerald-500">Smart Split</p>
                <h3 className="mt-1 text-2xl font-bold">Bill Share</h3>
              </div>
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-500">
                <Calculator className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-300">Team dinner</p>
                <span className="text-lg font-bold">₹1,620</span>
              </div>
              <div className="mt-4 space-y-3">
                {billSplit.map((person) => (
                  <div key={person.name} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/80">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-600 dark:text-violet-300">
                        {person.name[0]}
                      </div>
                      <span className="font-medium">{person.name}</span>
                    </div>
                    <span className="font-semibold">₹{person.share}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-300">
                <Bell className="h-4 w-4" />
                <span className="font-medium">AI recommendation</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                You have 3 pending shared bills. Suggested settlement: Mira pays the next round.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            { icon: CreditCard, title: 'Natural language capture', text: 'Paste receipts, notes, or spoken text and let AI extract amount, merchant, and category instantly.' },
            { icon: TrendingUp, title: 'Smart analytics', text: 'Track monthly trends, category breakouts, and personalized savings insights from one screen.' },
            { icon: Users, title: 'Group expense sharing', text: 'Split dinners, trips, and shared bills automatically with clear per-person totals.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-3xl border border-white/20 p-6">
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 p-3 text-white shadow-lg shadow-violet-500/20">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-bold">{title}</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="glass rounded-3xl border border-white/20 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-violet-500">Recent Transactions</p>
                <h3 className="mt-1 text-2xl font-bold">Latest entries</h3>
              </div>
              <button className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-300">
                View all
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {transactions.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-2xl bg-white/60 p-4 dark:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.category} • {item.date}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold">₹{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
