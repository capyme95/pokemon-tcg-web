import Link from 'next/link';
import Image from 'next/image';
import { getSet, getCardsBySet, getCardImageUrl } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ setCode: string }>;
}

export default async function SetDetailPage({ params }: Props) {
  const { setCode } = await params;
  const set = await getSet(setCode);
  
  if (!set) {
    notFound();
  }
  
  const cards = await getCardsBySet(setCode);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Set Header */}
      <div className="mb-8 pb-8 border-b border-[#333]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{set.name}</h1>
            <p className="text-gray-400">{set.series}</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-mono text-gray-600">{set.id}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
          <span>{set.total_cards} cards</span>
          <span>Released {new Date(set.release_date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="group"
          >
            <div className="aspect-[2.5/3.5] relative bg-[#111] rounded-lg overflow-hidden border border-[#333] group-hover:border-white transition-colors">
              <Image
                src={getCardImageUrl(card.set_code, card.card_number)}
                alt={card.card_name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium truncate group-hover:text-white transition">
                {card.card_name}
              </p>
              <p className="text-xs text-gray-500">
                {card.id} · {card.rarity || 'Unknown'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
