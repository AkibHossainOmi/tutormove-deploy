import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { tutorAPI, creditAPI } from "../utils/apiService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TutorProfilePage() {
  const { tutorId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Gift Coin Modal State
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftError, setGiftError] = useState("");
  const [giftSuccess, setGiftSuccess] = useState("");
  const [userBalance, setUserBalance] = useState(0);

  // Fetch user's current balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await creditAPI.getCreditBalance();
        setUserBalance(res.data?.balance || 0);
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };
    fetchBalance();
  }, []);

  const handleGiftCoins = async () => {
    const amount = parseInt(giftAmount);
    if (!amount || amount <= 0) {
      setGiftError("Please enter a valid amount");
      return;
    }
    if (amount > userBalance) {
      setGiftError("Insufficient balance");
      return;
    }

    setGiftLoading(true);
    setGiftError("");
    setGiftSuccess("");

    try {
      const res = await creditAPI.giftCoins(tutorId, amount);
      setGiftSuccess(`Successfully sent ${amount} coins to ${profile.username}!`);
      setUserBalance(res.data.new_balance);
      setGiftAmount("");
      setTimeout(() => {
        setShowGiftModal(false);
        setGiftSuccess("");
      }, 2000);
    } catch (err) {
      setGiftError(err.response?.data?.error || "Failed to send coins");
    } finally {
      setGiftLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const profileData = await tutorAPI.getTutorProfile(tutorId);
        setProfile(profileData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tutorId]);

  if (loading) return <div className="p-6 text-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-6 text-center text-red-600 font-semibold">{error}</div>;
  if (!profile) return null;

  const isStudent = JSON.parse(localStorage.getItem("user"))?.user_type === "student";

  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-20 bg-gradient-to-b from-indigo-50 via-white to-gray-50 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side - Tutor Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-indigo-600 text-white text-4xl font-bold flex items-center justify-center">
                {profile.username?.charAt(0).toUpperCase() || "T"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
                <p className="text-gray-600">{profile.location || "Location not specified"}</p>
                {profile.is_verified && (
                  <span className="inline-block mt-2 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    ✅ Verified
                  </span>
                )}
              </div>
            </div>

            <Card title="Bio">
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio || "No bio available."}</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Education">
                <p className="text-gray-700">{profile.education || "Not specified"}</p>
              </Card>
              <Card title="Experience">
                <p className="text-gray-700">{profile.experience || "Not specified"}</p>
              </Card>
            </div>

            <Card title="Subjects">
              {profile.subjects?.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {profile.subjects.map((subj, i) => (
                    <li key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {subj}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No subjects listed.</p>
              )}
            </Card>

            <Card title="Gigs">
              {profile.gigs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.gigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="p-4 border rounded-xl bg-white shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                    >
                      <h4 className="font-semibold text-indigo-700">{gig.title}</h4>
                      <p className="text-gray-700">{gig.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Subject: {gig.subject}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No gigs listed.</p>
              )}
            </Card>
          </div>

          {/* Right Side - Contact + Message */}
          <aside className="space-y-6">
            <Card title="Contact Info">
              {profile.email || profile.phone_number ? (
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-medium">Email:</span> {profile.email || "Hidden"}</li>
                  <li><span className="font-medium">WhatsApp:</span> {profile.phone_number || "Hidden"}</li>
                </ul>
              ) : (
                <p className="text-gray-500 italic">Contact not available</p>
              )}
            </Card>

            {isStudent && profile.unlocked && (
              <button
                onClick={() => navigate(`/messages/?username=${encodeURIComponent(profile.username)}`)}
                className="w-full inline-flex justify-center items-center px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all"
              >
                Message Tutor
              </button>
            )}

            {/* Gift Coins Button - Only for students */}
            {isStudent && (
              <button
                onClick={() => setShowGiftModal(true)}
                className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-md transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                  <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                </svg>
                Gift Coins
              </button>
            )}
          </aside>
        </div>
      </main>

      {/* Gift Coins Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                  </svg>
                  Gift Coins
                </h3>
                <button
                  onClick={() => {
                    setShowGiftModal(false);
                    setGiftError("");
                    setGiftSuccess("");
                    setGiftAmount("");
                  }}
                  className="text-white/80 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Send coins to <span className="font-semibold text-gray-900">{profile?.username}</span> as a gift.
              </p>

              {/* Balance Display */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Balance</span>
                  <span className="text-xl font-bold text-indigo-600">{userBalance} coins</span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Gift
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={userBalance}
                    value={giftAmount}
                    onChange={(e) => {
                      setGiftAmount(e.target.value);
                      setGiftError("");
                    }}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-amber-100 focus:border-amber-500 outline-none transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">coins</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mb-4">
                {[5, 10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setGiftAmount(String(Math.min(amt, userBalance)))}
                    disabled={amt > userBalance}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      amt > userBalance
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {giftError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {giftError}
                </div>
              )}

              {/* Success Message */}
              {giftSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {giftSuccess}
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleGiftCoins}
                disabled={giftLoading || !giftAmount || giftSuccess}
                className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                  giftLoading || !giftAmount || giftSuccess
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg"
                }`}
              >
                {giftLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  `Send ${giftAmount || 0} Coins`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}
