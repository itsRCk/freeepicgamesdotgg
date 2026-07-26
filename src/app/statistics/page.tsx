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

import { GAMES_DATA } from '@/data/games'
import { useLibraryStore } from '@/store/use-library-store'
import { useStats } from '@/hooks/use-stats'
import { cn, formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#14b8a6']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border p-3 rounded-lg shadow-xl">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {entry.name?.toString().toLowerCase().includes('value') || entry.name?.toString().toLowerCase().includes('price')
                ? formatPrice(entry.value as number)
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
    <Card className="h-full bg-card/50 backdrop-blur border-white/10 hover:border-white/20 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="mt-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 inline-flex px-2 py-1 rounded-md">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

export default function StatisticsPage() {
  const { claimedGameIds } = useLibraryStore()
  const { userStats, yearlyStats, monthlyStats, genreStats, publisherStats } = useStats(GAMES_DATA, claimedGameIds)

  const radialData = useMemo(() => [
    { name: 'Missed', value: userStats.missedPercentage, fill: '#334155' },
    { name: 'Claimed', value: userStats.claimedPercentage, fill: '#8b5cf6' },
  ], [userStats])

  const claimAnalysisData = useMemo(() => [
    { name: 'Claimed', value: userStats.claimedCount },
    { name: 'Missed', value: userStats.missedCount },
  ], [userStats])

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
            Your Statistics
          </h1>
          <p className="text-muted-foreground mt-2">
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
          value={formatPrice(userStats.totalClaimedValue + userStats.totalMissedValue)}
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
          value={formatPrice(userStats.moneySaved)}
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
          <Card className="h-full bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-violet-400" />
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
                  <span className="text-4xl font-bold">{userStats.completionPercentage.toFixed(0)}%</span>
                  <span className="text-sm text-muted-foreground">Claimed</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-4 mt-6">
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-500 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Current Streak</span>
                  </div>
                  <div className="text-xl font-bold">{userStats.currentStreak}</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-500 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Longest Streak</span>
                  </div>
                  <div className="text-xl font-bold">{userStats.longestStreak}</div>
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
          <Card className="h-full bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Value Offered vs Claimed Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClaimed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
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
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="claimedValue" 
                      name="Your Claimed Value"
                      stroke="#10b981" 
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
          <Card className="h-full bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChartIcon className="w-5 h-5 text-cyan-400" />
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
          <Card className="h-full bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-pink-400" />
                Games per Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
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
                    <Bar dataKey="totalGames" name="Total Games" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="claimedGames" name="Claimed Games" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
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
          <Card className="h-full bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-amber-400" />
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
                      <Cell fill="#8b5cf6" />
                      <Cell fill="#334155" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium">Most Valuable Month</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{userStats.mostValuableMonth || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-medium">Most Valuable Year</span>
                  </div>
                  <span className="text-sm font-bold text-violet-400">{userStats.mostValuableYear || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-pink-400" />
                    <span className="text-sm font-medium">Mystery Games</span>
                  </div>
                  <span className="text-sm font-bold text-pink-400">{userStats.mysteryGamesClaimed}</span>
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
          <Card className="h-full bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Top Publishers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={publisherStats.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
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
                    <Bar dataKey="count" name="Total Games" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="claimedCount" name="Claimed" fill="#10b981" radius={[0, 4, 4, 0]} />
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
