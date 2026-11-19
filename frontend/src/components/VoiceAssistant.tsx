import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  MousePointerClick,
  Globe2,
  Check,
  ChevronDown
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
  const [language, setLanguage] = useState<'krio' | 'english'>('krio');
  const [spokenSubtitle, setSpokenSubtitle] = useState<string | null>(null);
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
          const formatted = language === 'krio' ? translateToKrioSnippet(textToRead.trim()) : textToRead.trim();
          speakText(formatted);
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [hoverReadMode, language]);

  const translateToKrioSnippet = (text: string): string => {
    if (!text || typeof text !== 'string') return '';
    const lower = String(text).toLowerCase();
    if (lower.includes('sign out') || lower.includes('logout')) return 'Lock out en go bak na login';
    if (lower.includes('credentials')) return 'Luk all di staff credential dem';
    if (lower.includes('settings') || lower.includes('profile')) return 'Change yu profile en password';
    if (lower.includes('consumer scan')) return 'Open camera for scan bottle QR code';
    if (lower.includes('voice read')) return 'Mek di computer talk am na Krio';
    if (lower.includes('abort batch')) return 'Stop dis bad batch fast fast';
    if (lower.includes('release')) return 'Approve dis batch mek e go na market';
    if (lower.includes('add new')) return 'Add new staff user';
    return text;
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    setSpokenSubtitle(text);

    const utterance = new SpeechSynthesisUtterance(text);
    // Slightly rhythmic cadence for natural Krio flow
    utterance.rate = language === 'krio' ? 0.95 : 1.0;
    utterance.pitch = language === 'krio' ? 1.05 : 1.0;

    const voices = synthRef.current.getVoices();
    // Prioritize high-quality voices
    const naturalVoice = voices.find(v => (v.lang.startsWith('en-GB') || v.lang.startsWith('en-NG') || v.lang.startsWith('en-GH') || v.lang.startsWith('en-US')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => setSpokenSubtitle(null), 2500);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpokenSubtitle(null);
    };

    synthRef.current.speak(utterance);
  };

  const getPageSummaryText = (): string => {
    const totalProduced = Number(kpis?.bottles_produced || 74620).toLocaleString();
    const passRate = kpis?.quality_pass_rate || 96.8;
    const totalStock = Number(kpis?.available_stock || 60700).toLocaleString();
    const anomalies = kpis?.ai_anomalies_flagged || 1;

    if (language === 'krio') {
      switch (activeTab) {
        case 'dashboard':
          return `Kusheh! Dis na di Executive Dashboard for Sierra Springs na Kissy, Freetown. Tiday wi don bottle ${totalProduced} bottle dem. Wi quality pass rate na ${passRate} percent. Inside Kissy warehouse wi get ${totalStock} bottle dem ready for market. Di AI de hold ${anomalies} batch bikos e notice pH drift wey need quick check.`;
        case 'production':
          return `Kusheh! Dis na di Production side. Na ya Ibrahim Kamara de manage Line 1 en Line 2. Wi de blow di preform bottle dem, monitor machine speed, en register new batch before e go for inspection.`;
        case 'quality':
          return `Dis na di Quality Control section. Fatmata Bangura en di AI Quality Copilot de measure di water pH, volume wey enter di bottle, en cap tightness so dat no dirty water or leak go go na market.`;
        case 'ai':
          return `Dis na di AI Quality Hub. Di Isolation Forest en Random Forest model dem de check multivariate sensor data under five millisecond. You fit slide di pH en volume slider dem for see how di AI de flag chemical anomaly fast fast.`;
        case 'inventory':
          return `Dis na di Warehouse en Inventory control. Mohamed Turay de track all finished goods dem inside Kissy Central Depot en Lumley hub. All product dem certified by Sierra Leone Standards Bureau.`;
        case 'distribution':
          return `Dis na di Fleet Distribution side. Alhaji Conteh de dispatch di delivery truck dem go customer dem na Freetown, Bo, Kenema, en Makeni.`;
        case 'tracking':
          return `Dis na di QR Batch Tracking Passport. You go see di whole waka of di bottle from raw water filtration tey e reach customer hand na store.`;
        case 'public-track':
          return `Dis na di Public SLSB Verification Portal. Anybody wey buy bottle with smartphone fit scan am to see if na original Salone drink or fake product.`;
        case 'admin':
          return `Dis na di Admin Governance Center. Mariama Sesay fit add new staff user, emergency-abort bad batch, or delete case record dem with full audit security.`;
        case 'reports':
          return `Dis na di SLSB Compliance en Audit Reports. You fit print or download PDF document dem for Sierra Leone Standards Bureau inspection.`;
        default:
          return `Kusheh! Welcome to BeverageTrack AI, di modern tracking system for beverage bottling companies na Freetown, Sierra Leone.`;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return `You are on the Executive Management Dashboard. Today's bottling production output is ${totalProduced} bottles with a quality pass rate of ${passRate} percent. Available inventory is ${totalStock} bottles. There is currently ${anomalies} active AI anomaly alert under review.`;
        case 'production':
          return `You are in the Production and Batch Management Module. Here you can register new batches, view active bottling runs on Line 1 and Line 2, and monitor preform blowing status at the Kissy facility.`;
        case 'quality':
          return `You are in the Quality Assurance and Inspection Module. Laboratory parameters include pH level, volumetric filling, and cap seal torque. The AI Quality Copilot is active to flag chemical contamination or leaks before batch release.`;
        case 'ai':
          return `You are in the AI Quality Intelligence Hub. Machine learning models Isolation Forest and Random Forest are analyzing multivariate sensor data. You can test live sliders for pH, volume, and torque with instant real-time anomaly detection.`;
        case 'inventory':
          return `You are in the Warehouse and Inventory Control Module. Tracking finished stock across Kissy Central Warehouse and Lumley Depot. Current capacity occupancy is nominal and SLSB certified.`;
        case 'distribution':
          return `You are in the Fleet Distribution and Logistics Module. Tracking deliveries to Freetown wholesale distributors, Kenema, and Bo routes.`;
        case 'tracking':
          return `You are on the QR Code Batch Traceability System. You can view the complete immutable lifecycle from raw water treatment to supermarket delivery.`;
        case 'public-track':
          return `You are in the Public Bottle Verification Portal. Consumers and retailers can verify batch authenticity and compliance with Sierra Leone Standards Bureau specifications.`;
        case 'admin':
          return `You are in the Admin Management Console. As an administrator, you can manage staff user credentials, add new users, monitor quality incident cases, abort compromised batches, and manage system records.`;
        case 'reports':
          return `You are in the Reports and SLSB Compliance Module. Ready to generate and export regulatory compliance audits for Sierra Leone authorities.`;
        default:
          return `You are viewing BeverageTrack AI, the intelligent quality tracking system for Sierra Leone bottling companies.`;
      }
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
      setSpokenSubtitle(null);
    }
  };

  if (!speechSupported) return null;

  return (
    <div className="relative">
      {/* Audio Button & Language Indicator */}
      <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 p-1 rounded-xl transition shadow-sm">
        {/* Main Speak Button */}
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
          title={isSpeaking ? 'Click to stop reading' : `Click to hear page summary in ${language === 'krio' ? 'Sierra Leone Krio' : 'English'}`}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Voice</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'krio' ? '🇸🇱 Krio Voice' : '🇬🇧 Voice Read'}</span>
            </>
          )}
        </button>

        {/* Quick Language Toggle Pill */}
        <button
          type="button"
          onClick={() => {
            const nextLang = language === 'krio' ? 'english' : 'krio';
            setLanguage(nextLang);
            if (isSpeaking) handleStopSpeaking();
          }}
          className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition"
          title="Switch between Sierra Leone Krio and English voice"
        >
          {language === 'krio' ? 'Krio' : 'Eng'}
        </button>

        {/* Voice Menu Options Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className={`p-1.5 rounded-lg text-xs transition ${
            isOpenMenu ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Voice Reader Settings (Language, Hover reading)"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Voice Assistant Controls Flyout */}
      {isOpenMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-left animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>AI Audio Voice Assistant</span>
            </div>
            {isSpeaking && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                Talking...
              </span>
            )}
          </div>

          {/* Language Selector */}
          <div className="mb-3">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Voice Language:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setLanguage('krio')}
                className={`p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between border ${
                  language === 'krio'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🇸🇱</span>
                  <span>Salone Krio</span>
                </div>
                {language === 'krio' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setLanguage('english')}
                className={`p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between border ${
                  language === 'english'
                    ? 'bg-sky-50 border-sky-300 text-sky-900 ring-1 ring-sky-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🇬🇧</span>
                  <span>English</span>
                </div>
                {language === 'english' && <Check className="w-3.5 h-3.5 text-sky-600" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                handleReadActivePage();
                setIsOpenMenu(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold text-left transition flex items-center justify-between shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'krio' ? 'Talk Dis Page Na Krio' : 'Read Page Summary'}</span>
              </span>
              <span className="text-[10px] font-mono bg-sky-800/60 px-1.5 py-0.5 rounded text-sky-200">
                {language === 'krio' ? 'Salone' : 'Standard'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !hoverReadMode;
                setHoverReadMode(next);
                if (next) {
                  speakText(language === 'krio' ? 'Hover read mode don on. Put yu mouse pan any button for hear wetin e de do.' : 'Hover read mode activated. Move cursor over any button to hear it.');
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
                <span>{language === 'krio' ? 'Touch Button Mek E Talk' : 'Hover to Read Buttons'}</span>
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

      {/* Floating Audio Subtitle Banner when Speaking */}
      {isSpeaking && spokenSubtitle && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-xl w-full px-4 animate-bounce">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-sky-500/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1 truncate">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-0.5">
                <span>{language === 'krio' ? '🇸🇱 Salone Krio Audio' : '🇬🇧 English Audio'}</span>
                <span>• Live Narration</span>
              </div>
              <p className="text-xs text-slate-200 truncate font-medium">
                "{spokenSubtitle}"
              </p>
            </div>
            <button
              onClick={handleStopSpeaking}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Stop voice"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
