import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Command,
  ArrowRight,
  LogOut,
  Factory,
  Droplets,
  ShieldCheck,
  BrainCircuit,
  Boxes,
  Truck,
  QrCode,
  Smartphone,
  X,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface AIVoiceCommanderProps {
  onNavigate: (tabId: string) => void;
  onLogout: () => void;
  onOpenScanner?: () => void;
  activeTab?: string;
}

export const AIVoiceCommander: React.FC<AIVoiceCommanderProps> = ({
  onNavigate,
  onLogout,
  onOpenScanner,
  activeTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [language, setLanguage] = useState<'krio' | 'english'>('krio');
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis || null;

      // Check browser speech recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          const cleaned = currentTranscript.trim().toLowerCase();
          setTranscript(cleaned);
          processVoiceCommand(cleaned);
        };

        recognition.onerror = (err: any) => {
          console.warn('Voice recognition error:', err);
          if (err.error !== 'no-speech') {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          // Restart if user still has overlay active
          if (isListening) {
            try {
              recognition.start();
            } catch (_) {}
          }
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [isListening, language]);

  const speakFeedback = (textEnglish: string, textKrio: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const spoken = language === 'krio' ? textKrio : textEnglish;
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.rate = language === 'krio' ? 0.95 : 1.0;
    utterance.pitch = language === 'krio' ? 1.05 : 1.0;

    synthRef.current.speak(utterance);
  };

  const processVoiceCommand = (rawText: string) => {
    if (!rawText) return;
    const text = rawText.toLowerCase();

    // 1. LOGOUT / EXIT / LOGIN PAGE COMMANDS
    if (
      text.includes('logout') ||
      text.includes('log out') ||
      text.includes('exit') ||
      text.includes('sign out') ||
      text.includes('take me to login') ||
      text.includes('login page') ||
      text.includes('lock out') ||
      text.includes('go na login')
    ) {
      setLastAction('Logging out... Taking you to login page.');
      speakFeedback(
        'Logging out now. Taking you to login page.',
        'A dey lock out naw. Mek we go bak na login page.'
      );
      setTimeout(() => {
        onLogout();
      }, 1000);
      return;
    }

    // 2. WATER SOURCING & INTAKE (STEP 1)
    if (
      text.includes('water') ||
      text.includes('wata') ||
      text.includes('intake') ||
      text.includes('borehole') ||
      text.includes('sourcing') ||
      text.includes('create water')
    ) {
      setLastAction('Navigating to Water Intake & RO Plant.');
      speakFeedback(
        'Opening Water Intake and Reverse Osmosis page.',
        'A dey open di Water Intake en Reverse Osmosis page naw naw.'
      );
      onNavigate('water');
      return;
    }

    // 3. PRODUCTION PAGE
    if (
      text.includes('production') ||
      text.includes('open production') ||
      text.includes('production page') ||
      text.includes('bottling line') ||
      text.includes('factory line')
    ) {
      setLastAction('Opening Production Floor & Batch Management.');
      speakFeedback(
        'Opening Production and Bottling Line page.',
        'A dey open di Production line for see all di batch dem.'
      );
      onNavigate('production');
      return;
    }

    // 4. QUALITY CONTROL
    if (
      text.includes('quality') ||
      text.includes('qc') ||
      text.includes('inspection') ||
      text.includes('laboratory') ||
      text.includes('slsb')
    ) {
      setLastAction('Opening Quality Control & Assurance.');
      speakFeedback(
        'Opening Quality Control and Inspection records.',
        'A dey open Quality Control for check pH en bottle inspection.'
      );
      onNavigate('quality');
      return;
    }

    // 5. AI QUALITY HUB
    if (
      text.includes('ai') ||
      text.includes('anomaly') ||
      text.includes('model') ||
      text.includes('prediction') ||
      text.includes('machine learning')
    ) {
      setLastAction('Opening AI Quality & Anomaly Intelligence Hub.');
      speakFeedback(
        'Opening AI Quality Hub and Anomaly models.',
        'A dey open di AI Quality Hub for run Isolation Forest model.'
      );
      onNavigate('ai');
      return;
    }

    // 6. INVENTORY / WAREHOUSE
    if (
      text.includes('inventory') ||
      text.includes('warehouse') ||
      text.includes('stock') ||
      text.includes('storage')
    ) {
      setLastAction('Opening Warehouse & Inventory Control.');
      speakFeedback(
        'Opening Warehouse Inventory and finished goods.',
        'A dey open di Warehouse for check available bottle stock.'
      );
      onNavigate('inventory');
      return;
    }

    // 7. DISTRIBUTION / FLEET
    if (
      text.includes('distribution') ||
      text.includes('dispatch') ||
      text.includes('fleet') ||
      text.includes('delivery') ||
      text.includes('orders')
    ) {
      setLastAction('Opening Distribution & Fleet Logistics.');
      speakFeedback(
        'Opening Distribution and vehicle delivery routes.',
        'A dey open Distribution for see all motor truck dispatch.'
      );
      onNavigate('distribution');
      return;
    }

    // 8. BATCH TRACKING & QR
    if (
      text.includes('tracking') ||
      text.includes('trace') ||
      text.includes('history') ||
      text.includes('passport')
    ) {
      setLastAction('Opening Batch Traceability & Lifecycle.');
      speakFeedback(
        'Opening Batch Traceability and QR history.',
        'A dey open Batch Tracking for see full factory timeline.'
      );
      onNavigate('tracking');
      return;
    }

    // 9. MOBILE QR SCANNER
    if (
      text.includes('scanner') ||
      text.includes('scan qr') ||
      text.includes('camera') ||
      text.includes('mobile scan')
    ) {
      setLastAction('Launching Mobile Camera QR Scanner.');
      speakFeedback(
        'Opening mobile camera scanner.',
        'A dey open camera for scan bottle QR code.'
      );
      if (onOpenScanner) onOpenScanner();
      return;
    }

    // 10. ADMIN CONSOLE
    if (
      text.includes('admin') ||
      text.includes('governance') ||
      text.includes('users') ||
      text.includes('security')
    ) {
      setLastAction('Opening Admin Governance Console.');
      speakFeedback(
        'Opening Admin Governance Console.',
        'A dey open Admin Console for manage users en system security.'
      );
      onNavigate('admin');
      return;
    }

    // 11. REPORTS
    if (text.includes('report') || text.includes('audit') || text.includes('log')) {
      setLastAction('Opening Compliance & Audit Reports.');
      speakFeedback(
        'Opening Reports and audit logs.',
        'A dey open audit report dem.'
      );
      onNavigate('reports');
      return;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. You can click any voice command button below to execute instantly!');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('Listening... Speak now.');
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    }
  };

  const executeManualCommand = (commandPhrase: string) => {
    setTranscript(commandPhrase);
    processVoiceCommand(commandPhrase);
  };

  return (
    <>
      {/* Floating Futuristic AI Voice Command HUD Pill (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && !isListening) {
              toggleListening();
            }
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-bold text-xs shadow-2xl transition-all duration-300 border ${
            isOpen || isListening
              ? 'bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white border-sky-400 ring-4 ring-sky-500/30 shadow-sky-900/50 scale-105'
              : 'bg-slate-900/90 hover:bg-slate-900 text-white border-slate-700 hover:border-sky-500 hover:scale-102 backdrop-blur-md'
          }`}
          title="Open AI Voice Command Overlay"
        >
          <div className="relative">
            <Mic className={`w-4 h-4 ${isListening ? 'text-rose-400 animate-pulse' : 'text-sky-400'}`} />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </div>
          <span>AI Voice Copilot</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-extrabold border border-sky-400/30">
            {language === 'krio' ? '🇸🇱 Krio' : '🇬🇧 EN'}
          </span>
        </button>
      </div>

      {/* Full AI Voice Command Overlay Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-700 shadow-2xl text-white relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-900/40">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                    AI Voice Command Overlay
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      Live Assistant
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Speak commands to navigate pages, open scanner, or logout</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(language === 'krio' ? 'english' : 'krio')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-slate-200 transition flex items-center gap-1.5"
                  title="Switch between Salone Krio and English feedback"
                >
                  <span>{language === 'krio' ? '🇸🇱 Salone Krio' : '🇬🇧 English'}</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Listening & Soundwave Animation */}
            <div className="py-6 flex flex-col items-center justify-center text-center relative z-10">
              <div className="relative mb-4">
                <button
                  onClick={toggleListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/60 ring-8 ring-rose-500/20 animate-pulse'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-900/60 ring-8 ring-sky-500/20'
                  }`}
                  title={isListening ? 'Click to stop listening' : 'Click to start listening'}
                >
                  {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                </button>
              </div>

              {/* Dynamic Soundwave Bars */}
              {isListening && (
                <div className="flex items-center gap-1 my-2">
                  <span className="w-1 bg-sky-400 rounded-full animate-bounce h-4"></span>
                  <span className="w-1 bg-sky-400 rounded-full animate-bounce h-7" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1 bg-sky-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1 bg-sky-400 rounded-full animate-bounce h-8" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-1 bg-sky-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.15s' }}></span>
                </div>
              )}

              <p className="text-xs font-bold text-slate-300">
                {isListening ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Listening for voice command... (Speak now)
                  </span>
                ) : (
                  <span className="text-slate-400">Microphone paused. Click mic to speak or click quick commands below.</span>
                )}
              </p>

              {/* Transcript Display Box */}
              <div className="mt-3 px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-sky-300 max-w-md w-full truncate">
                <span className="text-slate-500 mr-2">Heard:</span>
                <span className="font-bold">{transcript || 'Say "Now open production page" or "Logout"...'}</span>
              </div>

              {/* Last Action Confirmation Badge */}
              {lastAction && (
                <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded-full animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lastAction}</span>
                </div>
              )}
            </div>

            {/* Quick Clickable Voice Commands Grid (Execute & Test Instantly) */}
            <div className="pt-3 border-t border-slate-800 relative z-10">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5 text-sky-400" />
                Supported Voice Commands (Tap to execute or speak aloud):
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => executeManualCommand('now open production page')}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Factory className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-white text-[11px] truncate">"Now open production page"</p>
                      <p className="text-[10px] text-slate-400">Go to Bottling line</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                </button>

                <button
                  onClick={() => executeManualCommand('open water page')}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Droplets className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-white text-[11px] truncate">"Open water page"</p>
                      <p className="text-[10px] text-slate-400">Stage 1: RO Intake</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                </button>

                <button
                  onClick={() => executeManualCommand('open quality control')}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-white text-[11px] truncate">"Open quality control"</p>
                      <p className="text-[10px] text-slate-400">pH, Torque, Lab</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                </button>

                <button
                  onClick={() => executeManualCommand('open ai quality')}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <BrainCircuit className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-white text-[11px] truncate">"Open AI quality hub"</p>
                      <p className="text-[10px] text-slate-400">Anomaly intelligence</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                </button>

                <button
                  onClick={() => executeManualCommand('open camera scanner')}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Smartphone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-white text-[11px] truncate">"Open camera scanner"</p>
                      <p className="text-[10px] text-slate-400">Scan mobile QR</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                </button>

                {/* LOGOUT / EXIT COMMAND */}
                <button
                  onClick={() => executeManualCommand('now take me to login page logout')}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 hover:border-rose-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <LogOut className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-rose-300 text-[11px] truncate">"Logout / Exit"</p>
                      <p className="text-[10px] text-rose-400/80">"Take me to login page"</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Sierra Leone Web Speech AI Engine Active
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                Close Overlay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
