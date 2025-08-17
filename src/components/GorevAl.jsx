import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function GorevAl() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskArea, setTaskArea] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const isProfileComplete = () => {
    if (!profile) return false;
    return (
      profile.firstName?.trim() &&
      profile.lastName?.trim() &&
      profile.email?.trim() &&
      profile.phone?.trim() &&
      profile.city?.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskArea) {
      setMessage("Lütfen görev alanınızı seçin.");
      return;
    }
    if (!isProfileComplete()) {
      setMessage("Profil bilgilerinizi güncelleyin lütfen.");
      return;
    }
    setMessage("");

    try {
      await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        taskArea,
        createdAt: serverTimestamp(),
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        city: profile.city,
        photoURL: profile.photoURL || "",
      });
      alert("Görev tercihiniz kaydedildi!");
      navigate("/profile");
    } catch (error) {
      console.error("Görev kaydetme hatası:", error);
      setMessage("Görev kaydedilirken hata oluştu.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-10">Yükleniyor...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded text-center">
        <p>Lütfen önce giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col">
        <div className="flex items-center gap-2 p-6 border-b">
          <img src="/connectexpatlogo-1.png" alt="logo" className="h-10" />
          <span className="text-xl font-bold text-black">ConnectExpats</span>
        </div>
        <nav className="flex flex-col p-4 gap-3 flex-grow">
          <button
            onClick={() => navigate("/profile")}
            className="mt-6 inline-block border border-yellow-500 text-yellow-500 px-6 py-3 rounded hover:bg-yellow-500 hover:text-white transition"
          >
            Profil
          </button>
          <button
            onClick={() => navigate("/password-update")}
            className="mt-6 inline-block border border-yellow-500 text-yellow-500 px-6 py-3 rounded hover:bg-yellow-500 hover:text-white transition"
          >
            Şifre Güncelle
          </button>
          <button
            onClick={() => navigate("/search-members")}
            className="mt-6 inline-block border border-yellow-500 text-yellow-500 px-6 py-3 rounded hover:bg-yellow-500 hover:text-white transition"
          >
            Üye Arama
          </button>
          <button
            onClick={() => navigate("/gorev-al")}
            className="mt-6 inline-block border border-yellow-500 text-yellow-500 px-6 py-3 rounded hover:bg-yellow-500 hover:text-white transition"
          >
            Görev Al
          </button>
          <button
            onClick={handleLogout}
            className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition"
          >
            Çıkış Yap
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
        {!isProfileComplete() ? (
          <div className="text-red-600 font-semibold text-center mb-6">
            Profil sayfanızda bazı zorunlu bilgiler eksik. Lütfen{" "}
            <button
              onClick={() => navigate("/profile")}
              className="underline text-blue-600"
            >
              profil sayfanızı güncelleyin
            </button>
            .
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Görev Al</h2>

            <div className="flex flex-col items-center mb-6">
              <img
                src={profile.photoURL || "/default-avatar.png"}
                alt="Profil Fotoğrafı"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <p className="font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.phone}</p>
              <p className="text-gray-600">{profile.city}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-64 mx-auto">
              <label className="block font-semibold">
                Görev Alanı Seçiniz:
                <select
                  value={taskArea}
                  onChange={(e) => setTaskArea(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1 h-12"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="is-gelistirme">İş Geliştirme</option>
                  <option value="halkla-iliskiler">Halkla İlişkiler</option>
                  <option value="basin-yayin">Basın ve Yayın</option>
                  <option value="organizasyon">Organizasyon</option>
                  <option value="sosyal-medya">Sosyal Medya Yönetimi</option>
                </select>
              </label>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 transition h-12"
              >
                Görev Al
              </button>
            </form>

            {message && (
              <p className="mt-4 text-red-600 text-center">{message}</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
