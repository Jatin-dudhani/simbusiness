import { AdChannelState, AdChannelId } from '@/types';

export const INITIAL_AD_CHANNELS: AdChannelState[] = [
  {
    id: 'meta',
    name: 'Meta Ads (Instagram & FB)',
    dailyBudget: 40,
    baseCpm: 22.0,
    effectiveCpm: 22.0,
    baseCtr: 1.8,
    effectiveCtr: 1.8,
    baseCvr: 2.8,
    effectiveCvr: 2.8,
    effectiveRoas: 2.4,
    fatiguePct: 0,
    saturationFactor: 1.0,
    totalSpent: 0,
    totalAttributedRevenue: 0,
  },
  {
    id: 'tiktok',
    name: 'TikTok Spark & Video Ads',
    dailyBudget: 35,
    baseCpm: 12.0,
    effectiveCpm: 12.0,
    baseCtr: 2.6,
    effectiveCtr: 2.6,
    baseCvr: 2.1,
    effectiveCvr: 2.1,
    effectiveRoas: 2.1,
    fatiguePct: 0,
    saturationFactor: 1.0,
    totalSpent: 0,
    totalAttributedRevenue: 0,
  },
  {
    id: 'google',
    name: 'Google Search & Shopping',
    dailyBudget: 25,
    baseCpm: 44.0,
    effectiveCpm: 44.0,
    baseCtr: 3.8,
    effectiveCtr: 3.8,
    baseCvr: 4.4,
    effectiveCvr: 4.4,
    effectiveRoas: 3.2,
    fatiguePct: 0,
    saturationFactor: 1.0,
    totalSpent: 0,
    totalAttributedRevenue: 0,
  },
];

export interface ChannelDayResult {
  updatedChannels: AdChannelState[];
  totalAdSpend: number;
  totalAttributedOrders: number;
  totalAttributedRevenue: number;
  blendedRoas: number;
  channelPerformance: {
    channelId: AdChannelId;
    spend: number;
    impressions: number;
    clicks: number;
    orders: number;
    revenue: number;
    roas: number;
  }[];
}

/**
 * Simulate 1 day across all active marketing channels with diminishing returns and fatigue
 */
export function simulateMarketingDay(
  channels: AdChannelState[],
  storeAov: number
): ChannelDayResult {
  let totalAdSpend = 0;
  let totalAttributedOrders = 0;
  let totalAttributedRevenue = 0;

  const channelPerformance: ChannelDayResult['channelPerformance'] = [];

  const updatedChannels = channels.map(ch => {
    const spend = Math.max(0, ch.dailyBudget);
    totalAdSpend += spend;

    if (spend <= 0) {
      channelPerformance.push({
        channelId: ch.id,
        spend: 0,
        impressions: 0,
        clicks: 0,
        orders: 0,
        revenue: 0,
        roas: 0,
      });
      return ch;
    }

    // 1. Diminishing returns / audience saturation curve
    // As daily spend scales above $80, CPM rises as the ad network reaches colder audiences
    const saturation = 1 + Math.pow(spend / 100, 1.25);

    // 2. Creative fatigue accumulates (~3% per day if creatives aren't refreshed)
    const newFatigue = Math.min(85, ch.fatiguePct + (spend > 0 ? 3.5 : 0));
    const fatiguePenalty = 1 - (newFatigue / 100) * 0.45; // up to 45% reduction in CTR & CVR

    // 3. Effective metrics calculation
    const effectiveCpm = parseFloat((ch.baseCpm * saturation).toFixed(2));
    const effectiveCtr = parseFloat((ch.baseCtr * fatiguePenalty).toFixed(2));
    const effectiveCvr = parseFloat((ch.baseCvr * fatiguePenalty).toFixed(2));

    // 4. Funnel math
    const impressions = Math.round((spend / effectiveCpm) * 1000);
    const clicks = Math.round(impressions * (effectiveCtr / 100));
    const orders = Math.max(0, Math.round(clicks * (effectiveCvr / 100)));
    const revenue = parseFloat((orders * storeAov).toFixed(2));
    const roas = spend > 0 ? parseFloat((revenue / spend).toFixed(2)) : 0;

    totalAttributedOrders += orders;
    totalAttributedRevenue += revenue;

    channelPerformance.push({
      channelId: ch.id,
      spend,
      impressions,
      clicks,
      orders,
      revenue,
      roas,
    });

    return {
      ...ch,
      effectiveCpm,
      effectiveCtr,
      effectiveCvr,
      effectiveRoas: roas,
      fatiguePct: newFatigue,
      saturationFactor: parseFloat(saturation.toFixed(2)),
      totalSpent: parseFloat((ch.totalSpent + spend).toFixed(2)),
      totalAttributedRevenue: parseFloat((ch.totalAttributedRevenue + revenue).toFixed(2)),
    };
  });

  const blendedRoas = totalAdSpend > 0 ? parseFloat((totalAttributedRevenue / totalAdSpend).toFixed(2)) : 0;

  return {
    updatedChannels,
    totalAdSpend: parseFloat(totalAdSpend.toFixed(2)),
    totalAttributedOrders,
    totalAttributedRevenue: parseFloat(totalAttributedRevenue.toFixed(2)),
    blendedRoas,
    channelPerformance,
  };
}

/**
 * Refresh Ad Creative to eliminate creative fatigue (e.g. after generating fresh Gemini AI ad hooks)
 */
export function refreshChannelCreative(
  channelId: AdChannelId,
  channels: AdChannelState[]
): AdChannelState[] {
  return channels.map(ch => {
    if (ch.id === channelId) {
      return {
        ...ch,
        fatiguePct: 0,
        effectiveCtr: parseFloat((ch.baseCtr * 1.1).toFixed(2)), // 10% freshness boost
      };
    }
    return ch;
  });
}
