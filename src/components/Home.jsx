import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img src="/connectexpatlogo-1.png" alt="logo" className="h-12" />
            <span className="text-xl font-bold text-black">ConnectExpats</span>
          </div>
          <nav className="hidden md:flex gap-6 text-black">
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
          <div className="flex gap-3">
            <Link
              to="/login"
              className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition"
            >
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
            >
              Üye Ol
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-16 bg-white">
        <div className="container mx-auto">
          <img
            src="/connectexpat.png"
            alt="ConnectExpats"
            className="mx-auto mb-6 w-60"
          />
          <p className="text-lg font-medium mb-4">
            Görev almak isteyenler lütfen talep formunu eksiksiz ve doğru
            bilgilerle doldurun. Yapılan talep başvurusu değerlendirilecektir.
          </p>
          <Link
            to="/form"
            className="mt-6 inline-block border border-yellow-500 text-yellow-500 px-6 py-3 rounded hover:bg-yellow-500 hover:text-white transition"
          >
            Görev Al
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 relative overflow-hidden"
        style={{
          backgroundImage:
            "url('/germany-tourist-attractions-1513251736-785x440.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // Parallax efekt
        }}
      >
        {/* Soluk arka plan overlay */}
        <div className="absolute inset-0 bg-white opacity-70 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:flex md:items-center md:gap-10 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Biz Kimiz</h2>
            <p>
              <strong>ConnectExpats</strong>, Almanya'da yaşayan expatlara
              rehberlik ve destek hizmetleri sunan bir sivil toplum kuruluşudur.
              Dil ve kültür eğitimi, sosyal ağ oluşturma, entegrasyon ve
              danışmanlık hizmetleri sağlar.
            </p>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <img
              src="/connectexpat.png"
              alt="about"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            <details className="border p-4 rounded">
              <summary className="font-medium cursor-pointer">
                ConnectExpats üye olmak ve sonrası nasıl işler?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Kayıt sonrası başvurular değerlendirilip ekiplerimiz tarafından
                iletişime geçilir.
              </p>
            </details>
            <details className="border p-4 rounded">
              <summary className="font-medium cursor-pointer">
                Almanya adres kaydı nasıl yapılır?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Önce belediyeden randevu alarak adresinizi kaydettirmeniz
                gerekir. Ardından konsolosluk bildirimi yapılır.
              </p>
            </details>
            <details className="border p-4 rounded">
              <summary className="font-medium cursor-pointer">
                ConnectExpats iş bulur mu?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Doğrudan iş bulma hizmeti sunmuyoruz; ancak gelen ilanları
                paylaşıyoruz.
              </p>
            </details>
            <details className="border p-4 rounded">
              <summary className="font-medium cursor-pointer">
                Görev almak mümkün mü?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Evet! Sosyal medya, organizasyon ve halkla ilişkiler gibi
                alanlarda gönüllü görevler mevcuttur.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Bize Ulaşın</h2>
          <p className="mb-2">
            📧{" "}
            <a href="mailto:mail@gmail.com" className="text-blue-600">
              mail@gmail.com
            </a>
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm">
          © 2025 ConnectExpats - Tüm Hakları Saklıdır
        </div>
      </footer>
    </div>
  );
}
