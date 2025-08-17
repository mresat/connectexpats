import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name"); // "name", "city", "sector"
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sayfalama
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const currentResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setResults([]);
    const usersRef = collection(db, "users");
    let q = query(usersRef);
    try {
      const querySnapshot = await getDocs(q);
      let tempResults = [];
      querySnapshot.forEach((doc) => tempResults.push(doc.data()));
      setResults(tempResults);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    const usersRef = collection(db, "users");
    let q;

    if (searchTerm.trim() === "") {
      fetchUsers();
      return;
    }

    if (searchType === "name")
      q = query(usersRef, where("name", "==", searchTerm));
    else if (searchType === "city")
      q = query(usersRef, where("city", "==", searchTerm));
    else if (searchType === "sector")
      q = query(usersRef, where("sector", "==", searchTerm));

    try {
      const querySnapshot = await getDocs(q);
      let tempResults = [];
      querySnapshot.forEach((doc) => tempResults.push(doc.data()));
      setResults(tempResults);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white shadow-md flex flex-col">
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
      <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Kullanıcı Ara</h2>

        {/* Arama */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 justify-center items-center">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border px-4 py-3 rounded text-sm w-28"
          >
            <option value="name">Ad Soyad</option>
            <option value="city">Şehir</option>
            <option value="sector">Sektör</option>
          </select>
          <input
            type="text"
            placeholder="Arama terimi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-300 w-40"
          >
            Ara
          </button>
        </div>

        {loading && <p>Arama yapılıyor...</p>}

        {/* Sonuç kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentResults.length > 0
            ? currentResults.map((user, i) => (
                <div
                  key={i}
                  className="bg-white shadow rounded p-4 flex flex-col gap-2 hover:shadow-lg transition transform scale-90 sm:scale-95 md:scale-90"
                >
                  <h3 className="text-lg font-bold truncate">
                    {(user.firstName || "") + " " + (user.lastName || "")}
                  </h3>
                  <p>
                    <span className="font-semibold">Şehir:</span>{" "}
                    {user.city || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Telefon:</span>{" "}
                    {user.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Kullanıcı Türü:</span>{" "}
                    {user.userType === "calisan"
                      ? "Çalışan"
                      : user.userType === "ogrenci"
                      ? "Öğrenci"
                      : user.userType === "isarayan"
                      ? "İş Arayan"
                      : user.userType === "diger"
                      ? "Diğer"
                      : "-"}
                  </p>
                  <p className="flex flex-wrap gap-2">
                    {user.linkedin && (
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    {user.instagram && (
                      <a
                        href={user.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 underline text-sm"
                      >
                        Instagram
                      </a>
                    )}
                    {!user.linkedin && !user.instagram && "-"}
                  </p>
                </div>
              ))
            : !loading && <p>Sonuç bulunamadı.</p>}
        </div>

        {/* Sayfalama */}
        {results.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-center gap-2 mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded hover:bg-gray-200 disabled:opacity-50 w-full sm:w-auto"
            >
              Önceki
            </button>
            <span className="px-4 py-2 text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded hover:bg-gray-200 disabled:opacity-50 w-full sm:w-auto"
            >
              Sonraki
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
