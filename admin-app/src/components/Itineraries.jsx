import React from "react";
import { db, storage } from "../firebase/firebase-config";
import $ from "jquery";
import "bootstrap";
import "moment/locale/es";
import SortableSelect from "./SelectItineraryItems";
import { MDBDataTableV5 } from 'mdbreact';

const Itineraries = () => {
 

  //listado de plantas y lugares
  const [plantasLugares, setPlantas_Lugares] = React.useState([
    // {
    //   value:'planta1',
    //   label:'planta1'
    // }
  ]);

  const [datatable, setDatatable] = React.useState(
    {
        columns: [
            {
                label: 'Nombre',
                field: 'name',
                sort: 'asc',
                width: 300
            },
            {
                label: 'Descripción',
                field: 'description',
                sort: 'asc',
                width: 270
            },
            {
                label: 'Opciones',
                field: 'options',
                sort: 'asc',
                width: 150
            }
        ],
        rows: []
    }
);

  //estados de control
  const [edit, setEdit] = React.useState(false);

  //estados para inputs
  const [id, setID] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [puntos, setPuntos] = React.useState([]);
  const [image, setImage] = React.useState(null);

  const obtenerItinerarios = async () => {
    try {
      const data = await db.collection("itinerary").get();
      const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const tableRow = [];
      arrayData.forEach(element => {
          tableRow.push({
              id: element.id,
              name: element.name,
              description: element.description.length > 240 ? `${element.description.substring(0, 240)}...` : element.description,
              options: <div className="d-flex"><button className="btn btn-light" onClick={() => loadModalModificarItinerario(element.id)} data-bs-toggle="modal" data-bs-target="#nuevoitinerariomodal">Editar</button><button className="btn btn-danger ms-3" onClick={() => eliminarItinerario(element.id)}>Eliminar</button></div>,
          })
        
      })


      setDatatable({ ...datatable, rows: tableRow })
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerItinerarios();
    obtenerPlantasLugares();
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


  const actualizarPuntos = (p) => {
    setPuntos(p);
  }

  const loadModalModificarItinerario = (id) => {
    setEdit(true);
    obtenerItinerarios();
    db.collection('itinerary').doc(id).get().then(e => {
      const itinerarioInfo = e.data();
      console.log(itinerarioInfo);
      document.getElementById("name").value = itinerarioInfo.name;
      document.getElementById("description").value = itinerarioInfo.description;
      prepararParadas(itinerarioInfo);

      setID(id);
      setName(itinerarioInfo.name);
      setDescription(itinerarioInfo.description);
      
      setImage(itinerarioInfo.image);
    });

  };

  const prepararParadas = async (itinerarioInfo) => {

    let auxPuntos = [];
    try {
      const data = await db.collection("plants").get();
      const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      let infoSelect = [];
      arrayData.forEach((element) => {
        infoSelect.push({ value: element.id, label: element.name });
      });
      setPlantas_Lugares(infoSelect);
      console.log(infoSelect)
      itinerarioInfo.paradas.forEach((parada) => {
        let auxParada = infoSelect.find(
          (element) => element.value === parada.id
          );
          console.log(parada)
          console.log(auxParada);
          
        auxPuntos.push({ value: auxParada.value, label: auxParada.label });
        puntos.push(auxParada);
      });
      setPuntos(auxPuntos);
      document.getElementById("editsortableselect").click()
    } catch (error) {
      console.log(error);
    }
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


  return (
    <div className="background">
      <div className="d-flex justify-content-center mt-5">
        <h1>Itinerarios</h1>
      </div>
      <div className="container d-flex flex-column">
        <div className="d-flex mt-5">
          <button
            className="btn btn-success"
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
        </div> 
        <MDBDataTableV5
                    hover
                    entriesOptions={[5, 10, 20]}
                    entries={5}
                    pagesAmount={4}
                    data={datatable}
                    paging
                    theadColor='elegant-color'
                    theadTextWhite
                    tbodyColor='rgba-grey-strong'
                    searchBottom={true}
                    className="mt-2"
                />
      </div> 
    </div>
  );
};

export default Itineraries;
