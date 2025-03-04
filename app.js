const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express();
const bodyParser = require('body-parser')
const port = 3000;

app.use(bodyParser.json())
app.use(express.json())

const tecnicoComputacion = {
  ciclo1: {
    ANF231: { nombre: "Antropologia", prerrequisito: "Bachillerato", UV: 3 },
    PAL404: {
      nombre: "Programacion_Algoritmos",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    ALG501: { nombre: "Algebra", prerrequisito: "Bachillerato", UV: 4 },
    LME404: {
      nombre: "Lenguajes_Marcado",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    REC404: { nombre: "Redes", prerrequisito: "Bachillerato", UV: 4 },
  },
  ciclo2: {
    PSC231: {
      nombre: "Pensamiento_Social",
      prerrequisito: "Bachillerato",
      UV: 3,
    },
    POO404: {
      nombre: "Programacion_OrientadaObjetos",
      prerrequisito: ["Programacion_Algoritmos"],
      UV: 4,
    },
    DAW404: {
      nombre: "Desarrollo_AppWeb",
      prerrequisito: ["Lenguajes_Marcado"],
      UV: 4,
    },
    DSP404: {
      nombre: "Desarrollo_SoftPropietario",
      prerrequisito: ["Programacion_Algoritmos"],
      UV: 4,
    },
    ASB404: {
      nombre: "Analisis_BasesDatos",
      prerrequisito: ["Programacion_Algoritmos"],
      UV: 4,
    },
  },
};

const ingenieriaComputacion = {
  ciclo1: {
    CAD501: {
      nombre: "Calculo_Diferencial",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    QUG501: { nombre: "Quimica_General", prerrequisito: "Bachillerato", UV: 4 },
    ANF231: { nombre: "Antropologia", prerrequisito: "Bachillerato", UV: 3 },
    PRE104: {
      nombre: "Programacion_Estructurada",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
  },
  ciclo2: {
    ALG501: { nombre: "Algebra", prerrequisito: "Bachillerato", UV: 4 },
    CAI501: {
      nombre: "Calculo_Integral",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    MDB104: {
      nombre: "Modelamiento_BasesDatos",
      prerrequisito: ["Programacion_Estructurada"],
      UV: 4,
    },
    POO404: {
      nombre: "Programacion_OrientadaObjetos",
      prerrequisito: ["Programacion_Estructurada"],
      UV: 4,
    },
  },
  ciclo3: {
    CVV501: {
      nombre: "Calculo_Variables",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    CDP501: {
      nombre: "Cinematica_Dinamica_Particulas",
      prerrequisito: "Bachillerato",
      UV: 4,
    },
    ADS104: {
      nombre: "Analisis_SistemasInformaticos",
      prerrequisito: ["Modelamiento_BasesDatos"],
      UV: 4,
    },
    PED104: {
      nombre: "Programacion_Datos",
      prerrequisito: ["Programacion_OrientadaObjetos"],
      UV: 4,
    },
  },
};

const inscripciones = {};

//Rutas creadas

app.get("/", (req, res) => {
  res.send(
    "Rutas de Pensum: 'tecnicoComputacion/pensum' o '/ingenieriaComputacion/pensum' Rutas de Prerrequisitos por Materia: '/pre/tecnicoComputacion/ + codigo de Materia(DAW404, DSP404, etc.)' o '/pre/ingenieriaComputacion/ + codigo de Materia' Rutas Materias por Ciclo: '/tecnicoComputacion/ciclo (1 o 2)' o '/ingenieriaComputacion/ciclo (1, 2 o 3)'"
  );
});
//Pensum
app.get("/tecnicoComputacion/pensum", (req, res) => {
  res.send(tecnicoComputacion);
});
app.get("/ingenieriaComputacion/pensum", (req, res) => {
  res.send(ingenieriaComputacion);
});

//Prerrequisitos por codigo de materia
app.get("/pre/:carrera/:codigo", (req, res) => {
  const carrera = req.params.carrera;
  const codigo = req.params.codigo;

  var pensum = null;

  if (carrera === "tecnicoComputacion") {
    pensum = tecnicoComputacion;
  } else if (carrera === "ingenieriaComputacion") {
    pensum = ingenieriaComputacion;
  } else {
    res.status(404).json({ error: "Carrera no encontrada" });
  }

  if (pensum) {
    var matEncontrada = null;
    for (const ciclo in pensum) {
      matEncontrada = pensum[ciclo][codigo];
    }
  }

  if (matEncontrada) {
    res.send({
      carrera,
      codigo,
      nombre: matEncontrada.nombre,
      prerrequisito: matEncontrada.prerrequisito,
    });
  } else {
    res.status(404).json({ error: "Materia no encontrada" });
  }
});

//Materias por ciclo
app.get("/:carrera/:ciclo", (req, res) => {
  const carrera = req.params.carrera;
  const ciclo = req.params.ciclo;

  var pensum = null;
  if (carrera === "tecnicoComputacion") {
    pensum = tecnicoComputacion;
  } else if (carrera === "ingenieriaComputacion") {
    pensum = ingenieriaComputacion;
  } else {
    res.status(404).json({ error: "Carrera no encontrada" });
  }

  if (pensum && pensum[ciclo]) {
    const materiasCiclo = Object.keys(pensum[ciclo]);
    res.send({ carrera, ciclo, materias: materiasCiclo });
  } else {
    res.status(404).json({ error: "Ciclo no encontrada" });
  }
});

//Ruta para inscripciones
app.post('/inscribir/:carrera', bodyParser.json(), (req, res) => {
  const carrera = req.params.carrera;
  const { codigoMateria } = req.body;

  if(carrera !== 'tecnicoComputacion' && carrera !== 'ingenieriaComputacion') {
    return res.status(404).json({ error: "Carrera no encontrada" });
  }

  if(!codigoMateria || !Array.isArray(codigoMateria) || codigoMateria.length == 0) {
    return res.status(400).json({ error: "Se debe de inscribir al menos una materia" });
  }

  const pensum = carrera === 'tecnicoComputacion' ? tecnicoComputacion : ingenieriaComputacion;

  //Total de UV
  const UVS = codigoMateria.reduce((total, codigo) => {
    const ciclo = codigo.substring(0, 6);
    const materia = pensum[ciclo] && pensum[ciclo][codigo];
    if (materia) {
      return total + materia.UV;
    } else {
      return total;
    }
  }, 0)

  if(UVS>20) {
    return res.status(400).json({ error: "Límite de 20 UV para las inscripciones" });
  }

  //Registrar las inscripciones
  if(!inscripciones[carrera]) {
    inscripciones[carrera] = [];
  }

  inscripciones[carrera] = inscripciones[carrera].concat(codigoMateria);
  res.status(201).send( "Inscripcion correcta" );
})


//Ruta para eliminar inscripcion
app.delete('/eliminar/:carrera', (req, res) => {
  const carrera = req.params.carrera;
  const {codigoMateria} = req.body;

  if(carrera !== 'tecnicoComputacion' && carrera !== 'ingenieriaComputacion') {
    return res.status(404).json({ error: "Carrera no encontrada" });
  }

  if(!codigoMateria || !Array.isArray(codigoMateria) || codigoMateria.length == 0) {
    return res.status(400).json({ error: "Se debe de inscribir al menos una materia" });
  }

  if (!inscripciones[carrera] || !codigoMateria.every((codigo) => inscripciones[carrera].includes(codigo))) {
    return res.status(400).json({ error: "No se puede eliminar la inscripcion" });
  }

  inscripciones[carrera] = inscripciones[carrera].filter((codigo) => !codigoMateria.includes(codigo));

  res.send("Inscripcion elimanada correctamente");

})

app.listen(port, () => {
  console.log("API escuchando en el puerto: " + port);
});
