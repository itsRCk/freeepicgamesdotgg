import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star, StarHalf, Share2, Flag, Gamepad2, Info, Monitor } from 'lucide-react';
import { GAMES_DATA } from '@/data/games';
import { fetchLiveEpicGames } from '@/lib/epic-api';
import { ClaimButton } from './claim-button';
import { GameCoverImage } from '@/components/shared/game-cover-image';

async function getGame(id: string) {
  let game = GAMES_DATA.find(g => g.id === id);
  if (game) return game;

  try {
    const liveGames = await fetchLiveEpicGames();
    game = [...liveGames.active, ...liveGames.upcoming].find(g => g.id === id);
    if (game) return game;
  } catch (err) {
    console.error("Error fetching live game:", err);
  }
  return null;
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const game = await getGame(resolvedParams.id);
  
  if (!game) {
    notFound();
  }

  // Mock data for the template
  const mockScreenshots = [
    `https://picsum.photos/seed/${game.id}1/1280/720`,
    `https://picsum.photos/seed/${game.id}2/1280/720`,
    `https://picsum.photos/seed/${game.id}3/1280/720`,
    `https://picsum.photos/seed/${game.id}4/1280/720`,
    `https://picsum.photos/seed/${game.id}5/1280/720`,
  ];
  
  const mockGenres = ["Action", "Adventure", "RPG"];
  const mockFeatures = ["Single Player", "Cloud Saves", "Achievements"];
  const mockRating = 4.4;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans pb-20">
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/8 px-4 md:px-8 h-14 flex items-center">
        <Link href="/library" className="flex items-center text-[#888] hover:text-white transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Store</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">{game.title}</h1>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-white">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="w-4 h-4 fill-current" />
              ))}
              <StarHalf className="w-4 h-4 fill-current" />
            </div>
            <span className="font-mono font-semibold text-white">{mockRating}</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mt-8 border-b border-white/8">
            <button className="text-white border-b-2 border-white pb-3 text-sm font-medium">Overview</button>
            <button className="text-[#888] hover:text-[#ededed] pb-3 text-sm font-medium transition-colors">Add-Ons</button>
            <button className="text-[#888] hover:text-[#ededed] pb-3 text-sm font-medium transition-colors">Achievements</button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          
          {/* LEFT COLUMN - Main Content */}
          <div className="space-y-12">
            
            {/* Carousel / Media Player */}
            <div className="rounded-md overflow-hidden bg-black aspect-video relative group border border-white/8">
              <Image 
                src={mockScreenshots[0]} 
                alt={`${game.title} screenshot`}
                fill
                className="object-cover"
                unoptimized
              />
              
              {/* Thumbnail Strip */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {mockScreenshots.map((img, idx) => (
                  <div key={idx} className={`w-16 h-10 relative rounded-md border overflow-hidden ${idx === 0 ? 'border-white' : 'border-transparent hover:border-white/50 cursor-pointer'}`}>
                    <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Metadata */}
            <div>
              <p className="text-base text-[#ededed] mb-8 leading-relaxed">
                {game.description}
              </p>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/8">
                <div>
                  <h3 className="text-xs font-medium text-[#555] mb-2 uppercase tracking-wider">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockGenres.map(g => (
                      <span key={g} className="px-2.5 py-1 bg-white/5 border border-white/8 hover:bg-white/10 transition-colors rounded-md text-xs text-[#ededed] cursor-pointer font-mono">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-[#555] mb-2 uppercase tracking-wider">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockFeatures.map(f => (
                      <span key={f} className="px-2.5 py-1 bg-white/5 border border-white/8 hover:bg-white/10 transition-colors rounded-md text-xs text-[#ededed] cursor-pointer font-mono">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About The Game */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">About The Game</h2>
              <div className="text-sm text-[#888] space-y-4 leading-relaxed">
                <p>
                  Experience the critically acclaimed world of {game.title}. Developed by the talented team at {game.developer}, this game pushes the boundaries of its genre.
                </p>
                <p>
                  {game.description}
                </p>
                <p>
                  Discover new strategies, unlock hidden achievements, and immerse yourself in a world crafted with passion. 
                  Whether you are playing solo or exploring the vast features, {game.title} offers endless hours of entertainment.
                </p>
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="pt-8 border-t border-white/8">
              <h2 className="text-lg font-semibold text-white mb-6">Epic Player Ratings</h2>
              <div className="flex items-center gap-4 mb-10">
                <span className="text-4xl font-mono font-bold text-white">4.4</span>
                <div className="flex items-center text-white gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                  <StarHalf className="w-5 h-5 fill-current" />
                </div>
              </div>

              <h3 className="text-base font-semibold text-white mb-6">{game.title} Ratings & Reviews</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { outlet: "IGN", score: "9 / 10", quote: "An absolute masterpiece that redefines the genre. The mechanics are flawless." },
                  { outlet: "GameSpot", score: "8.5 / 10", quote: "A thrilling adventure from start to finish. Highly recommended for fans." },
                  { outlet: "PC Gamer", score: "88 / 100", quote: "Stunning visuals and deeply engaging gameplay loops make this a must-play." }
                ].map((review, i) => (
                  <div key={i} className="bg-[#111] p-6 rounded-md border border-white/8 flex flex-col h-full">
                    <span className="text-[#888] text-xs mb-4 font-mono">{review.outlet}</span>
                    <span className="text-white font-mono font-bold text-lg mb-4">{review.score}</span>
                    <p className="text-sm text-[#ededed] flex-grow">&quot;{review.quote}&quot;</p>
                    <button className="text-[#ededed] underline-offset-4 hover:underline text-xs mt-4 text-left font-medium">Read Full Review ↗</button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Requirements */}
            {/* System Requirements */}
            <div className="pt-8 border-t border-white/8">
              <h2 className="text-lg font-semibold text-white mb-6">{game.title} System Requirements</h2>
              <div className="bg-[#111] rounded-md p-8 border border-white/8">
                <div className="border-b border-white/8 mb-6 flex gap-6">
                  <button className="text-white border-b-2 border-white pb-3 text-sm font-medium">Windows</button>
                  <button className="text-[#888] pb-3 text-sm font-medium">macOS</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Minimum */}
                  <div className="space-y-6">
                    <h3 className="text-white font-semibold text-sm mb-4">Minimum</h3>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">OS version</span>
                      <span className="block text-[#ededed] text-sm">Windows 10 64-bit</span>
                    </div>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">CPU</span>
                      <span className="block text-[#ededed] text-sm">Intel Core i5-4590 or AMD equivalent</span>
                    </div>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">Memory</span>
                      <span className="block text-[#ededed] text-sm">8 GB RAM</span>
                    </div>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">GPU</span>
                      <span className="block text-[#ededed] text-sm">NVIDIA GTX 970 or AMD equivalent</span>
                    </div>
                  </div>

                  {/* Recommended */}
                  <div className="space-y-6">
                    <h3 className="text-white font-semibold text-sm mb-4">Recommended</h3>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">OS version</span>
                      <span className="block text-[#ededed] text-sm">Windows 11 64-bit</span>
                    </div>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">CPU</span>
                      <span className="block text-[#ededed] text-sm">Intel Core i7-9700K or AMD Ryzen 7 3700X</span>
                    </div>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">Memory</span>
                      <span className="block text-[#ededed] text-sm">16 GB RAM</span>
                    </div>
                    <div>
                      <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">GPU</span>
                      <span className="block text-[#ededed] text-sm">NVIDIA RTX 2070 or AMD RX 5700 XT</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/8 space-y-4">
                  <div>
                    <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">Login Accounts Required</span>
                    <span className="block text-[#ededed] text-sm">Epic ID</span>
                  </div>
                  <div>
                    <span className="block text-[#555] text-xs font-mono uppercase tracking-wider">Languages Supported</span>
                    <span className="block text-[#ededed] text-sm">Audio: English<br/>Text: English, French, German, Spanish, Japanese, Korean</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - Sticky Action Sidebar */}
          <div className="relative">
            <div className="sticky top-24 space-y-6">
              
              {/* Game Cover & Logo */}
              <div className="flex flex-col items-center py-4">
                <div className="w-48 aspect-[2/3] rounded-md overflow-hidden border border-white/8 shadow-2xl mb-4 bg-black">
                  <GameCoverImage title={game.title} coverArt={game.coverArt} />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-white text-center">
                  {game.title}
                </h2>
              </div>

              {/* Age Rating Mock */}
              <div className="bg-[#111] border border-white/8 rounded-md p-3 flex gap-3 items-center">
                <div className="w-12 h-12 bg-white flex items-center justify-center text-black font-bold text-lg rounded-sm">
                  12+
                </div>
                <div>
                  <span className="block text-white font-semibold text-sm">12+</span>
                  <span className="block text-[#888] text-xs">Mild Swearing, Violence</span>
                </div>
              </div>

              {/* Tag */}
              <div>
                <span className="bg-white/8 text-[#ededed] text-xs font-mono px-2 py-0.5 rounded-md">Base Game</span>
              </div>

              {/* Pricing */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-green-500/10 border border-green-500/20 text-green-400 font-mono font-medium px-2 py-0.5 rounded-md text-xs">-100%</span>
                  <span className="text-[#888] line-through text-sm font-mono">${game.originalPrice}</span>
                  <span className="text-white font-mono font-semibold text-lg">Free</span>
                </div>
                <p className="text-[#888] text-xs">Sale ends soon</p>
              </div>

              {/* Action Button (Interactive Client Component) */}
              <ClaimButton gameId={game.id} game={game} />

              {/* Metadata Grid */}
              <div className="text-sm space-y-3 pt-4">
                <div className="flex justify-between items-center py-2 border-b border-white/8">
                  <span className="text-[#555] text-xs font-medium">Refund Type</span>
                  <span className="text-[#ededed] text-xs flex items-center gap-1">Self-Refundable <Info className="w-3 h-3 text-[#555]" /></span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/8">
                  <span className="text-[#555] text-xs font-medium">Developer</span>
                  <span className="text-[#ededed] text-xs font-medium text-right">{game.developer}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/8">
                  <span className="text-[#555] text-xs font-medium">Publisher</span>
                  <span className="text-[#ededed] text-xs font-medium text-right">{game.publisher}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/8">
                  <span className="text-[#555] text-xs font-medium">Release Date</span>
                  <span className="text-[#ededed] text-xs font-mono">{new Date(game.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/8">
                  <span className="text-[#555] text-xs font-medium">Platform</span>
                  <span className="text-[#ededed] text-xs flex items-center gap-2"><Monitor className="w-3.5 h-3.5"/></span>
                </div>
              </div>

              {/* Share/Report */}
              <div className="flex gap-2 pt-4">
                <button className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/15 rounded-md py-2 flex items-center justify-center text-xs font-medium text-[#ededed] gap-2">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/15 rounded-md py-2 flex items-center justify-center text-xs font-medium text-[#ededed] gap-2">
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
