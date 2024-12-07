import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const DetalleProducto = () => {

  const idProducto = 19;

  const [producto, setProducto] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [usuariosReservados, setUsuariosReservados] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/travel/public/productos/${idProducto}`) // Endpoint para obtener el producto completo
      .then(response => setProducto(response.data))
      .catch(error => console.error("Error al cargar el producto", error));
  }, []);

  const today = new Date();

  // Función para deshabilitar fechas anteriores a hoy
  const tileDisabled = ({ date }) => {
    return date < today; // Deshabilitar fechas pasadas
  };

  const tileClassName = ({ date }) => {
    if (!producto) return null;
    const dateString = date.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
    const fecha = producto.fechasDisponibles.find(f => f.fecha === dateString);
    if (fecha) {
      return fecha.stock > 0 ? "disponible" : "tachada";
    }
    return null;
  };

  const onDateClick = (date) => {
    setFechaSeleccionada(null);
    const dateString = date.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
    const fecha = producto.fechasDisponibles.find(f => f.fecha === dateString);
    if (fecha) {
      setFechaSeleccionada(fecha);
      cargarUsuariosReservados(fecha.id);
    }
  };

  const cargarUsuariosReservados = (fechaId) => {
    axios
      .get(`http://localhost:5001/travel/public/reservas/usuarios?fechaDisponibleId=${fechaId}`)
      .then(response => setUsuariosReservados(response.data))
      .catch(error => console.error("Error al cargar usuarios reservados", error));
  };

  const realizarReserva = (fechaId) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:5001/travel/public/reservas?fechaDisponibleId=${fechaId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => alert("Reserva realizada con éxito."))
      .catch(error => console.error("Error al realizar la reserva", error));
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div>
      <h1>{producto.nombre}</h1>
      <p>{producto.descripcion}</p>
      <p>Ubicación: {producto.ubicacion}</p>
      <p>Precio: ${producto.precio}</p>
      <div>
        <h3>Imágenes</h3>
        {producto.imagenes.map((imagen, index) => (
          <img key={index} src={imagen} alt={`Imagen ${index + 1}`} width={200} />
        ))}
      </div>
      <div>
        <h3>Categoría</h3>
        <p>{producto.categoria.name}</p>
        <p>{producto.categoria.descripcion}</p>
        <img src={producto.categoria.image} alt="Categoría" width={200} />
      </div>
      <div>
        <h3>Características</h3>
        <ul>
          {producto.caracteristicas.map((caracteristica) => (
            <li key={caracteristica.id}>
              {caracteristica.icon} {caracteristica.name}
            </li>
          ))}
        </ul>
      </div>
      <h3>Calendario de fechas disponibles</h3>
      <Calendar    tileDisabled={tileDisabled}  tileClassName={tileClassName} onClickDay={onDateClick} />
      {fechaSeleccionada && (
        <div>
          <h3>Información de la Reserva</h3>
          <p>Fecha: {fechaSeleccionada.fecha}</p>
          <p>Duración: {fechaSeleccionada.duracionDias} días</p>          
          <p>Disponibilidad: {fechaSeleccionada.stock - fechaSeleccionada.disponibilidad}</p>
          <p>Stock: {fechaSeleccionada.stock}</p>
          {usuariosReservados.length > 0 ? (
            <>
              <h4>Usuarios que ya reservaron:</h4>
              <ul>
                {usuariosReservados.map((usuario, index) => (
                  <li key={index}>
                    {usuario.nombre} {usuario.apellido} - <a href={`/perfil/${usuario.id}`}>Ver perfil</a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No hay usuarios reservados para esta fecha.</p>
          )}
          <button onClick={() => realizarReserva(fechaSeleccionada.id)}>Reservar</button>
        </div>
      )}
    </div>
  );
};

export default DetalleProducto;
