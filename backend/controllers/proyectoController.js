import mongoose from "mongoose";
import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find().where("creador").equals(req.usuario);
  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id); // Verificamos que el id sea un id de mongoose

  if (!valid) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario.id.toString()) {
    const error = new Error("Acción no válida, el proyecto no te pertenece");
    return res.status(401).json({ msg: error.message });
  }

  //Obtener las tareas del Proyecto
  const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);
  console.log(tareas);
  res.json({
    proyecto,
    tareas
  })
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id); // Verificamos que el id sea un id de mongoose

  if (!valid) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario.id.toString()) {
    const error = new Error("Acción no válida, el proyecto no te pertenece");
    return res.status(401).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  const valid = mongoose.Types.ObjectId.isValid(id); // Verificamos que el id sea un id de mongoose

  if (!valid) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario.id.toString()) {
    const error = new Error("Acción no válida, el proyecto no te pertenece");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto eliminado con éxito" });
  } catch (error) {
    console.log(error);
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};


export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador
};
