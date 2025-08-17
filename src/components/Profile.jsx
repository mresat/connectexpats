import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const germanyCities = [
  "Berlin",
  "Hamburg",
  "München",
  "Köln",
  "Frankfurt am Main",
  "Stuttgart",
  "Düsseldorf",
  "Dortmund",
  "Essen",
  "Leipzig",
  "Bremen",
  "Dresden",
  "Hannover",
  "Nürnberg",
  "Duisburg",
  "Bochum",
  "Wuppertal",
  "Bielefeld",
  "Bonn",
  "Mannheim",
];

export default function Profile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.phone || "");
          setUserType(data.userType || "");
          setCity(data.city || "");
          setCompany(data.company || "");
          setPosition(data.position || "");
          setSchool(data.school || "");
          setDegree(data.degree || "");
          setLinkedin(data.linkedin || "");
          setInstagram(data.instagram || "");
        } else {
          setFirstName(user.displayName ? user.displayName.split(" ")[0] : "");
          setLastName(
            user.displayName ? user.displayName.split(" ")[1] || "" : ""
          );
        }
      } catch (error) {
        console.error("Profil yüklenirken hata:", error);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Kullanıcı bulunamadı, lütfen tekrar giriş yapın.");
      return;
    }

    try {
      await updateProfile(user, { displayName: firstName + " " + lastName });

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phone,
        userType,
        city,
        company: userType === "calisan" ? company : "",
        position: userType === "calisan" ? position : "",
        school: userType === "ogrenci" ? school : "",
        degree: userType === "ogrenci" ? degree : "",
        linkedin,
        instagram,
        email: user.email,
        role,
      });

      setMessage("Profil bilgileri başarıyla kaydedildi.");
    } catch (error) {
      setMessage("Profil kaydedilirken hata oluştu: " + error.message);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded text-center">
        <p>Giriş yapmadınız. Lütfen giriş yapın.</p>
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
          Profil Sayfası
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Ad</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Soyad</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Telefon Numarası
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Şehir</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Şehir seçiniz</option>
                {germanyCities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Kullanıcı Türü</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Seçiniz</option>
                <option value="calisan">Çalışan</option>
                <option value="ogrenci">Öğrenci</option>
                <option value="isarayan">İş Arayan</option>
                <option value="diger">Diğer</option>
              </select>
            </div>

            {userType === "calisan" && (
              <>
                <div>
                  <label className="block font-semibold mb-1">Şirket</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pozisyon</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </>
            )}

            {userType === "ogrenci" && (
              <>
                <div>
                  <label className="block font-semibold mb-1">Okul</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bölüm</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold mb-1">LinkedIn</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Instagram</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://www.instagram.com/username"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {message && (
            <p
              className={`text-center font-semibold ${
                message === "Profil bilgileri başarıyla kaydedildi."
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded mt-4 transition"
          >
            Kaydet
          </button>
        </form>
      </main>
    </div>
  );
}
