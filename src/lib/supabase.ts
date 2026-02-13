import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 类型定义
export interface CardSet {
  id: string;
  name: string;
  series: string;
  total_cards: number;
  release_date: string;
}

export interface Card {
  id: string;
  set_code: string;
  card_number: number;
  card_name: string;
  card_type: string;
  card_subtype: string;
  element_type: string;
  rarity: string;
  hp: number | null;
  weakness: string | null;
  resistance: string | null;
  retreat_cost: number | null;
  artist: string | null;
  image_url: string;
}

export interface CardAttack {
  id: number;
  card_id: string;
  attack_name: string;
  energy_cost_total: number;
  energy_symbols: string[];
  damage: number | null;
  effect_text: string | null;
}

export interface CardAbility {
  id: number;
  card_id: string;
  ability_name: string;
  ability_effect: string;
}

// 获取所有 Sets（按发布日期倒序）
export async function getSets(): Promise<CardSet[]> {
  const { data, error } = await supabase
    .from('card_sets')
    .select('*')
    .order('release_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// 获取 Set 详情
export async function getSet(setCode: string): Promise<CardSet | null> {
  const { data, error } = await supabase
    .from('card_sets')
    .select('*')
    .eq('id', setCode)
    .single();
  
  if (error) return null;
  return data;
}

// 获取 Set 的所有卡片（按卡号正序）
export async function getCardsBySet(setCode: string): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('set_code', setCode)
    .order('card_number', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// 获取卡片详情
export async function getCard(cardId: string): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single();
  
  if (error) return null;
  return data;
}

// 获取卡片的攻击技能
export async function getCardAttacks(cardId: string): Promise<CardAttack[]> {
  const { data, error } = await supabase
    .from('card_attacks')
    .select('*')
    .eq('card_id', cardId)
    .order('attack_order', { ascending: true });
  
  if (error) return [];
  
  // 如果数据库已经有转换后的字段，直接使用
  // 否则使用转换逻辑作为后备
  return (data || []).map(attack => {
    // 优先使用数据库中的转换字段
    if (attack.attack_name && attack.energy_symbols) {
      return {
        id: attack.id,
        card_id: attack.card_id,
        attack_name: attack.attack_name,
        energy_cost_total: attack.energy_cost_total || 0,
        energy_symbols: attack.energy_symbols || [],
        damage: attack.damage ? parseInt(attack.damage, 10) || null : null,
        effect_text: attack.effect || null
      };
    }
    
    // 后备：转换数据库结构到前端期望的结构
    // 从name字段中提取攻击名称（去掉前面的能量符号和空格）
    const nameParts = attack.name?.split(/\s+/) || [];
    const attackName = nameParts.slice(1).join(' ') || attack.name || '';
    
    // 解析能量消耗
    const cost = attack.cost || '';
    const energySymbols = cost.split('').filter((c: string) => c.trim());
    
    // 解析伤害值
    let damage: number | null = null;
    if (attack.damage) {
      const match = attack.damage.match(/^(\d+)/);
      if (match) {
        damage = parseInt(match[1], 10);
      }
    }
    
    return {
      id: attack.id,
      card_id: attack.card_id,
      attack_name: attackName,
      energy_cost_total: energySymbols.length,
      energy_symbols: energySymbols,
      damage: damage,
      effect_text: attack.effect || null
    };
  });
}

// 获取卡片的特性
export async function getCardAbilities(cardId: string): Promise<CardAbility[]> {
  const { data, error } = await supabase
    .from('card_abilities')
    .select('*')
    .eq('card_id', cardId);
  
  if (error) return [];
  return data || [];
}

// 获取等效卡（同名卡片在不同套装中）
export async function getEquivalentCards(cardName: string, excludeId: string): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('card_name', cardName)
    .neq('id', excludeId)
    .order('set_code', { ascending: true });
  
  if (error) return [];
  return data || [];
}

// 构建 limitless 图片 URL
export function getCardImageUrl(setCode: string, cardNumber: number | string): string {
  const num = String(cardNumber).padStart(3, '0');
  return `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/${setCode}/${setCode}_${num}_R_EN.png`;
}
