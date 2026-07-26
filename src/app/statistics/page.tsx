'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadialBarChart, 
  RadialBar, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  TooltipProps 
} from 'recharts'
import { 
  Gamepad2, DollarSign, Trophy, PiggyBank, Flame, Calendar, 
  TrendingUp, Award, BarChart3, PieChart as PieChartIcon, Target 
} from 'lucide-react'

import { useAllGames } from '@/hooks/use-all-games'
import { useLibraryStore } from '@/store/use-library-store'
import { useStats } from '@/hooks/use-stats'
import { cn, formatPrice } from '@/lib/utils'
import { PriceDisplay } from '@/components/shared/price-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#ededed', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', '#09090b', '#fff', '#ccc']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/10 p-3 rounded-md shadow-xl font-mono text-xs">
        <p className="font-medium text-[#ededed] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#888]">{entry.name}:</span>
            <span className="text-[#ededed] font-bold">
              {typeof entry.value === 'number' && entry.name.toLowerCase().includes('value')
                ? <PriceDisplay amount={entry.value} />
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const StatCard = ({ title, value, icon: Icon, description, trend, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="border-white/10 bg-[#111]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#888]">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-[#888]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-mono font-bold text-[#ededed]">{value}</div>
        <p className="text-xs text-[#888] mt-1">
          {description}
        </p>
        {trend && (
          <div className="mt-2 text-xs font-mono font-medium text-green-400 bg-green-500/10 border border-green-500/20 inline-flex px-2 py-0.5 rounded-md">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

export default function StatisticsPage() {
  const { claimedGameIds } = useLibraryStore()
  const { allGames } = useAllGames()
  const { userStats, yearlyStats, monthlyStats, genreStats, publisherStats } = useStats(allGames, claimedGameIds)

  const radialData = useMemo(() => [
    { name: 'Missed', value: userStats.missedPercentage, fill: '#333333' },
    { name: 'Claimed', value: userStats.claimedPercentage, fill: '#ededed' },
  ], [userStats])

  const claimAnalysisData = useMemo(() => [
    { name: 'Claimed', value: userStats.claimedCount },
    { name: 'Missed', value: userStats.missedCount },
  ], [userStats])

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Your Statistics
          </h1>
          <p className="text-sm text-[#888] mt-2">
            Detailed insights into your Epic Games collection and saving habits.
          </p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Giveaways"
          value={userStats.totalGiveaways}
          icon={Gamepad2}
          description="Since the beginning"
          delay={0.1}
        />
        <StatCard
          title="Total Value Offered"
          value={<PriceDisplay amount={userStats.totalClaimedValue + userStats.totalMissedValue} />}
          icon={DollarSign}
          description="If you bought them all"
          delay={0.2}
        />
        <StatCard
          title="Your Claimed Games"
          value={`${userStats.claimedCount}`}
          icon={Trophy}
          description={`${userStats.claimedPercentage.toFixed(1)}% of all games`}
          trend={`+${userStats.averageMonthlyClaimRate.toFixed(1)} / month avg`}
          delay={0.3}
        />
        <StatCard
          title="Money Saved"
          value={<PriceDisplay amount={userStats.moneySaved} />}
          icon={PiggyBank}
          description="Value of your claimed games"
          trend="Incredible savings"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Completion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full border border-white/8 bg-[#111]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
                <Target className="w-4 h-4 text-[#888]" />
                Collection Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-0">
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="70%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={radialData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                  <span className="text-4xl font-mono font-bold text-white">{userStats.completionPercentage.toFixed(0)}%</span>
                  <span className="text-xs text-[#888]">Claimed</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/[0.02] border border-white/8 rounded-md p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Current Streak</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-white">{userStats.currentStreak}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/8 rounded-md p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-green-400 mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Longest Streak</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-white">{userStats.longestStreak}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Value Over Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border border-white/8 bg-[#111]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
                <TrendingUp className="w-4 h-4 text-[#888]" />
                Value Offered vs Claimed Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ededed" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ededed" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClaimed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="totalValue" 
                      name="Total Value Offered"
                      stroke="#ededed" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="claimedValue" 
                      name="Your Claimed Value"
                      stroke="#22c55e" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorClaimed)" 
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-full border border-white/8 bg-[#111]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
                <PieChartIcon className="w-4 h-4 text-[#888]" />
                Genre Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreStats.slice(0, 10)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="genre"
                      labelLine={false}
                    >
                      {genreStats.slice(0, 10).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Yearly Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="h-full border border-white/8 bg-[#111]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
                <BarChart3 className="w-4 h-4 text-[#888]" />
                Games per Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="totalGames" name="Total Games" fill="#71717a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="claimedGames" name="Claimed Games" fill="#ededed" radius={[4, 4, 0, 0]} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claim Analysis & Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="h-full border border-white/8 bg-[#111]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
                <Award className="w-4 h-4 text-[#888]" />
                Claim Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={claimAnalysisData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                    >
                      <Cell fill="#ededed" />
                      <Cell fill="#333333" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-md border border-white/8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-[#888]">Most Valuable Month</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-green-400">{userStats.mostValuableMonth || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-md border border-white/8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#888]" />
                    <span className="text-xs text-[#888]">Most Valuable Year</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#ededed]">{userStats.mostValuableYear || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-md border border-white/8">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-[#888]">Mystery Games</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-amber-400">{userStats.mysteryGamesClaimed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Publisher Leaders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border border-white/8 bg-[#111]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
                <Trophy className="w-4 h-4 text-[#888]" />
                Top Publishers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={publisherStats.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis 
                      type="number" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                    />
                    <YAxis 
                      dataKey="publisher" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="count" name="Total Games" fill="#555555" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="claimedCount" name="Claimed" fill="#ededed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
