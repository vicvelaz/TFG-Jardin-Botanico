import React from "react";
import { db, storage } from "../firebase/firebase-config";
import $ from "jquery";
import "bootstrap";
import "moment/locale/es";
import SortableSelect from "./SelectItineraryItems";

const Itineraries = () => {
  let opciones = [
    // { value: 'Planta 1', label: 'Planta 1' },
    // { value: 'Planta 2', label: 'Planta 2' },
    // { value: 'Planta 3', label: 'Planta 3' }
  ];

  //listado de Itinerarios
  const [itinerarios, setItinerarios] = React.useState([]);
  const [list,setList] = React.useState([]);

  //listado de plantas y lugares
  const [plantasLugares, setPlantas_Lugares] = React.useState([
    // {
    //   value:'planta1',
    //   label:'planta1'
    // }
  ]);

  //estados de control
  const [loading, setLoading] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [numPaginas, setNumPaginas] = React.useState(1);
  const [pagActual, setPagActual] = React.useState(1);
  const [itemActual, setItemActual] = React.useState(0);
  const [paginas, setPaginas] = React.useState([]);

  //estados para inputs
  const [busqueda, setBusqueda] = React.useState("");
  const [id, setID] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [puntos, setPuntos] = React.useState([]);
  const [image, setImage] = React.useState(null);

  const obtenerItinerarios = async () => {
    try {
      const data = await db.collection("itinerary").get();
      const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setList(arrayData);
      setItinerarios(arrayData.slice(0, 5));
      setNumPaginas(arrayData.length % 5 === 0 ? (arrayData.length / 5) : (Math.trunc(arrayData.length / 5)) + 1);
      setItemActual(itemActual + 5);
      let pag = Array.from({length: numPaginas}, (_, index) => index + 1);
      setPaginas(pag);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerItinerarios();
  }, []);

  const obtenerPlantasLugares = async () => {
    try {
      const data = await db.collection("plants").get();
      const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      let infoSelect = [];
      arrayData.forEach((element) => {
        infoSelect.push({ value: element.id, label: element.name });
      });
      setPlantas_Lugares(infoSelect);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerPlantasLugares();
  }, []);

  const actualizarPuntos = (p) => {
    setPuntos(p);
  }

  const loadModalModificarItinerario = (id) => {
    setEdit(true);
    const itinerarioInfo = list.find((item) => item.id === id);
    prepararParadas(itinerarioInfo);
    document.getElementById("name").value = itinerarioInfo.name;
    document.getElementById("description").value = itinerarioInfo.description;
    setID(itinerarioInfo.id);
    setName(itinerarioInfo.name);
    setDescription(itinerarioInfo.description);
    document.getElementById("editsortableselect").click()
    setImage(itinerarioInfo.image);
  };

  const prepararParadas = (itinerarioInfo) => {

    let auxPuntos = [];
    itinerarioInfo.paradas.forEach((parada) => {
      let auxParada = plantasLugares.find(
        (element) => element.value === parada.id
      );

      auxPuntos.push({ value: auxParada.value, label: auxParada.label });
      puntos.push(auxParada);
    });

    setPuntos(auxPuntos);
  };

  const cancelarEdit = () => {
    setEdit(false);
    setName("");
    setDescription("");
    setPuntos([]);
    setImage("");
    document.getElementById("resetsortableselect").click();
    document.getElementById("formularioitinerarios").reset();

  };

  const modificarItinerario = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      let paradas = [];
      puntos.forEach((element) => {
        paradas.push(db.doc("/plants/" + element.value));
      });

      await db.collection("itinerary").doc(id).update({
        name: name,
        description: description,
        paradas: paradas,
        image: "",
      });

      if (image !== undefined) {
        const imagenRef = storage.ref().child("/images/itinerary").child(id);
        await imagenRef.put(image);
        const imagenURL = await imagenRef.getDownloadURL();
        await db.collection("itinerary").doc(id).update({ image: imagenURL });
      }

      obtenerItinerarios();

      setLoading(false);
      setEdit(false);
      setName("");
      setDescription("");
      setPuntos([]);
      setImage("");

      document.getElementById("formularioitinerarios").reset();
      document.getElementById("resetsortableselect").click();
      window.$("#nuevoitinerariomodal").modal("toggle");
      $("body").removeClass("modal-open");
      $(".modal-backdrop").remove();
      document.getElementById("busc").value = "";
      setBusqueda("");
    } catch (error) {
      console.log(error);
    }
  };

  const nuevoItinerario = async (e) => {
    e.preventDefault();
   
    try {
      let paradas = [];
      puntos.forEach((element) => {
        paradas.push(db.doc("/plants/" + element.value));
      });

      const nuevoItinerario = {
        name: name,
        description: description,
        paradas: paradas,
        image: "",
      };

      setLoading(true);
      const ev = await db.collection("itinerary").add(nuevoItinerario);

      if (image !== undefined) {
        const imagenRef = storage.ref().child("/images/itinerary").child(ev.id);
        await imagenRef.put(image);
        const imagenURL = await imagenRef.getDownloadURL();
        await db
          .collection("itinerary")
          .doc(ev.id)
          .update({ image: imagenURL });
      }

      obtenerItinerarios();

      setLoading(false);
      setName("");
      setDescription("");
      setPuntos([]);
      setImage("");

      document.getElementById("formularioitinerarios").reset();
      document.getElementById("resetsortableselect").click();
      window.$("#nuevoitinerariomodal").modal("toggle");
      $("body").removeClass("modal-open");
      $(".modal-backdrop").remove();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarItinerario = async (id) => {
    try {
      await db.collection("itinerary").doc(id).delete();
      const imagenRef = storage.ref().child("/images/itinerary").child(id);
      await imagenRef.delete();
      obtenerItinerarios();
    } catch (error) {
      console.log(error);
    }
  };

  const buscarItinerario = (e) => {
    setBusqueda(e.target.value);

    if (busqueda === "") {
      obtenerItinerarios();
    } else {
      setItinerarios(list.filter((ev) => ev.name.includes(busqueda)));
    }
  };

  const siguientePagina = () => {
    if(pagActual !== numPaginas){
        let ia = itemActual + 5;
        setItemActual(ia);
        setItinerarios(list.slice(itemActual, ia));
        setPagActual(pagActual + 1);
    }
}

const paginaAnterior = () => {
    if(pagActual !== 1){
        let ia = itemActual - 5;
        const itt = ia - 5;
        setItemActual(ia);
        setItinerarios(list.slice(itt, ia));
        setPagActual(pagActual - 1);
    } 
}

const irAPagina = (pag) => {
    const it = pag * 5;
    const itt = it - 5;
    setItemActual(it);
    setItinerarios(list.slice(itt,it));
    setPagActual(pag);
}

  return (
    <div className="background">
      <div className="d-flex justify-content-center mt-5">
        <h1>Itinerarios</h1>
      </div>
      <div className="container d-flex flex-column">
        <div className="d-flex mt-5">
          <button
            className="btn btn-success ms-5"
            data-bs-toggle="modal"
            data-bs-target="#nuevoitinerariomodal"
          >
            Nuevo Itinerario
          </button>
          <div className="modal fade text-dark" id="nuevoitinerariomodal">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">
                    {edit ? "Editar Itinerario" : "Nuevo Itinerario"}
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    onClick={() => cancelarEdit()}
                  ></button>
                </div>
                <form
                  id="formularioitinerarios"
                  onSubmit={(e) =>
                    edit ? modificarItinerario(e) : nuevoItinerario(e)
                  }
                >
                  <div className="modal-body">
                    <div className="form-floating mt-3">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nombre"
                        name="name"
                        maxLength="50"
                        onChange={(e) => setName(e.target.value.replace(/"/g,"'"))}
                        required
                      ></input>
                      <label htmlFor="name">Nombre</label>
                    </div>
                    <div className="form-floating mt-3">
                      <textarea
                        className="form-control text"
                        id="description"
                        name="description"
                        placeholder="Descripción"
                        onChange={(e) => setDescription(e.target.value.replace(/"/g,"'"))}
                        required
                      ></textarea>
                      <label htmlFor="description">Descripción</label>
                    </div>
                    <div className="mt-3">
                      <SortableSelect
                        paradas={plantasLugares}
                        id="puntos"
                        name="puntos"
                        editarPuntos={puntos}
                        actualizarPuntos={(p) => actualizarPuntos(p)}
                      ></SortableSelect>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                    <label htmlFor="formFile" className="form-label">
                      Imagen:{" "}
                    </label>
                    <input
                      className="form-control w-50 ms-2"
                      type="file"
                      accept="image/*"
                      id="formFile"
                      required={!edit}
                    ></input>
                  </div>
                  <div className="modal-footer">
                    <input
                      type="submit"
                      className="btn btn-success"
                      value={edit ? "Editar" : "Añadir"}
                    ></input>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                      onClick={() => cancelarEdit()}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className=" ms-auto me-5">
            <input
              type="text"
              id="busc"
              className="form-control form-control-md text-dark"
              placeholder="Buscar"
              onKeyUp={(e) => buscarItinerario(e)}
            // onChange={(e) => buscarItinerario(e)}
            // onKeyDown={(e) => buscarItinerario(e)}
            ></input>
          </div>
        </div>
        <div className="mt-4 table-container rounded">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {itinerarios.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.description.length>200 ?`${e.description.substring(0,200)}...`:e.description}</td>
                  <td>
                    <div className="d-flex">
                      <button
                        className="btn btn-success"
                        onClick={() => loadModalModificarItinerario(e.id)}
                        data-bs-toggle="modal"
                        data-bs-target="#nuevoitinerariomodal"
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger ms-3"
                        onClick={() => eliminarItinerario(e.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav className="mt-3" aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={pagActual === 1 ? "page-item disabled" : "page-item"} onClick={() => paginaAnterior()}>
              <a className={pagActual === 1 ? "page-link disabled-button" : "page-link clickable"}>Anterior</a>
            </li>
            {paginas.map((e) =>
              <li className={pagActual === e ? "page-item active" : "page-item"} key={e} onClick={() => irAPagina(e)}>
                <a className="page-link clickable">{e}</a>
              </li>
            )}
            <li className={pagActual === numPaginas ? "page-item disabled" : "page-item"} onClick={() => siguientePagina()}>
              <a className={pagActual === numPaginas ? "page-link disabled-button" : "page-link clickable"}>Siguiente</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Itineraries;
