import { formatearFecha } from "../../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";

const Tarea = ({ tarea }) => {
  const { nombre, descripcion, fechaEntrega, prioridad, _id, estado } = tarea;

  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos();

  const admin = useAdmin();

  return (
    <div className="items-center border-b p-5 flex justify-between">
      <div className="flex flex-col items-start">
        <p className="text-xl mb-1">{nombre}</p>
        <p className="text-sm text-gray-500 uppercase mb-1">{descripcion}</p>
        <p className="text-xl mb-1">{formatearFecha(fechaEntrega)}</p>
        <p className="text-xl text-gray-600 mb-1">Prioridad : {prioridad}</p>
        {estado && <p className="text-xs font-bold bg-green-600 uppercase text-white rounded-lg p-1 ">Completada por: {tarea.completado.nombre}</p>}

      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        {admin && (
          <button
            onClick={() => handleModalEditarTarea(tarea)}
            className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          >
            Editar
          </button>
        )}

          <button 
            className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg `}
            onClick={()=> completarTarea(_id)}
            >
            {estado ? 'Completa' : 'Incompleta'}
          </button>

        {admin && (
          <button
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default Tarea;
