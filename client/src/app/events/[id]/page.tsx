"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Tag, User, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import Image from "next/image";

type EventType = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  price: number;
  image: string;
  organizer?: { name: string };
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Checkout State
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [purchasedTicketId, setPurchasedTicketId] = useState<string | null>(null);
  const [purchasedTicket, setPurchasedTicket] = useState<any>(null);

  // Load Paystack Script on component mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        } else if (res.status === 404) {
          setError("Event not found");
        } else {
          setError("Failed to load event details");
        }
      } catch (err) {
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Fetch existing ticket if already purchased
  useEffect(() => {
    if (!id) return;
    const fetchExistingTicket = async () => {
      const token = localStorage.getItem("tickex_token");
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/tickets/my-tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const tickets = await res.json();
          const existing = tickets.find((t: any) => t.eventId === id);
          if (existing) {
            setPurchasedTicket(existing);
            setPurchasedTicketId(existing.id);
          }
        }
      } catch (err) {
        console.error("Error checking existing tickets:", err);
      }
    };
    fetchExistingTicket();
  }, [id]);

  const handleBuyClick = () => {
    const token = localStorage.getItem("tickex_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setShowCheckout(true);
  };

  const handleConfirmPayment = async () => {
    setPaymentStatus("processing");
    setCheckoutError(null);

    const token = localStorage.getItem("tickex_token");
    const userStr = localStorage.getItem("tickex_user");
    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(userStr);

    // If event is free, directly create the ticket (no gateway popup needed)
    if (event?.price === 0) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/tickets/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event.id }),
        });

        if (res.ok) {
          const ticketData = await res.json();
          setPurchasedTicket(ticketData);
          setPurchasedTicketId(ticketData.id);
          setPaymentStatus("success");
        } else {
          const data = await res.json();
          setCheckoutError(data.message || "Failed to create free ticket");
          setPaymentStatus("idle");
        }
      } catch (err) {
        setCheckoutError("Network error during free checkout");
        setPaymentStatus("idle");
      }
      return;
    }

    // Trigger Paystack inline checkout for paid events
    if (typeof window !== "undefined" && (window as any).PaystackPop) {
      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_a6cb93e6dc982c7a7a6de65cfd2d14210e75a0dc";
      
      try {
        const handler = (window as any).PaystackPop.setup({
          key: paystackPublicKey,
          email: currentUser.email,
          amount: event ? event.price * 100 : 0, // Paystack amount is in pesewas/kobo
          currency: "GHS",
          callback: function (response: any) {
            // Payment succeeded: now verify on backend and create ticket
            setPaymentStatus("processing");
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/tickets/purchase`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                eventId: event?.id,
                reference: response.reference,
              }),
            })
              .then(async (res) => {
                if (res.ok) {
                  res.json().then((ticketData) => {
                    setPurchasedTicket(ticketData);
                    setPurchasedTicketId(ticketData.id);
                    setPaymentStatus("success");
                  });
                } else {
                  const data = await res.json();
                  setCheckoutError(data.message || "Payment verification failed");
                  setPaymentStatus("idle");
                }
              })
              .catch(() => {
                setCheckoutError("Verification network error");
                setPaymentStatus("idle");
              });
          },
          onClose: () => {
            setPaymentStatus("idle");
            setCheckoutError("Payment window closed");
          }
        });
        handler.openIframe();
      } catch (err: any) {
        setCheckoutError("Failed to initialize Paystack Pop: " + err.message);
        setPaymentStatus("idle");
      }
    } else {
      setCheckoutError("Payment SDK loading... Please wait a moment and try again.");
      setPaymentStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">
          {error || "Event not found"}
        </h1>
        <button
          onClick={() => router.push("/")}
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          &larr; Back to Events
        </button>
      </div>
    );
  }

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-24 relative">
      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm print:bg-transparent print:absolute print:inset-0">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 print:bg-transparent print:border-none print:shadow-none">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8 print:hidden">
                <h3 className="text-2xl font-bold text-white">Checkout</h3>
                {paymentStatus === "idle" && (
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Progress Stepper */}
              <div className="flex items-center justify-between mb-8 relative px-4 print:hidden">
                <div className="absolute top-3 left-8 right-8 h-1 bg-slate-800 -z-10 rounded-full"></div>
                <div 
                  className="absolute top-3 left-8 h-1 bg-indigo-500 -z-10 rounded-full transition-all duration-500" 
                  style={{ width: paymentStatus === 'success' ? 'calc(100% - 4rem)' : '0%' }}
                ></div>
                
                {/* Step 1: Details */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${paymentStatus === 'success' ? 'bg-indigo-500 border-none' : 'bg-slate-900 border-2 border-indigo-500'}`}>
                    {paymentStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${paymentStatus === 'success' ? 'text-slate-400' : 'text-indigo-400'}`}>
                    Details
                  </span>
                </div>

                {/* Step 2: Submitted */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-900 border-2 ${paymentStatus === 'success' ? 'border-indigo-500' : 'border-slate-700'}`}>
                    {paymentStatus === 'success' && (
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${paymentStatus === 'success' ? 'text-indigo-400' : 'text-slate-600'}`}>
                    Submitted
                  </span>
                </div>
              </div>

              {paymentStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <style>{`
                    @media print {
                      html, body {
                        background: white !important;
                        color: black !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                      }
                      #printable-ticket {
                        position: absolute !important;
                        top: 20px !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        width: 100% !important;
                        max-width: 340px !important;
                        border: 1px solid #e2e8f0 !important;
                        background: white !important;
                        color: black !important;
                        box-shadow: none !important;
                        padding: 20px !important;
                        border-radius: 16px !important;
                      }
                      #printable-ticket * {
                        color: black !important;
                      }
                      #printable-ticket span {
                        background: #f3f4f6 !important;
                        color: #1f2937 !important;
                        border: 1px solid #e5e7eb !important;
                      }
                    }
                  `}</style>

                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4 animate-in fade-in zoom-in print:hidden" />
                  <h4 className="text-xl font-bold text-white mb-2 print:hidden">Payment Successful!</h4>
                  <p className="text-slate-400 text-sm mb-6 print:hidden">Your ticket pass has been generated successfully.</p>

                  <div id="printable-ticket" className="bg-[#030014] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-auto flex flex-col items-center shadow-lg print:border-none print:shadow-none">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full">
                        Official Ticket Pass
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">{event?.title}</h4>
                    <p className="text-slate-400 text-xs mb-4">{formattedDate} @ {formattedTime}</p>
                    <p className="text-slate-400 text-xs mb-4 flex items-center gap-1 justify-center">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {event?.location}
                    </p>
                    
                    <div className="bg-white p-3 rounded-xl mb-4">
                      <img 
                        src={`https://chart.googleapis.com/chart?chs=180x180&cht=qr&chl=${encodeURIComponent(purchasedTicket?.qrCode || purchasedTicketId || "")}&choe=UTF-8`}
                        alt="Ticket QR Code"
                        className="w-40 h-40"
                      />
                    </div>
                    
                    <p className="text-slate-500 text-[10px] font-mono mb-1">TICKET ID</p>
                    <p className="text-white text-xs font-mono font-bold">{purchasedTicket?.id || purchasedTicketId}</p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full px-4 print:hidden">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                    >
                      Download Ticket (PDF)
                    </button>
                    <button
                      onClick={() => {
                        setShowCheckout(false);
                        router.push("/");
                      }}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl border border-white/10 text-sm transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-slate-950 p-4 rounded-2xl mb-6 print:hidden">
                    <p className="text-slate-400 text-sm mb-1">Order Summary</p>
                    <p className="text-white font-bold mb-4 line-clamp-1">{event.title}</p>
                    
                    <div className="flex justify-between items-center text-lg font-bold text-white border-t border-slate-800 pt-4">
                      <span>Total</span>
                      <span>{event.price === 0 ? "Free" : `GH₵ ${event.price.toLocaleString()}`}</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center print:hidden">
                      {checkoutError}
                    </div>
                  )}

                  <button
                    onClick={handleConfirmPayment}
                    disabled={paymentStatus === "processing"}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex justify-center items-center gap-2 print:hidden"
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Confirm & Pay
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="print:hidden">
        {/* Header / Back Button */}
        <div className="absolute top-0 left-0 w-full p-6 z-10 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 rounded-full text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <Image
          src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:px-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              {event.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
            <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-wrap">
              {event.description}
            </p>
          </section>

          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Organizer
            </h3>
            <p className="text-slate-300 font-medium text-lg">
              {event.organizer?.name || "Anonymous Organizer"}
            </p>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col gap-6">
            
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-950 rounded-xl">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{formattedDate}</p>
                  <p className="text-slate-400">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-950 rounded-xl">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Location</p>
                  <p className="text-slate-400">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-slate-400 mb-2">Ticket Price</p>
              <p className="text-4xl font-extrabold text-white">
                {event.price === 0 ? "Free" : `GH₵ ${event.price.toLocaleString()}`}
              </p>
            </div>

            {purchasedTicket ? (
              <button 
                onClick={() => {
                  setShowCheckout(true);
                  setPaymentStatus("success");
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                View Ticket Pass
              </button>
            ) : (
              <button 
                onClick={handleBuyClick}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Buy Ticket
              </button>
            )}
            
            <p className="text-xs text-center text-slate-500 mt-2">
              Secure payment processed via TickeX
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
