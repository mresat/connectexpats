// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      }
      setChecking(false);
    };
    fetchRole();
  }, [user]);

  if (loading || checking) return <p>Yükleniyor...</p>;

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) {
    return (
      <p className="text-red-600 text-center mt-10">
        Bu sayfaya erişim yetkiniz yok.
      </p>
    );
  }

  return children;
}
