import React, { useState } from "react";
import axios from "axios";

const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [caracteristicaIds, setCaracteristicaIds] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([{ fecha: "", stock: 0 ,duracionDias:0}]);

  // Obtener datos del backend: http://localhost:5001/travel/public/categorias
  const categorias = [
    {
      id: 1,
      name: "INVIERNO A",
      descripcion: "Descripcion",
      image: "https://travel-dh-bucket.s3.amazonaws.com/1732777494374_imagen-house.jpg",
    },
    {
      id: 2,
      name: "INVIERNO B",
      descripcion: "Descripcion",
      image: "https://travel-dh-bucket.s3.amazonaws.com/1732777497526_imagen-house.jpg",
    },
    {
      id: 3,
      name: "INVIERNO Xx",
      descripcion: "Descripcion",
      image: "https://travel-dh-bucket.s3.amazonaws.com/1732777499890_imagen-house.jpg",
    },
  ];

  //obtener datos del backend: http://localhost:5001/travel/public/caracteristicas
  const caracteristicas = [
    { id: 1, name: "Caracteristica 1", icon: "🚀" },
    { id: 2, name: "Caracteristica 2", icon: "🚀" },
    { id: 3, name: "Caracteristica 3", icon: "🚀" },
    { id: 4, name: "Caracteristica 4", icon: "🚀" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("ubicacion", ubicacion);
    formData.append("precio", precio);
    formData.append("categoriaId", categoriaId);

    caracteristicaIds.forEach((id) => {
      formData.append("caracteristicaIds[]", id);
    });

    imagenes.forEach((imagen) => {
      formData.append("imagenes[]", imagen);
    });

    fechasDisponibles.forEach((fechaDisponible, index) => {
      formData.append(`fechasDisponibles[${index}].fecha`, fechaDisponible.fecha);
      formData.append(`fechasDisponibles[${index}].stock`, fechaDisponible.stock);
      formData.append(`fechasDisponibles[${index}].duracionDias`, fechaDisponible.duracionDias);
    });

    const token = localStorage.getItem("token"); 

    try {
      const response = await axios.post(
        "http://localhost:5001/travel/public/productos", 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Agregar token en los encabezados
          },
        }
      );
      console.log("Producto creado:", response.data);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div>
        <label>Ubicación</label>
        <input
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        />
      </div>     
      <div>
        <label>Precio</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </div>     
      <div>
        <label>Categoría</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Seleccionar Categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Características</label>
        {caracteristicas.map((caracteristica) => (
          <div key={caracteristica.id}>
            <input
              type="checkbox"
              value={caracteristica.id}
              onChange={(e) => {
                if (e.target.checked) {
                  setCaracteristicaIds([...caracteristicaIds, caracteristica.id]);
                } else {
                  setCaracteristicaIds(
                    caracteristicaIds.filter((id) => id !== caracteristica.id)
                  );
                }
              }}
            />
            <label>
              {caracteristica.icon} {caracteristica.name}
            </label>
          </div>
        ))}
      </div>
      <div>
        <label>Imágenes</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImagenes([...e.target.files])}
        />
      </div>
      <div>
        <label>Fechas disponibles</label>
        {fechasDisponibles.map((fechaDisponible, index) => (
          <div key={index}>
             <label>Fecha</label>
            <input
              type="date"
              value={fechaDisponible.fecha}
              onChange={(e) =>
                setFechasDisponibles((prev) =>
                  prev.map((fd, i) =>
                    i === index ? { ...fd, fecha: e.target.value } : fd
                  )
                )
              }
            />
             <label>Stock</label>
            <input
              type="number"
              placeholder="Stock"
              value={fechaDisponible.stock}
              onChange={(e) =>
                setFechasDisponibles((prev) =>
                  prev.map((fd, i) =>
                    i === index ? { ...fd, stock: e.target.value } : fd
                  )
                )
              }
            />
            <label>Duración en Días</label>
            <input
              type="number"
              placeholder="Duracion en Días"
              value={fechaDisponible.duracionDias}
              onChange={(e) =>
                setFechasDisponibles((prev) =>
                  prev.map((fd, i) =>
                    i === index ? { ...fd, duracionDias: e.target.value } : fd
                  )
                )
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFechasDisponibles([
              ...fechasDisponibles,
              { fecha: "", stock: 0, duracionDias:0 },
            ])
          }
        >
          Agregar Fecha
        </button>
      </div>
      <button type="submit">Crear Producto</button>
    </form>
  );
};

export default CrearProducto;


