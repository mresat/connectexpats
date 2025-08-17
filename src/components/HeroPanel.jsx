import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, signOut } from "firebase/auth";

export default function HeroPanel() {
  const [menu, setMenu] = useState("users");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const auth = getAuth();

  // Kullanıcıları çek
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  // Görevleri çek
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, []);

  // Ban işlemi
  const toggleBan = async (userId, currentStatus) => {
    await updateDoc(doc(db, "users", userId), {
      banned: !currentStatus,
    });
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, banned: !currentStatus } : u))
    );
  };

  // Moderatör yap
  const makeModerator = async (userId) => {
    await updateDoc(doc(db, "users", userId), {
      role: "moderator",
    });
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: "moderator" } : u))
    );
  };

  // Görev onay/red
  const handleTaskStatus = async (taskId, status) => {
    await updateDoc(doc(db, "tasks", taskId), {
      status: status,
    });
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  // Logout işlemi
  const handleLogout = async () => {
    await signOut(auth);
    // window.location.href = "/login"; // istersen yönlendirme ekleyebilirsin
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Hero Panel</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setMenu("users")}
              className="w-full text-left hover:underline"
            >
              Üyeler
            </button>
          </li>
          <li>
            <button
              onClick={() => setMenu("moderators")}
              className="w-full text-left hover:underline"
            >
              Moderatörler
            </button>
          </li>
          <li>
            <button
              onClick={() => setMenu("tasks")}
              className="w-full text-left hover:underline"
            >
              Görev Talepleri
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left mt-4 bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* İçerik */}
      <div className="flex-1 p-6">
        {menu === "users" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Üyeler</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">E-posta</th>
                  <th className="p-2">Rol</th>
                  <th className="p-2">Durum</th>
                  <th className="p-2">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role || "user"}</td>
                    <td className="p-2">{user.banned ? "Banlı" : "Aktif"}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => toggleBan(user.id, user.banned)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        {user.banned ? "Ban Kaldır" : "Banla"}
                      </button>
                      <button
                        onClick={() => makeModerator(user.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Moderatör Yap
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {menu === "tasks" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Görev Talepleri</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Ad Soyad</th>
                  <th className="p-2">Görev</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Şehir</th>
                  <th className="p-2">Durum</th>
                  <th className="p-2">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const user = users.find((u) => u.id === task.userId);
                  return (
                    <tr key={task.id} className="border-b">
                      <td className="p-2">
                        {user
                          ? `${user.firstName} ${user.lastName}`
                          : "Yükleniyor..."}
                      </td>
                      <td className="p-2">{task.taskArea}</td>
                      <td className="p-2">
                        {user ? user.email : "Yükleniyor..."}
                      </td>
                      <td className="p-2">
                        {user ? user.city : "Yükleniyor..."}
                      </td>
                      <td className="p-2">{task.status}</td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleTaskStatus(task.id, "approved")}
                          className="px-3 py-1 bg-green-500 text-white rounded"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => handleTaskStatus(task.id, "rejected")}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Reddet
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {menu === "moderators" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Moderatörler</h3>
            <ul>
              {users
                .filter((u) => u.role === "moderator")
                .map((mod) => (
                  <li key={mod.id}>{mod.email}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
