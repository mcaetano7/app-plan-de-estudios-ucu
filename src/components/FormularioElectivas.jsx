import React, { useState } from "react";

export default function FormularioElectivas({ onAgregar, onCancelar }) {
  const [nombre, setNombre] = useState("");
  const [creditos, setCreditos] = useState("");
  const [semestre, setSemestre] = useState("");
  const [previas, setPrevias] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre de la materia es obligatorio");
      return;
    }

    const nuevaMateria = {
      id: `electiva-${Date.now()}`, // id único
      nombre: nombre.trim(),
      creditos: creditos ? Number(creditos) : undefined,
      semestre: semestre ? Number(semestre) : undefined,
      previas: previas
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== ""),
    };

    onAgregar(nuevaMateria);

    // Limpiar formulario
    setNombre("");
    setCreditos("");
    setSemestre("");
    setPrevias("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black p-6 rounded shadow mb-6 max-w-md"
    >
      <h2 className="text-xl font-bold mb-4">Agregar materia electiva</h2>

      <div className="mb-4">
        <label className="block mb-1">Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Créditos</label>
        <input
          type="number"
          value={creditos}
          onChange={(e) => setCreditos(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Semestre</label>
        <input
          type="number"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Previas (separadas por coma)</label>
        <input
          type="text"
          value={previas}
          onChange={(e) => setPrevias(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Ej: Matemática 1, Física"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancelar}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
