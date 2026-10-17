'use client';

import React from 'react';
import { ScenarioChallenge } from '@/types';
import { SCENARIO_CHALLENGES } from '@/services/scenarioEngine';
import { 
  FiX, 
  FiAward, 
  FiTarget, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiPlay, 
  FiDollarSign, 
  FiClock, 
  FiPackage 
} from 'react-icons/fi';

interface ScenarioChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChallenge: (challenge: ScenarioChallenge) => void;
  activeChallengeId: string | null;
}

export default function ScenarioChallengesModal({
  isOpen,
  onClose,
  onSelectChallenge,
  activeChallengeId,
}: ScenarioChallengesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black text-white rounded-xl">
              <FiAward className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Founder Career Scenarios & Challenges</h2>
              <p className="text-xs text-zinc-500">Structured entrepreneurial scenarios to stress-test your business acumen</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIO_CHALLENGES.map((challenge) => {
              const isActive = activeChallengeId === challenge.id;
              const difficultyBadgeClass = 
                challenge.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                challenge.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div
                  key={challenge.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between transition ${
                    isActive ? 'border-black bg-zinc-50/80 shadow-md ring-1 ring-black' : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded ${difficultyBadgeClass}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                        <FiClock className="w-3 h-3" /> Max {challenge.maxDays} Days
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-zinc-900">{challenge.title}</h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{challenge.description}</p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-zinc-50 rounded-lg border border-zinc-100 text-[11px]">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Starting Cash:</span>
                        <strong className="text-zinc-800 font-mono">${challenge.initialCash}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Starting Inventory:</span>
                        <strong className="text-zinc-800 font-mono">{challenge.initialInventory} units</strong>
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Mission Directives:</div>
                      {challenge.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-600">
                          <span className="text-zinc-400 mt-0.5">•</span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div className="text-[11px]">
                      <span className="text-zinc-400">Target: </span>
                      <strong className="text-zinc-900">{challenge.targetMetric} ≥ {challenge.targetValue}</strong>
                    </div>

                    <button
                      onClick={() => {
                        onSelectChallenge(challenge);
                        onClose();
                      }}
                      className={`btn text-xs px-3 py-1.5 flex items-center gap-1 ${
                        isActive ? 'btn-primary bg-emerald-700 border-emerald-700' : 'btn-primary'
                      }`}
                    >
                      <FiPlay className="w-3 h-3" />
                      <span>{isActive ? 'Active Mission' : 'Start Scenario'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 text-xs text-zinc-500">
          <span>Completing challenges unlocks simulated business badges and builds mastery.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
