"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    attendee?: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("tickex_token");
    const userStr = localStorage.getItem("tickex_user");
    if (!token || !userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "ORGANIZER" && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
    if (!eventId) {
      alert("No event ID provided for scanning!");
      router.push("/dashboard");
    }
  }, [router, eventId]);

  const handleScan = async (result: any) => {
    if (!result || !result[0] || !result[0].rawValue) return;
    if (loading || !scanning) return;
    
    const qrCode = result[0].rawValue;
    setScanning(false);
    setLoading(true);

    const token = localStorage.getItem("tickex_token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/tickets/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ qrCode, eventId })
      });

      const data = await response.json();
      
      if (response.ok) {
        setScanResult({
          success: true,
          message: "Ticket Validated",
          attendee: data.attendee
        });
      } else {
        setScanResult({
          success: false,
          message: data.message || "Invalid Ticket"
        });
      }
    } catch (err: any) {
      setScanResult({
        success: false,
        message: "Error connecting to server"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setScanResult(null);
    setScanning(true);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col relative overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-slate-800 z-10 relative bg-[#030014]">
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="font-bold">Scanner</h1>
        <div className="w-16"></div>
      </header>

      <main className="flex-1 flex flex-col relative">
        {scanResult && (
          <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300 ${
            scanResult.success ? "bg-green-600" : "bg-red-600"
          }`}>
            {scanResult.success ? (
              <CheckCircle className="w-32 h-32 text-white mb-6 drop-shadow-lg" />
            ) : (
              <XCircle className="w-32 h-32 text-white mb-6 drop-shadow-lg" />
            )}
            
            <h2 className="text-4xl font-extrabold text-white mb-2 text-center drop-shadow-md">
              {scanResult.success ? "VALID ENTRY" : "INVALID"}
            </h2>
            
            <p className="text-white/90 text-lg mb-8 font-medium text-center">
              {scanResult.message}
              {scanResult.attendee && <><br/><span className="text-2xl font-bold mt-2 block text-white">{scanResult.attendee}</span></>}
            </p>

            <button 
              onClick={handleContinue}
              className="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Scan Next Ticket
            </button>
          </div>
        )}

        <div className="flex-1 relative bg-black flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 z-40 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="font-bold text-lg animate-pulse">Verifying...</p>
            </div>
          )}

          {scanning && (
            <div className="w-full max-w-md mx-auto aspect-square relative z-10 p-4">
              <div className="absolute inset-0 border-2 border-orange-500/50 rounded-3xl z-20 pointer-events-none mx-4 my-4">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-3xl"></div>
              </div>
              <Scanner 
                onScan={handleScan}
                formats={["qr_code"]}
                components={{
                  tracker: true,
                  audio: false,
                }}
              />
            </div>
          )}
        </div>
        
        <div className="bg-[#030014] p-6 text-center z-10 relative">
          <p className="text-slate-400 font-medium">
            Position the QR code inside the frame to scan automatically
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ScanTicketPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}
