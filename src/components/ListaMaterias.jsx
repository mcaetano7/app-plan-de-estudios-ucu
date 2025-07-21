import React, { useState, useEffect } from "react";
import materias from "../data/materias.json";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ListaMaterias({ electivas = [] }) {
  const materiasNormales = materias;
  const materiasElectivas = electivas;

  const [aprobadas, setAprobadas] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "usuarios", user.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setAprobadas(docSnap.data().aprobadas || []);
      }
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "usuarios", user.uid);
    setDoc(docRef, { aprobadas }, { merge: true });
  }, [aprobadas, user]);

  const coloresPorSemestre = {
    1: "bg-yellow-300",
    2: "bg-green-300",
    3: "bg-blue-300",
    4: "bg-pink-200",
    5: "bg-purple-100",
    6: "bg-red-100",
    7: "bg-orange-100",
    8: "bg-cyan-100",
    9: "bg-lime-100",
    10: "bg-teal-100",
    default: "bg-gray-200",
  };

  const materiasPorSemestre = materiasNormales.reduce((acc, materia) => {
    const semestre = materia.semestre || "Sin semestre";
    if (!acc[semestre]) acc[semestre] = [];
    acc[semestre].push(materia);
    return acc;
  }, {});

  const materiasPorNombre = new Map(
    [...materiasNormales, ...materiasElectivas].map((m) => [m.nombre, m])
  );

  const estaHabilitada = (materia) => {
    if (materia.previas.length === 0) return true;
    return materia.previas.every((nombrePrevia) => {
      const previa = materiasPorNombre.get(nombrePrevia);
      return previa && aprobadas.includes(previa.id);
    });
  };

  const toggleMateria = (id) => {
    setAprobadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Plan de Estudios</h1>

      {/* Materias por semestre */}
      {Object.entries(materiasPorSemestre)
        .sort(([a], [b]) => (a === "Sin semestre" ? 999 : a) - (b === "Sin semestre" ? 999 : b))
        .map(([semestre, lista]) => (
          <div key={semestre} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-700">
              Semestre {semestre}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lista.map((materia) => {
                const estaAprobada = aprobadas.includes(materia.id);
                const habilitada = estaHabilitada(materia);
                const color =
                  coloresPorSemestre[materia.semestre] || coloresPorSemestre.default;

                let claseVisual = "";
                if (estaAprobada) {
                  claseVisual = "line-through opacity-60 cursor-pointer";
                } else if (habilitada) {
                  claseVisual = `hover:scale-[1.02] cursor-pointer ${color}`;
                } else {
                  claseVisual = "bg-gray-300 opacity-40 cursor-not-allowed";
                }

                return (
                  <li
                    key={materia.id}
                    onClick={() => {
                      if (habilitada || estaAprobada) toggleMateria(materia.id);
                    }}
                    className={`p-4 border rounded shadow transition ${claseVisual}`}
                  >
                    <h3 className="text-lg font-bold">{materia.nombre}</h3>
                    <p className="text-sm">
                      Créditos: {materia.creditos ?? "No asignado"}
                    </p>
                    {materia.previas.length > 0 ? (
                      <p className="text-sm text-gray-600">
                        Previas: {materia.previas.join(", ")}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Sin previas</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

      {/* Materias Electivas */}
      {materiasElectivas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-violet-700">
            Materias Electivas
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {materiasElectivas.map((materia) => {
              const estaAprobada = aprobadas.includes(materia.id);
              const habilitada = estaHabilitada(materia);

              let claseVisual = "";
              if (estaAprobada) {
                claseVisual = "line-through opacity-60 cursor-pointer";
              } else if (habilitada) {
                claseVisual = `hover:scale-[1.02] cursor-pointer bg-violet-200`;
              } else {
                claseVisual = "bg-gray-200 opacity-40 cursor-not-allowed";
              }

              return (
                <li
                  key={materia.id}
                  onClick={() => {
                    if (habilitada || estaAprobada) toggleMateria(materia.id);
                  }}
                  className={`p-4 border rounded shadow transition ${claseVisual}`}
                >
                  <h3 className="text-lg font-bold">{materia.nombre}</h3>
                  <p className="text-sm">
                    Créditos: {materia.creditos ?? "No asignado"}
                  </p>
                  {materia.previas.length > 0 ? (
                    <p className="text-sm text-gray-600">
                      Previas: {materia.previas.join(", ")}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Sin previas</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
