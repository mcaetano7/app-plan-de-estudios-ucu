import React from "react";

const carreras = [
  "Ingeniería en Inteligencia Artificial y Ciencia de Datos",
  "Ingeniería en Informática",
  "Ingeniería en Electrónica",
  "Ingeniería Industrial",
  "Otra carrera"
];

export default function SelectorCarrera({ carreraSeleccionada, setCarreraSeleccionada }) {
  const handleChange = (e) => {
    setCarreraSeleccionada(e.target.value);
  };

  const mensajeWhatsapp = encodeURIComponent(
    "Hola, estoy usando la app de plan de estudios UCU y no veo mi carrera. ¿Podrían agregarla?"
  );

  return (
    <div className="mb-6">
      <label className="block mb-2 text-lg font-semibold">Seleccioná tu carrera:</label>
      <select
        value={carreraSeleccionada}
        onChange={handleChange}
        className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
      >
        <option value="">-- Elegí una carrera --</option>
        {carreras.map((nombre) => (
          <option key={nombre} value={nombre}>
            {nombre}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <a
          href={`https://wa.me/59898665317?text=${mensajeWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          ¿No ves tu carrera? Hacé clic acá
        </a>
      </div>
    </div>
  );
}
