import Link from 'next/link';
import { getSets } from '@/lib/supabase';

export default async function HomePage() {
  const sets = await getSets();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Cards</h1>
        <p className="text-gray-400">
          Browse Pokemon Trading Card Game cards by set
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sets.map((set) => (
          <Link
            key={set.id}
            href={`/sets/${set.id}`}
            className="group block border border-[#333] rounded-lg p-6 hover:border-white transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold group-hover:text-white transition">
                  {set.name}
                </h2>
                <p className="text-sm text-gray-500">{set.series}</p>
              </div>
              <span className="text-2xl font-mono text-gray-600">{set.id}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {set.total_cards} cards
              </span>
              <span className="text-gray-600">
                {new Date(set.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link 
          href="/sets"
          className="inline-block border border-[#333] rounded-lg px-8 py-3 text-sm hover:border-white hover:bg-white hover:text-black transition-all"
        >
          View All Sets
        </Link>
      </div>
    </main>
  );
}
