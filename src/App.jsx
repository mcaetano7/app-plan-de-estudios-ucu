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
      setElectivas([]);
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
          const data = docSnap.data();
          setCarreraSeleccionada(data.carrera || "");
          setElectivas(data.electivas || []);
        } else {
          // solo crear si no existe, pero sin sobreescribir lo que se va a leer
          await setDoc(docRef, {
            carrera: "",
            electivas: [],
            aprobadas: []
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const guardarCarrera = async (nuevaCarrera) => {
    setCarreraSeleccionada(nuevaCarrera);
    if (usuario) {
      const docRef = doc(db, "usuarios", usuario.uid);
      await setDoc(docRef, { carrera: nuevaCarrera }, { merge: true });
    }
  };

  const agregarElectiva = async (nuevaElectiva) => {
    const nuevasElectivas = [...electivas, nuevaElectiva];
    setElectivas(nuevasElectivas);
    setMostrarFormularioElectivas(false);
    if (usuario) {
      const docRef = doc(db, "usuarios", usuario.uid);
      await setDoc(docRef, { electivas: nuevasElectivas }, { merge: true });
    }
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
              setCarreraSeleccionada={guardarCarrera}
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
