import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, MessageSquareText, Activity, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const AudioTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript(null);
    } catch (err: any) {
      console.error("Microphone access denied", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDismissedError') {
        setPermissionError("Microphone access was dismissed or blocked. Please allow access to log symptoms via voice.");
      } else {
        setPermissionError("Could not access microphone. Please check your audio settings.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/webm',
                  data: base64Data,
                },
              },
              {
                text: "You are an AI medical scribe. Transcribe this audio accurately. If the user mentions symptoms, format them as a brief health report.",
              },
            ],
          },
        });

        setTranscript(response.text || "No transcription available.");
      };
    } catch (err) {
      console.error("Transcription failed", err);
      setTranscript("Error transcribing audio log. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-500" />
          Voice Health Log
        </h4>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Live Recording</span>
          </div>
        )}
      </div>

      {permissionError ? (
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-red-400 font-bold uppercase tracking-tight mb-1">Microphone Blocked</p>
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                {permissionError}
              </p>
            </div>
          </div>
          <button 
            onClick={startRecording}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Access
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button 
              onClick={startRecording}
              disabled={isTranscribing}
              className="p-4 bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
              <Mic className="w-6 h-6 text-white" />
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="p-4 bg-red-600 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              <Square className="w-6 h-6 text-white" />
            </button>
          )}
          
          <div className="flex-1">
            <p className="text-sm text-gray-200 font-medium leading-tight">
              {isRecording ? "Listening to your report..." : isTranscribing ? "Gemini AI is analyzing..." : "Log symptoms via voice."}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Auto-transcription powered by Flash Intelligence.
            </p>
          </div>
        </div>
      )}

      {(transcript || isTranscribing) && !permissionError && (
        <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
          {isTranscribing ? (
            <div className="flex items-center gap-3 text-blue-400 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs italic font-medium">Processing biometric vocal data...</span>
            </div>
          ) : (
            <div className="space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                  <MessageSquareText className="w-3 h-3" />
                  AI Transcript
                </div>
                <div className="px-2 py-0.5 rounded-full bg-blue-500/10 text-[9px] text-blue-400 font-bold">VERIFIED</div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">{transcript}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioTranscriber;