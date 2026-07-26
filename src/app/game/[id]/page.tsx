import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star, StarHalf, Share2, Flag, Gamepad2, Info, Monitor } from 'lucide-react';
import { GAMES_DATA } from '@/data/games';
import { ClaimButton } from './claim-button';
import { GameCoverImage } from '@/components/shared/game-cover-image';

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const game = GAMES_DATA.find(g => g.id === resolvedParams.id);
  
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
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans pb-20">
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 h-16 flex items-center">
        <Link href="/library" className="flex items-center text-gray-400 hover:text-white transition-colors group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Store</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{game.title}</h1>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-white">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="w-4 h-4 fill-current" />
              ))}
              <StarHalf className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-white">{mockRating}</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mt-8 border-b border-white/10">
            <button className="text-white border-b-2 border-white pb-3 text-sm font-medium">Overview</button>
            <button className="text-gray-400 hover:text-gray-200 pb-3 text-sm font-medium transition-colors">Add-Ons</button>
            <button className="text-gray-400 hover:text-gray-200 pb-3 text-sm font-medium transition-colors">Achievements</button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          
          {/* LEFT COLUMN - Main Content */}
          <div className="space-y-12">
            
            {/* Carousel / Media Player */}
            <div className="rounded-xl overflow-hidden bg-black aspect-video relative group">
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
                  <div key={idx} className={`w-16 h-10 relative rounded border-2 overflow-hidden ${idx === 0 ? 'border-white' : 'border-transparent hover:border-white/50 cursor-pointer'}`}>
                    <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Metadata */}
            <div>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {game.description}
              </p>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/10">
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockGenres.map(g => (
                      <span key={g} className="px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors rounded-sm text-sm text-gray-300 cursor-pointer">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockFeatures.map(f => (
                      <span key={f} className="px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors rounded-sm text-sm text-gray-300 cursor-pointer">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About The Game */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">About The Game</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
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
            <div className="pt-8 border-t border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Epic Player Ratings</h2>
              <div className="flex items-center gap-4 mb-10">
                <span className="text-5xl font-bold text-white">4.4</span>
                <div className="flex items-center text-white gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-6 h-6 fill-current" />
                  ))}
                  <StarHalf className="w-6 h-6 fill-current" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-6">{game.title} Ratings & Reviews</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { outlet: "IGN", score: "9 / 10", quote: "An absolute masterpiece that redefines the genre. The mechanics are flawless." },
                  { outlet: "GameSpot", score: "8.5 / 10", quote: "A thrilling adventure from start to finish. Highly recommended for fans." },
                  { outlet: "PC Gamer", score: "88 / 100", quote: "Stunning visuals and deeply engaging gameplay loops make this a must-play." }
                ].map((review, i) => (
                  <div key={i} className="bg-[#202020] p-6 rounded-lg border border-white/5 flex flex-col h-full">
                    <span className="text-gray-400 text-sm mb-4">{review.outlet}</span>
                    <span className="text-white font-bold text-xl mb-4">{review.score}</span>
                    <p className="text-sm text-gray-300 flex-grow">&quot;{review.quote}&quot;</p>
                    <button className="text-blue-500 hover:text-blue-400 text-sm mt-4 text-left font-medium">Read Full Review ↗</button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Requirements */}
            <div className="pt-8 border-t border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">{game.title} System Requirements</h2>
              <div className="bg-[#202020] rounded-xl p-8 border border-white/5">
                <div className="border-b border-white/10 mb-6 flex gap-6">
                  <button className="text-white border-b-2 border-white pb-3 text-sm font-medium">Windows</button>
                  <button className="text-gray-500 pb-3 text-sm font-medium">macOS</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Minimum */}
                  <div className="space-y-6">
                    <h3 className="text-white font-bold mb-4">Minimum</h3>
                    <div>
                      <span className="block text-gray-500 text-sm">OS version</span>
                      <span className="block text-gray-300 text-sm">Windows 10 64-bit</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">CPU</span>
                      <span className="block text-gray-300 text-sm">Intel Core i5-4590 or AMD equivalent</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">Memory</span>
                      <span className="block text-gray-300 text-sm">8 GB RAM</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">GPU</span>
                      <span className="block text-gray-300 text-sm">NVIDIA GTX 970 or AMD equivalent</span>
                    </div>
                  </div>

                  {/* Recommended */}
                  <div className="space-y-6">
                    <h3 className="text-white font-bold mb-4">Recommended</h3>
                    <div>
                      <span className="block text-gray-500 text-sm">OS version</span>
                      <span className="block text-gray-300 text-sm">Windows 11 64-bit</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">CPU</span>
                      <span className="block text-gray-300 text-sm">Intel Core i7-9700K or AMD Ryzen 7 3700X</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">Memory</span>
                      <span className="block text-gray-300 text-sm">16 GB RAM</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">GPU</span>
                      <span className="block text-gray-300 text-sm">NVIDIA RTX 2070 or AMD RX 5700 XT</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                  <div>
                    <span className="block text-gray-500 text-sm">Login Accounts Required</span>
                    <span className="block text-gray-300 text-sm">Epic ID</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-sm">Languages Supported</span>
                    <span className="block text-gray-300 text-sm">Audio: English<br/>Text: English, French, German, Spanish, Japanese, Korean</span>
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
                <div className="w-48 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-4 bg-black">
                  <GameCoverImage title={game.title} coverArt={game.coverArt} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter text-white drop-shadow-md text-center">
                  {game.title}
                </h2>
              </div>

              {/* Age Rating Mock */}
              <div className="bg-[#202020] border border-white/10 rounded-lg p-3 flex gap-3 items-center">
                <div className="w-12 h-12 bg-white flex items-center justify-center text-black font-black text-xl border-4 border-black outline outline-2 outline-white">
                  12+
                </div>
                <div>
                  <span className="block text-white font-bold text-sm">12+</span>
                  <span className="block text-gray-400 text-xs">Mild Swearing, Violence</span>
                </div>
              </div>

              {/* Tag */}
              <div>
                <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded">Base Game</span>
              </div>

              {/* Pricing */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-blue-600 text-white font-bold px-2 py-1 rounded text-sm">-100%</span>
                  <span className="text-gray-500 line-through text-sm">${game.originalPrice}</span>
                  <span className="text-white font-bold text-xl">Free</span>
                </div>
                <p className="text-gray-400 text-xs">Sale ends soon</p>
              </div>

              {/* Action Button (Interactive Client Component) */}
              <ClaimButton gameId={game.id} />

              {/* Metadata Grid */}
              <div className="text-sm space-y-3 pt-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-500">Refund Type</span>
                  <span className="text-gray-300 flex items-center gap-1">Self-Refundable <Info className="w-3 h-3 text-gray-500" /></span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-500">Developer</span>
                  <span className="text-gray-300 font-medium text-right">{game.developer}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-500">Publisher</span>
                  <span className="text-gray-300 font-medium text-right">{game.publisher}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-500">Release Date</span>
                  <span className="text-gray-300 font-medium">{new Date(game.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-500">Platform</span>
                  <span className="text-gray-300 flex items-center gap-2"><Monitor className="w-4 h-4"/></span>
                </div>
              </div>

              {/* Share/Report */}
              <div className="flex gap-2 pt-4">
                <button className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-lg py-2 flex items-center justify-center text-sm font-medium text-white gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-lg py-2 flex items-center justify-center text-sm font-medium text-white gap-2">
                  <Flag className="w-4 h-4" /> Report
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
