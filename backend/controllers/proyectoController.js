import mongoose from "mongoose";
import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({
    '$or' : [
      {'colaboradores': { $in : req.usuario}},
      {'creador': { $in : req.usuario}}
    ]
  }).select('-tareas');
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
  const proyecto = await Proyecto.findById(id).populate({path : 'tareas', populate: {path: 'completado', select : "nombre "}}).populate('colaboradores', 'nombre email');

  if (!proyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  // Verificamos que el que pueda ver el proyecto sea el creador o un colaborador
  if (proyecto.creador.toString() !== req.usuario.id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString() )) {
    const error = new Error("Acción no válida, el proyecto no te pertenece");
    return res.status(401).json({ msg: error.message });
  }
  res.json(proyecto);
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



const buscarColaborador = async (req, res) => {

   const {email} = req.body;
   const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

   if(!usuario){
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
   }

   res.json(usuario);

};


const agregarColaborador = async (req, res) => {
  const  id  = req.params.id;

  const proyecto = await Proyecto.findById(id);

  //Verificando que el proyecto exista
  if(!proyecto){
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Verificando que el que este agregando colaborador sea dueño del proyecto
  if(proyecto.creador.toString() !== req.usuario.id.toString()){
    const error = new Error('Accion no Valida, no eres dueño del proyecto');
    return res.status(404).json({ msg: error.message });
  }

  const {email} = req.body;
  const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

  if(!usuario){
   const error = new Error('Usuario no encontrado');
   return res.status(404).json({ msg: error.message });
  }
 
// El colaborador no es el admin del proyecto

if(proyecto.creador.toString() === usuario._id.toString()){
    const error = new Error('El creador del proyecto no puede ser colaborador');
    return res.status(404).json({ msg: error.message });
}

//Revisar que ya no este agregado al proyecto
  if(proyecto.colaboradores.includes(usuario._id)){
    const error = new Error('El usuario ya pertenece al proyecto');
    return res.status(404).json({ msg: error.message });
  }

  //Esta bien, se puede agregar
  proyecto.colaboradores.push(usuario._id);

  await proyecto.save();
  res.json({msg: 'Colaborador agregado correctamente'});

};

const eliminarColaborador = async (req, res) => {
  const  id  = req.params.id;

  const proyecto = await Proyecto.findById(id);

  //Verificando que el proyecto exista
  if(!proyecto){
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Verificando que el que este eliminando el colaborador sea dueño del proyecto
  if(proyecto.creador.toString() !== req.usuario.id.toString()){
    const error = new Error('Accion no Valida, no eres dueño del proyecto');
    return res.status(404).json({ msg: error.message });
  }

    //Esta bien, se puede agregar
    proyecto.colaboradores.pull(req.body.id);

    await proyecto.save();
    res.json({msg: 'Colaborador eliminado correctamente'});
};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
};
