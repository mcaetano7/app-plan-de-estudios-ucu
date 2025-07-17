import { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import React from "react";
import ListaMaterias from "./components/ListaMaterias.jsx";
import SelectorCarrera from "./components/SelectorCarrera.jsx";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");

  // 🔐 Autenticación
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUsuario(result.user);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
    setCarreraSeleccionada("");
  };

  // 🔄 Escuchar cambios de sesión
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUsuario(user);

      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCarreraSeleccionada(docSnap.data().carrera || "");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 💾 Guardar carrera en Firebase cuando se selecciona
  useEffect(() => {
    if (usuario && carreraSeleccionada) {
      const docRef = doc(db, "usuarios", usuario.uid);
      setDoc(docRef, { carrera: carreraSeleccionada }, { merge: true });
    }
  }, [carreraSeleccionada, usuario]);

  return (
    <div className="p-6">
      {usuario ? (
        <>
          <h1 className="text-xl font-bold mb-4">Hola, {usuario.displayName}</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded mb-6"
          >
            Cerrar sesión
          </button>

          {/* Selector de carrera */}
          {!carreraSeleccionada ? (
            <SelectorCarrera
              carreraSeleccionada={carreraSeleccionada}
              setCarreraSeleccionada={setCarreraSeleccionada}
            />
          ) : (
            <ListaMaterias />
          )}
        </>
      ) : (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Iniciar sesión con Google
        </button>
      )}
    </div>
  );
}

export default App;
