import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [humanAnswer, setHumanAnswer] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ip, setIp] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");

  const navigate = useNavigate();

  // Basit cihaz bilgisi
  useEffect(() => {
    setDeviceInfo(navigator.userAgent);
  }, []);

  // IP bilgisi çek
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp("unknown"));
  }, []);

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
  }, []);

  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Ban kontrolü
  const checkBan = async (email, ip, deviceInfo) => {
    try {
      const docRef = doc(db, "bannedUsers", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (
          data.email === email ||
          data.ip === ip ||
          data.deviceInfo === deviceInfo
        ) {
          return true; // banlı
        }
      }
      return false;
    } catch (err) {
      console.error("Ban kontrol hatası:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (parseInt(humanAnswer) !== num1 + num2) {
      setError("Lütfen matematik işlemini doğru yapın.");
      return;
    }

    setLoading(true);

    try {
      // Banlı mı kontrol et
      const isBanned = await checkBan(email, ip, deviceInfo);
      if (isBanned) {
        setError("Bu hesap/IP/cihaz sistemden yasaklanmıştır.");
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        setError(
          "E-posta adresiniz doğrulanmamış. Lütfen e-postanıza gelen doğrulama linkine tıklayın."
        );
        setLoading(false);
        return;
      }

      // Firestore'dan kullanıcı bilgilerini al
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Role kontrolü ile yönlendirme
        if (userData.role === "admin" || userData.role === "moderator") {
          navigate("/HeroPanel");
        } else {
          navigate("/profile");
        }
      } else {
        // Kullanıcı Firestore'da yoksa profile yönlendir
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Lütfen önce e-posta adresinizi girin.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError(
        "Eğer bu e-posta sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi."
      );
    } catch (err) {
      setError("Bir hata oluştu. Lütfen e-posta adresinizi kontrol edin.");
    }
  };

  return (
    <div className="text-gray-800 relative min-h-screen">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img src="/connectexpatlogo-1.png" alt="logo" className="h-12" />
            <span className="text-xl font-bold text-black">ConnectExpats</span>
          </div>
          <nav className="hidden md:flex gap-6 text-black">
            <a href="/" className="hover:underline">
              Anasayfa
            </a>
            <a href="/#about" className="hover:underline">
              Biz Kimiz
            </a>
            <a href="/#faq" className="hover:underline">
              SSS
            </a>
            <a href="/#contact" className="hover:underline">
              İletişim
            </a>
          </nav>
          <div className="flex gap-2">
            <Link
              to="/register"
              className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
            >
              Üye Ol
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4 text-center">Giriş Yap</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          {/* Matematik işlemi */}
          <div className="flex items-center gap-2">
            <label className="font-medium">
              Sonucu kaç: {num1} + {num2} = ?
            </label>
            <input
              type="number"
              value={humanAnswer}
              onChange={(e) => setHumanAnswer(e.target.value)}
              required
              className="w-20 px-2 py-1 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300"
          >
            {loading ? "Yükleniyor..." : "Giriş Yap"}
          </button>
        </form>

        <p
          onClick={handleForgotPassword}
          className="mt-4 text-center text-sm text-blue-600 hover:underline cursor-pointer"
        >
          Şifremi unuttum
        </p>

        <p className="mt-2 text-center text-sm">
          Hesabınız yok mu?{" "}
          <Link to="/register" className="text-yellow-500 hover:underline">
            Üye Ol
          </Link>
        </p>

        {/* Toast mesaj */}
        {showToast && (
          <div
            className="fixed bottom-6 right-6 bg-red-600 bg-opacity-90 text-white px-4 py-3 rounded shadow-lg animate-slide-in"
            style={{ minWidth: "250px" }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Animasyon CSS */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
