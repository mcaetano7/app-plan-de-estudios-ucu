import React, { useState } from "react";

export default function FormularioElectiva({ onAgregar, onCancelar }) {
  const [nombre, setNombre] = useState("");
  const [previas, setPrevias] = useState("");
  const [creditos, setCreditos] = useState("");

  // Cuando el usuario hace submit, convertimos previas a array y pasamos datos
  const handleSubmit = (e) => {
    e.preventDefault();

    // Limpiamos espacios y separamos por comas
    const previasArray = previas
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const nuevaMateria = {
      id: Date.now(), // ID temporal único (podés mejorar esto)
      nombre,
      previas: previasArray,
      creditos: creditos ? Number(creditos) : null,
      semestre: null,
      tipo: "electiva",
    };

    onAgregar(nuevaMateria);

    // Limpio el formulario para la próxima vez
    setNombre("");
    setPrevias("");
    setCreditos("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow max-w-md">
      <h3 className="text-lg font-bold mb-4">Agregar materia electiva</h3>

      <label className="block mb-2">
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border px-2 py-1 rounded mt-1"
        />
      </label>

      <label className="block mb-2">
        Previa(s) (separar con comas):
        <input
          type="text"
          value={previas}
          onChange={(e) => setPrevias(e.target.value)}
          placeholder="Ej: Álgebra Lineal, Cálculo I"
          className="w-full border px-2 py-1 rounded mt-1"
        />
      </label>

      <label className="block mb-4">
        Créditos:
        <input
          type="number"
          value={creditos}
          onChange={(e) => setCreditos(e.target.value)}
          min="0"
          className="w-full border px-2 py-1 rounded mt-1"
        />
      </label>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Agregar
        </button>

        <button
          type="button"
          onClick={onCancelar}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
