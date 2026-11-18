import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Play, Search, ArrowLeft, Plus, Check, User } from 'lucide-react';

const API_URL = 'http://10.0.2.2:4000'; 

const PROFILES = [
  { id: 'p1', name: 'Main', color: 'bg-red-600' },
  { id: 'p2', name: 'Kids', color: 'bg-blue-500' }
];

function VideoPlayer({ movie, startTime = 0, onClose, onSaveProgress }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(movie.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = startTime;
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = movie.streamUrl;
      video.currentTime = startTime;
      video.play().catch(() => {});
    }

    const interval = setInterval(() => {
      if (!video.paused && video.currentTime > 0) {
        onSaveProgress(movie.id, Math.floor(video.currentTime));
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (hls) hls.destroy();
    };
  }, [movie]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center">
      <button
        onClick={onClose}
        className="absolute top-5 left-5 z-50 flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full text-white"
      >
        <ArrowLeft size={20} /> Back
      </button>
      <video
        ref={videoRef}
        controls
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [search, setSearch] = useState('');
  const [myList, setMyList] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setCatalog([
      {
        id: '1',
        title: 'Tears of Steel (Demo)',
        description: 'Sci-Fi short film streaming via HLS adaptive bitrate.',
        genre: 'Sci-Fi',
        featured: true,
        backdrop: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tears_of_Steel_in_the_Oude_Kerk.jpg/1280px-Tears_of_Steel_in_the_Oude_Kerk.jpg',
        poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Tears_of_Steel_poster.jpg/600px-Tears_of_Steel_poster.jpg',
        streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
      },
      {
        id: '2',
        title: 'Big Buck Bunny',
        description: 'A giant, gentle rabbit deals with three bullying rodents in a lush forest.',
        genre: 'Animation',
        featured: false,
        backdrop: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
        poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/600px-Big_buck_bunny_poster_big.jpg',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
      }
    ]);
  }, []);

  const handleSaveProgress = (movieId, seconds) => {
    setProgress((prev) => ({ ...prev, [movieId]: seconds }));
  };

  const toggleMyList = (id) => {
    setMyList((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-red-600 text-3xl font-extrabold tracking-widest mb-10">STREAMFLIX</h1>
        <p className="text-gray-300 text-lg mb-8">Who's watching?</p>
        <div className="flex gap-6">
          {PROFILES.map((p) => (
            <button key={p.id} onClick={() => setProfile(p)} className="flex flex-col items-center gap-2">
              <div className={`w-24 h-24 rounded-lg ${p.color} flex items-center justify-center shadow-lg`}>
                <User size={44} />
              </div>
              <span className="text-sm text-gray-300">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (activeMovie) {
    return (
      <VideoPlayer
        movie={activeMovie}
        startTime={progress[activeMovie.id] || 0}
        onClose={() => setActiveMovie(null)}
        onSaveProgress={handleSaveProgress}
      />
    );
  }

  const featured = catalog.find((m) => m.featured) || catalog[0];
  const filtered = catalog.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pb-16">
      <div className="fixed top-0 inset-x-0 z-30 bg-gradient-to-b from-black/90 to-transparent p-4 flex items-center justify-between">
        <span className="text-red-600 font-black text-xl tracking-wider">STREAMFLIX</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/70 border border-gray-700 rounded-full px-3 py-1">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm focus:outline-none w-28 text-white"
            />
          </div>
          <button onClick={() => setProfile(null)} className={`w-8 h-8 rounded ${profile.color} flex items-center justify-center text-xs font-bold text-white`}>
            {profile.name[0]}
          </button>
        </div>
      </div>

      {featured && !search && (
        <div className="relative h-[62vh] w-full">
          <img src={featured.backdrop} alt={featured.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute bottom-6 left-4 right-4">
            <span className="text-xs uppercase tracking-widest text-red-500 font-bold">{featured.genre}</span>
            <h2 className="text-3xl font-extrabold mt-1">{featured.title}</h2>
            <p className="text-xs text-gray-300 line-clamp-2 mt-2 mb-4">{featured.description}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveMovie(featured)}
                className="flex-1 bg-white text-black font-bold py-2.5 rounded flex items-center justify-center gap-2"
              >
                <Play size={18} fill="black" /> Play
              </button>
              <button
                onClick={() => toggleMyList(featured.id)}
                className="flex-1 bg-gray-800/90 text-white font-semibold py-2.5 rounded flex items-center justify-center gap-2"
              >
                {myList.includes(featured.id) ? <Check size={18} /> : <Plus size={18} />} My List
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`px-4 space-y-6 ${search ? 'pt-20' : 'mt-2'}`}>
        <div>
          <h3 className="text-base font-bold mb-3">{search ? 'Search Results' : 'Trending Now'}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filtered.map((movie) => (
              <div key={movie.id} onClick={() => setActiveMovie(movie)} className="flex-shrink-0 w-32 cursor-pointer">
                <img src={movie.poster} alt={movie.title} className="w-32 h-48 object-cover rounded-md bg-gray-800" />
                <p className="text-xs font-medium mt-1.5 truncate">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
              }
