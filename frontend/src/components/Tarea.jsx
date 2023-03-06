import { formatearFecha } from "../../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";

const Tarea = ({ tarea }) => {
  const { nombre, descripcion, fechaEntrega, prioridad, _id, estado } = tarea;

  const { handleModalEditarTarea, handleModalEliminarTarea  } = useProyectos();

 

  return (
    <div className="items-center border-b p-5 flex justify-between">
      <div>
        <p className="text-xl mb-1">{nombre}</p>
        <p className="text-sm text-gray-500 uppercase mb-1">{descripcion}</p>
        <p className="text-xl mb-1">{formatearFecha(fechaEntrega)}</p>
        <p className="text-xl text-gray-600 mb-1">Prioridad : {prioridad}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={()=> handleModalEditarTarea(tarea)}
          className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">
          Editar
        </button>

        {estado ? (
          <button className="bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">
            completa
          </button>
        ) : (
          <button className="bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">
            imcompleta
          </button>
        )}

        <button 
          className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          onClick={()=>handleModalEliminarTarea(tarea)}
          >
          eliminar
        </button>
      </div>
    </div>
  );
};

export default Tarea;
