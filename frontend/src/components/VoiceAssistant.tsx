import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  MousePointerClick,
  HelpCircle
} from 'lucide-react';

interface VoiceAssistantProps {
  activeTab: string;
  currentUserRole?: string;
  kpis?: any;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  activeTab,
  currentUserRole,
  kpis,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hoverReadMode, setHoverReadMode] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle global hover reading when hoverReadMode is on
  useEffect(() => {
    if (!hoverReadMode || typeof window === 'undefined') return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, [role="button"], th, h1, h2, h3');
      if (interactive) {
        const textToRead =
          interactive.getAttribute('aria-label') ||
          interactive.getAttribute('title') ||
          interactive.innerText ||
          interactive.getAttribute('placeholder');

        if (textToRead && textToRead.trim().length > 0 && textToRead.trim().length < 120) {
          speakText(textToRead.trim());
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [hoverReadMode]);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const getPageSummaryText = (): string => {
    switch (activeTab) {
      case 'dashboard':
        return `You are on the Executive Management Dashboard. Today's bottling production output is ${Number(kpis?.bottles_produced || 74620).toLocaleString()} bottles with a quality pass rate of ${kpis?.quality_pass_rate || 96.8} percent. Available inventory is ${Number(kpis?.available_stock || 60700).toLocaleString()} bottles. There is currently ${kpis?.ai_anomalies_flagged || 1} active AI anomaly alert under review.`;
      case 'production':
        return `You are in the Production and Batch Management Module. Here you can register new batches, view active bottling runs on Line 1 and Line 2, and monitor preform blowing status at the Kissy facility.`;
      case 'quality':
        return `You are in the Quality Assurance and Inspection Module. Laboratory parameters include pH level, volumetric filling, and cap seal torque. The AI Quality Copilot is active to flag chemical contamination or leaks before batch release.`;
      case 'ai':
        return `You are in the AI Quality Intelligence Hub. Machine learning models Isolation Forest and Random Forest are analyzing multivariate sensor data. You can test live sliders for pH, volume, and torque with instant real-time anomaly detection.`;
      case 'inventory':
        return `You are in the Warehouse and Inventory Control Module. Tracking finished stock across Kissy Central Warehouse and Lumley Depot. Current capacity occupancy is 60 percent.`;
      case 'distribution':
        return `You are in the Fleet Distribution and Logistics Module. Tracking deliveries to Freetown wholesale distributors, Kenema, and Bo routes.`;
      case 'tracking':
        return `You are on the QR Code Batch Traceability System. You can view the complete immutable lifecycle from raw water treatment to supermarket delivery.`;
      case 'admin':
        return `You are in the Admin Management Console. As an administrator, you can manage staff user credentials, add new users, monitor quality incident cases, abort compromised batches, and manage system records.`;
      case 'reports':
        return `You are in the Reports and SLSB Compliance Module. Ready to generate and export regulatory compliance audits for Sierra Leone authorities.`;
      default:
        return `You are viewing BeverageTrack AI, the intelligent quality tracking system for Sierra Leone bottling companies.`;
    }
  };

  const handleReadActivePage = () => {
    const summary = getPageSummaryText();
    speakText(summary);
  };

  const handleStopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!speechSupported) return null;

  return (
    <div className="relative">
      {/* Audio Button */}
      <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 p-1 rounded-xl transition shadow-sm">
        <button
          type="button"
          onClick={() => {
            if (isSpeaking) {
              handleStopSpeaking();
            } else {
              handleReadActivePage();
            }
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-white text-slate-700 hover:text-sky-700 shadow-xs'
          }`}
          title={isSpeaking ? 'Click to stop reading' : 'Click to hear page summary read aloud'}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Voice</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Voice Read</span>
            </>
          )}
        </button>

        {/* Voice Menu Options Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className={`p-1.5 rounded-lg text-xs transition ${
            isOpenMenu ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Voice Reader Settings (Hover to read any button)"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Voice Assistant Controls Flyout */}
      {isOpenMenu && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>AI Audio Voice Assistant</span>
            </div>
            {isSpeaking && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                Speaking...
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Listen to intelligent audio summaries of quality metrics, batches, and interactive buttons.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                handleReadActivePage();
                setIsOpenMenu(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold text-left transition flex items-center justify-between border border-sky-200"
            >
              <span className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-sky-600 fill-current" />
                Read Current Page Aloud
              </span>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-600">
                Summary
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHoverReadMode(!hoverReadMode);
                if (!hoverReadMode) {
                  speakText('Hover read mode activated. Move your cursor over any button or text to hear it.');
                } else {
                  handleStopSpeaking();
                }
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-left transition flex items-center justify-between border ${
                hoverReadMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <MousePointerClick className="w-3.5 h-3.5 text-slate-600" />
                Hover to Read Buttons
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                hoverReadMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {hoverReadMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {isSpeaking && (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="w-full py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Mute Voice Now</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
