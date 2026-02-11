import Link from 'next/link';
import Image from 'next/image';
import { 
  getCard, 
  getCardAttacks, 
  getCardAbilities, 
  getEquivalentCards,
  getCardImageUrl 
} from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ cardId: string }>;
}

export default async function CardDetailPage({ params }: Props) {
  const { cardId } = await params;
  const card = await getCard(cardId);
  
  if (!card) {
    notFound();
  }
  
  const [attacks, abilities, equivalents] = await Promise.all([
    getCardAttacks(cardId),
    getCardAbilities(cardId),
    getEquivalentCards(card.card_name, cardId)
  ]);

  const isPokemon = card.card_type === 'pokemon';

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Card Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="aspect-[2.5/3.5] relative bg-[#111] rounded-xl overflow-hidden border border-[#333]">
              <Image
                src={getCardImageUrl(card.set_code, card.card_number)}
                alt={card.card_name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>
            
            {/* Card Info */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Set</span>
                <Link href={`/sets/${card.set_code}`} className="hover:text-white transition">
                  {card.set_code}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Number</span>
                <span>{card.card_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rarity</span>
                <span>{card.rarity || 'Unknown'}</span>
              </div>
              {card.artist && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Artist</span>
                  <span className="text-gray-300">{card.artist}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Card Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="border-b border-[#333] pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{card.card_name}</h1>
                <p className="text-gray-400">
                  {card.card_subtype} {card.card_type}
                  {card.element_type && ` · ${card.element_type}`}
                </p>
              </div>
              {card.hp && (
                <div className="text-right">
                  <span className="text-3xl font-bold">{card.hp}</span>
                  <span className="text-gray-500 ml-1">HP</span>
                </div>
              )}
            </div>
          </div>

          {/* Pokemon Stats */}
          {isPokemon && (
            <div className="grid grid-cols-3 gap-4">
              {card.weakness && (
                <div className="border border-[#333] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Weakness</p>
                  <p className="font-medium">{card.weakness}</p>
                </div>
              )}
              {card.resistance && (
                <div className="border border-[#333] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Resistance</p>
                  <p className="font-medium">{card.resistance}</p>
                </div>
              )}
              {card.retreat_cost !== null && card.retreat_cost !== undefined && (
                <div className="border border-[#333] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Retreat Cost</p>
                  <p className="font-medium">{card.retreat_cost}</p>
                </div>
              )}
            </div>
          )}

          {/* Abilities */}
          {abilities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Ability</h2>
              <div className="space-y-4">
                {abilities.map((ability) => (
                  <div key={ability.id} className="border border-[#333] rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">{ability.ability_name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {ability.ability_effect}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attacks */}
          {attacks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Attacks</h2>
              <div className="space-y-4">
                {attacks.map((attack) => (
                  <div key={attack.id} className="border border-[#333] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{attack.attack_name}</h3>
                        <p className="text-sm text-gray-500">
                          Cost: {attack.energy_symbols?.join(' ') || attack.energy_cost_total}
                        </p>
                      </div>
                      {attack.damage && (
                        <span className="text-xl font-bold">{attack.damage}</span>
                      )}
                    </div>
                    {attack.effect_text && (
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {attack.effect_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* International Prints */}
          {equivalents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">International Prints</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {equivalents.map((eq) => (
                  <Link
                    key={eq.id}
                    href={`/cards/${eq.id}`}
                    className="group"
                  >
                    <div className="aspect-[2.5/3.5] relative bg-[#111] rounded-lg overflow-hidden border border-[#333] group-hover:border-white transition-colors">
                      <Image
                        src={getCardImageUrl(eq.set_code, eq.card_number)}
                        alt={eq.card_name}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{eq.id}</p>
                      <p className="text-xs text-gray-500">{eq.rarity || 'Unknown'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
