import React from "react";

const Itineraries = () => {
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
                  <h4 className="modal-title">Nuevo Itinerario</h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <form>
                  <div className="modal-body">
                    <div className="form-floating mt-3">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nombre"
                        name="name"
                        maxLength="50"
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
                      ></textarea>
                      <label htmlFor="description">Descripción</label>
                    </div>
                    <div className="row">
                      <div className="form-floating mt-3 col-3">
                        <input
                          type="text"
                          className="form-control"
                          id="itinerario"
                          placeholder="Itinerario"
                          name="itinerario"
                          maxLength="50"
                          list="itinerarios"
                        ></input>
                        <datalist id="itinerarios">
                          <option value="planta 1" />
                          <option value="planta 2" />
                          <option value="planta 3" />
                          <option value="escultura 1" />
                          <option value="escultura 2" />
                        </datalist>
                        <label htmlFor="itinerario">Itinerario</label>
                      </div>
                      <button type="button" class="btn btn-primary btn-sm mt-3 col-2">
                        Add
                      </button>
                    </div>
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
                      value="Añadir"
                    ></input>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
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
              className="form-control form-control-md text-dark"
              placeholder="Buscar"
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
              <tr>
                <td>Árboles Singulares</td>
                <td>
                  Es difícil encontrar una representación de árboles tan diversa
                  como la que reune el Real Jardín Botánico-CSIC. Los ejemplares
                  centenarios que contemplamos han sobrevivido a ciclones,
                  enfermedades, guerras y otros desastres y abandonos. En la
                  actualidad, la colección ...
                </td>
                <td>
                  <div className="d-flex">
                    <button className="btn btn-success">Editar</button>
                    <button className="btn btn-danger ms-3">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Itineraries;
