import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PasswordUpdate() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      // Giriş yapılmamışsa login sayfasına yönlendir
      navigate("/login");
    }
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (!user) {
      setError("Giriş yapılmamış.");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setMessage("Şifre başarıyla güncellendi.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Şifre güncelleme başarısız: " + err.message);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (!user) {
    return null; // kullanıcı useEffect ile login sayfasına yönlendirilecek
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
      <main className="flex-grow p-4 md:p-8 max-w-4xl sm:max-w-xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Şifre Güncelle</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="password"
            placeholder="Yeni Şifre"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Yeni Şifre (Tekrar)"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-3 rounded hover:bg-yellow-300 transition"
          >
            Güncelle
          </button>
        </form>
      </main>
    </div>
  );
}
