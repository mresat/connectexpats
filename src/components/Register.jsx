import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [humanAnswer, setHumanAnswer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [info, setInfo] = useState(""); // Bilgi mesajı

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
  }, []);

  useEffect(() => {
    if (success) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setInfo("");

    if (parseInt(humanAnswer) !== num1 + num2) {
      setError("Lütfen matematik işlemini doğru yapın.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Kullanıcının IP adresini al
      let ip = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (err) {
        console.error("IP alınamadı:", err);
      }

      // Device Info
      const deviceInfo = `${navigator.platform} / ${navigator.userAgent}`;

      // Firestore'a kullanıcı kaydı
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
        ip: ip,
        deviceInfo: deviceInfo,
        isBanned: false, // ban kontrolü için
        role: "user", // default normal kullanıcı
      });

      // Ban kontrolü (her ihtimale karşı)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().isBanned) {
        setError("Hesabınız banlanmış. Lütfen yönetici ile iletişime geçin.");
        return;
      }

      // Email doğrulama e-postası gönder
      await sendEmailVerification(user);
      setInfo(
        "Kayıt başarılı! Lütfen e-posta adresinize gelen doğrulama mailini kontrol edin."
      );
      setSuccess(true);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Bu e-posta adresi zaten kullanımda.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else if (err.code === "auth/weak-password") {
        setError("Şifre çok zayıf. En az 6 karakter giriniz.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="text-gray-800 min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img src="/connectexpatlogo-1.png" alt="logo" className="h-12" />
            <span className="text-xl font-bold text-black">ConnectExpats</span>
          </div>
          <nav className="hidden md:flex gap-6 text-black">
            <Link to="/" className="hover:underline">
              Ana Sayfa
            </Link>
            <a href="#about" className="hover:underline">
              Biz Kimiz
            </a>
            <a href="#faq" className="hover:underline">
              SSS
            </a>
            <a href="#contact" className="hover:underline">
              İletişim
            </a>
          </nav>
          <Link
            to="/login"
            className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition"
          >
            Giriş Yap
          </Link>
        </div>
      </header>

      {/* Toast mesajı */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-out">
          {info || "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz..."}
        </div>
      )}

      {/* Register Form */}
      <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center">Üye Ol</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="E-posta"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre (Tekrar)"
            className="w-full px-4 py-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="flex items-center gap-3">
            <label className="font-medium whitespace-nowrap">
              Sonucu kaç : {num1} + {num2} = ?
            </label>
            <input
              type="number"
              className="w-20 px-3 py-1 border rounded"
              value={humanAnswer}
              onChange={(e) => setHumanAnswer(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300 transition"
          >
            Üye Ol
          </button>
        </form>
      </div>
    </div>
  );
}
