import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

import ListaMaterias from "./components/ListaMaterias.jsx";
import SelectorCarrera from "./components/SelectorCarrera.jsx";
import FormularioElectivas from "./components/FormularioElectivas.jsx";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [mostrarFormularioElectivas, setMostrarFormularioElectivas] = useState(false);
  const [electivas, setElectivas] = useState([]);

  // Login/Logout igual que antes...
    // Login/Logout igual que antes...
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUsuario(result.user);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
      setCarreraSeleccionada("");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUsuario(user);

      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCarreraSeleccionada(docSnap.data().carrera || "");
          setElectivas(docSnap.data().electivas || []);
        }
      } else {
        // Limpiar estado al cerrar sesión
        setCarreraSeleccionada("");
        setElectivas([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Guardar carrera y electivas en Firestore
  useEffect(() => {
    if (usuario) {
      const docRef = doc(db, "usuarios", usuario.uid);
      setDoc(
        docRef,
        { carrera: carreraSeleccionada, electivas },
        { merge: true }
      );
    }
  }, [carreraSeleccionada, electivas, usuario]);

  // Función para agregar electiva
  const agregarElectiva = (nuevaElectiva) => {
    setElectivas((prev) => [...prev, nuevaElectiva]);
    setMostrarFormularioElectivas(false);
  };

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

          {!carreraSeleccionada ? (
            <SelectorCarrera
              carreraSeleccionada={carreraSeleccionada}
              setCarreraSeleccionada={setCarreraSeleccionada}
            />
          ) : (
            <>
              <button
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setMostrarFormularioElectivas(true)}
              >
                Agregar materia electiva
              </button>

              {mostrarFormularioElectivas && (
                
                <FormularioElectivas
                  onAgregar={agregarElectiva}
                  onCancelar={() => setMostrarFormularioElectivas(false)}
                />
            )}


              {/* Pasamos electivas como prop a ListaMaterias */}
              <ListaMaterias electivas={electivas} />
            </>
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
