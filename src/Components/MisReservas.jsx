import React, { useEffect, useState } from "react";
import axios from "axios";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5001/travel/public/reservas/mis-reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => setReservas(response.data))
    .catch((error) => console.error("Error al cargar las reservas", error));
  }, []);

  return (
    <div>
      <h2>Mis Reservas</h2>
      {reservas.length === 0 ? (
        <p>No tienes reservas anteriores.</p>
      ) : (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id}>
              <h3>{reserva.nombreProducto}</h3>
              <p>Id: {reserva.id}</p>
              <p>Fecha de Tour: {reserva.fechaTour}</p>
              <p>Fecha que hizo la reserva: {reserva.fecha}</p>
              <p>Duración: {reserva.duracionDias} días</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisReservas;
