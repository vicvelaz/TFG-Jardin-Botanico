import React from "react";
import { db, storage } from "../firebase/firebase-config";
import $ from "jquery";
import "bootstrap";
import "moment/locale/es";
import SelectItineraries from "./SelectItineraries";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const Itineraries = () => {
  let opciones = [
    // { value: 'Planta 1', label: 'Planta 1' },
    // { value: 'Planta 2', label: 'Planta 2' },
    // { value: 'Planta 3', label: 'Planta 3' }
  ];

  //listado de Itinerarios
  const [itinerarios, setItinerarios] = React.useState([]);

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
  const [error, setError] = React.useState(null);

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
      setItinerarios(arrayData);
      console.log(itinerarios);
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
        console.log(element);
        infoSelect.push({ value: element.id, label: element.name });
      });
      setPlantas_Lugares(infoSelect);
      console.log(plantasLugares);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerPlantasLugares();
  }, []);

  const loadModalModificarItinerario = (id) => {
    setEdit(true);
    const itinerarioInfo = itinerarios.find((item) => item.id === id);
    console.log(itinerarioInfo.paradas);
    console.log(plantasLugares);
    prepararParadas(itinerarioInfo);
    document.getElementById("name").value = itinerarioInfo.name;
    document.getElementById("description").value = itinerarioInfo.description;
    setID(itinerarioInfo.id);
    setName(itinerarioInfo.name);
    setDescription(itinerarioInfo.description);
    // setPuntos(itinerarioInfo.paradas);

    //puntos.push({value:itinerarioInfo.paradas.id,label:itinerarioInfo.paradas.id});
    setImage(itinerarioInfo.image);
    console.log(puntos);
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
    setError(null);

    console.log(puntos);

    document.getElementById("formularioitinerarios").reset();
  };

  const modificarItinerario = async (e) => {
    e.preventDefault();
    if (name === "" || description === "") {
      setError("Los campos están vacios");
      return;
    }
    try {
      setLoading(true);

      let paradas = [];
      console.log(puntos);
      puntos.forEach((element) => {
        paradas.push(db.doc("/plants/" + element.value));
      });
      console.log(paradas);

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
      console.log(puntos);
      setPuntos("");
      console.log(puntos);
      setImage("");
      setError(null);

      document.getElementById("formularioitinerarios").reset();
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
    if (name === "" || description === "") {
      setError("Los campos están vacios");
      return;
    }
    try {
      let paradas = [];
      console.log(puntos);
      puntos.forEach((element) => {
        paradas.push(db.doc("/plants/" + element.value));
      });
      console.log(paradas);

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
      setError(null);

      document.getElementById("formularioitinerarios").reset();
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
      const arrayFiltrado = itinerarios.filter((item) => item.id !== id);
      setItinerarios(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };

  const buscarItinerario = (e) => {
    setBusqueda(e.target.value);
    console.log(e.target.value);
    if (busqueda === "") {
      obtenerItinerarios();
    } else {
      setItinerarios(itinerarios.filter((ev) => ev.name.includes(busqueda)));
    }
  };

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
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="form-floating mt-3">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nombre"
                        name="name"
                        maxLength="50"
                        onChange={(e) => setName(e.target.value)}
                      ></input>
                      <label htmlFor="name">Nombre</label>
                    </div>
                    <div className="form-floating mt-3">
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        placeholder="Descripción"
                        maxLength="200"
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                      <label htmlFor="description">Descripción</label>
                    </div>
                    <SelectItineraries 
                      paradas={puntos}
                    ></SelectItineraries>
                    {/* <Select
                      id="puntos"
                      name="puntos"
                      className="mt-3"
                      defaultValue={puntos}
                      isOptionSelected= {true}
                      isMulti={true}
                      options={plantasLugares}
                      loadOptions={true}
                      cache={false}
                      onChange={(e) => setPuntos(e) }
                    /> */}
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <label htmlFor="formFile" className="form-label">
                      Imagen:{" "}
                    </label>
                    <input
                      className="form-control w-50 ms-2"
                      type="file"
                      accept="image/*"
                      id="formFile"
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
        <div className="mt-4 contenedor rounded">
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
                  <td>{e.description}</td>
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
      </div>
    </div>
  );
};

export default Itineraries;
