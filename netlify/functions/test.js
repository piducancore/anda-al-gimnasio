const { apiClient } = require("../../src/gimnasio");
const { notifyMe } = require("../../src/telegram");

exports.handler = async function (event, context) {
  const login = await apiClient("/logica/login_iniciar_sesion.php", {
    usuario: process.env.API_USER,
    password: process.env.API_PASS,
    ref: "reservar.php",
  });
  console.log({ now: new Date().toISOString() });
  if (login.resultado) {
    const allClasses = await apiClient("/logica/inscritos_listar_clases.php", {
      start: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      end: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
      codigo_sucursal: "00000011", // the Talca venue 🐷 (required)
      id_tipo_actividad: "1", // 🤷 (required)
      // timezone: "America/Argentina/Buenos_Aires", // (optional)
      // id_tipo_clase: "", // (optional)
      // rut_profesor: "", // (optional)
    });
    const found = allClasses?.find((c) => c.inicio_aforo === "21:00" && c.cupos > c.reservas);
    if (found) {
      //   const reserva = await apiClient("/logica/inscritos_nuevo.php", {
      //     id_clase: found.id_clase,
      //     codigo_sucursal: "00000011",
      //   });
      const reserva = { resultado: true };
      if (reserva.resultado) {
        const parseDate = new Date(found.start.replace(/\ /g, "T"));
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const date = `${days[parseDate.getDay()]} ${parseDate.getDate()}`;
        const time = `${parseDate.getHours()}:${("0" + parseDate.getMinutes()).slice(-2)}`;
        await notifyMe(`✅ ${found.descripcion}\n${found.nombre_profesor}\n${date}\n${time} horas`);
        return { statusCode: 200, body: `✅ ${found.descripcion}\n${found.nombre_profesor}\n${date}\n${time} horas` };
      } else {
        await notifyMe("❌ Error al reservar");
        return { statusCode: 200, body: "❌ Error al reservar" };
      }
    } else {
      await notifyMe("😢 No hay cupos disponibles");
      return { statusCode: 200, body: "😢 No hay cupos disponibles" };
    }
  } else {
    await notifyMe("❌ Error de autenticación");
    return { statusCode: 200, body: "❌ Error de autenticación" };
  }
};
