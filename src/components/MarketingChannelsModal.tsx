'use client';

import React from 'react';
import { AdChannelState, AdChannelId } from '@/types';
import { refreshChannelCreative } from '@/services/adEngine';
import { 
  FiX, 
  FiTarget, 
  FiRefreshCw, 
  FiTrendingUp, 
  FiZap, 
  FiDollarSign,
  FiInfo
} from 'react-icons/fi';

interface MarketingChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: AdChannelState[];
  onUpdateChannels: (updated: AdChannelState[]) => void;
  liquidCash: number;
}

export default function MarketingChannelsModal({
  isOpen,
  onClose,
  channels,
  onUpdateChannels,
  liquidCash,
}: MarketingChannelsModalProps) {
  if (!isOpen) return null;

  const totalDailyBudget = channels.reduce((acc, c) => acc + c.dailyBudget, 0);

  const handleBudgetChange = (id: AdChannelId, newBudget: number) => {
    const updated = channels.map(c => (c.id === id ? { ...c, dailyBudget: Math.max(0, newBudget) } : c));
    onUpdateChannels(updated);
  };

  const handleRefreshCreative = (id: AdChannelId) => {
    const refreshed = refreshChannelCreative(id, channels);
    onUpdateChannels(refreshed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black text-white rounded-xl">
              <FiTarget className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Multi-Channel Ad Engine</h2>
              <p className="text-xs text-zinc-500">Configure channel allocation, manage ad fatigue, and master marginal CAC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ad Economics Education Banner */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-start gap-3">
            <FiInfo className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900 font-semibold block mb-0.5">The Diminishing ROAS Law:</strong>
              As daily spend on a single channel scales beyond $80/day, the algorithm exhausts hot remarketing audiences, driving <strong>CPM higher</strong> and <strong>ROAS down</strong>. Additionally, running the same ad creative for multiple days builds <strong>creative fatigue</strong>. Refresh your hooks regularly!
            </div>
          </div>

          {/* Channels Grid */}
          <div className="space-y-4">
            {channels.map((ch) => {
              const isFatigued = ch.fatiguePct >= 40;
              const isSaturated = ch.saturationFactor > 1.25;

              return (
                <div 
                  key={ch.id} 
                  className={`p-5 rounded-xl border transition ${
                    ch.dailyBudget > 0 ? 'border-zinc-300 bg-white shadow-sm' : 'border-zinc-200 bg-zinc-50/60 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-zinc-900">{ch.name}</span>
                      {isFatigued && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded">
                          Ad Fatigue {ch.fatiguePct.toFixed(0)}%
                        </span>
                      )}
                      {isSaturated && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded">
                          Audience Saturated ({ch.saturationFactor}x CPM)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRefreshCreative(ch.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition"
                      title="Reset creative fatigue to 0% and boost CTR"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                      Refresh Creative
                    </button>
                  </div>

                  {/* Slider and Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-zinc-500 font-medium">Daily Budget Allocation:</span>
                        <span className="font-mono font-bold text-zinc-900">${ch.dailyBudget}/day</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="250"
                        step="5"
                        value={ch.dailyBudget}
                        onChange={(e) => handleBudgetChange(ch.id, parseFloat(e.target.value))}
                        className="w-full accent-black cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                        <span>$0 (Paused)</span>
                        <span>$100 (Optimal)</span>
                        <span>$250 (High Scale)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="text-[10px] text-zinc-400 uppercase">CPM</div>
                        <div className="text-xs font-bold text-zinc-900 font-mono mt-0.5">${ch.effectiveCpm.toFixed(1)}</div>
                      </div>
                      <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="text-[10px] text-zinc-400 uppercase">CTR</div>
                        <div className="text-xs font-bold text-zinc-900 font-mono mt-0.5">{ch.effectiveCtr.toFixed(1)}%</div>
                      </div>
                      <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="text-[10px] text-zinc-400 uppercase">CVR</div>
                        <div className="text-xs font-bold text-zinc-900 font-mono mt-0.5">{ch.effectiveCvr.toFixed(1)}%</div>
                      </div>
                      <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="text-[10px] text-zinc-400 uppercase">Est. ROAS</div>
                        <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">{ch.effectiveRoas > 0 ? `${ch.effectiveRoas}x` : '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50/50">
          <div className="text-xs">
            <span className="text-zinc-500">Total Daily Ad Spend: </span>
            <strong className="text-zinc-900 font-semibold font-mono">${totalDailyBudget.toFixed(2)}/day</strong>
            <span className="text-zinc-400 ml-2">(Liquid Bank Cash: ${liquidCash.toFixed(2)})</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"
          >
            Apply Ad Allocation
          </button>
        </div>
      </div>
    </div>
  );
}
