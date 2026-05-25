import { ArrowLeft, Heart, Trash2, MapPin, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS } from '../data/constants';

export default function WishlistScreen() {
  const { setScreen, wishlist, toggleWishlist, setCurrentPrefs } = useApp();

  const wishlistDestinations = wishlist.map(w => ({
    item: w,
    dest: DESTINATIONS.find(d => d.id === w.destinationId),
  })).filter(({ dest }) => dest);

  const handleExplore = (destId: string) => {
    const dest = DESTINATIONS.find(d => d.id === destId);
    if (!dest) return;
    setCurrentPrefs({
      from: 'Delhi',
      destination: dest.name,
      destinationId: dest.id,
      budget: dest.basePrice * 2,
      duration: 7,
      tripType: 'leisure',
      date: '',
      travellers: 2,
      interests: [],
      priority: 'comfort',
    });
    setScreen('preferences');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white flex-1 flex items-center gap-2">
            <Heart size={18} className="text-red-500 fill-red-500" />
            My Wishlist
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({wishlist.length})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {wishlistDestinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Save destinations you love by tapping the heart icon.</p>
            <button
              onClick={() => setScreen('dashboard')}
              className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlistDestinations.map(({ item, dest }) => dest && (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
                <div className="relative h-40">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => toggleWishlist(item.destinationId, item.destinationName)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                  >
                    <Trash2 size={14} className="text-white" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${dest.tagColor}`}>{dest.tag}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={10} />
                        <span>{dest.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{dest.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="font-black text-gray-900 dark:text-white">₹{(dest.basePrice / 1000).toFixed(0)}K</p>
                    </div>
                    <button
                      onClick={() => handleExplore(dest.id)}
                      className="px-4 py-2 rounded-xl text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
