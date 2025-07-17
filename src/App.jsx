import { useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut } from './firebase';

function App() {
  const [usuario, setUsuario] = useState(null);

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
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      {usuario ? (
        <>
          <h1 className="text-xl font-bold mb-4">Hola, {usuario.displayName}</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar sesión</button>
          {/* Aquí irá el plan de estudios más adelante */}
        </>
      ) : (
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">Iniciar sesión con Google</button>
      )}
    </div>
  );
}

export default App;
