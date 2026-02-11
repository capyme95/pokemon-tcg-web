import Link from 'next/link';
import { getSets } from '@/lib/supabase';

export default async function SetsPage() {
  const sets = await getSets();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Sets</h1>
        <p className="text-gray-400">
          {sets.length} sets available
        </p>
      </div>

      <div className="border border-[#333] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#111] border-b border-[#333]">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Set</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Series</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Cards</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Release Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {sets.map((set) => (
              <tr key={set.id} className="hover:bg-[#111] transition-colors">
                <td className="px-6 py-4">
                  <Link 
                    href={`/sets/${set.id}`}
                    className="font-medium hover:text-white transition"
                  >
                    {set.name}
                  </Link>
                  <span className="ml-2 text-sm text-gray-600">({set.id})</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{set.series}</td>
                <td className="px-6 py-4 text-gray-400">{set.total_cards}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(set.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
