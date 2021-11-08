import React from 'react'

const Events = () => {
    return (
        <div className="background">
            <div className="d-flex justify-content-center mt-5">
                <h1>Eventos</h1>
            </div>
            <div className="container d-flex flex-column">
                <div className="d-flex mt-5">
                    <button className="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#nuevoeventomodal">Nuevo Evento</button>
                    <div class="modal fade text-dark" id="nuevoeventomodal">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Nuevo Evento</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <form>
                                    <div class="modal-body">
                                        <div className="form-floating mt-3">
                                            <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" maxlength="50"></input>
                                            <label for="name">Nombre</label>
                                        </div>
                                        <div class="form-floating mt-3">
                                            <textarea className="form-control" id="description" name="description" placeholder="Descripción" maxlength="200"></textarea>
                                            <label for="description">Descripción</label>
                                        </div>
                                        <div className="d-flex mt-4">
                                            <div className="">
                                                <label className="ms-5 me-2" for="startevent">Inicio evento: </label>
                                                <input type="date" id="startevent" name="startevent"></input>
                                            </div>
                                            <div className="ms-auto me-5">
                                                <label className="me-2" for="endevent">Fin evento: </label>
                                                <input type="date" id="endevent" name="endevent"></input>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center mt-4">
                                            <label for="formFile" className="form-label">Imagen: </label>
                                            <input className="form-control w-50 ms-2" type="file" id="formFile"></input>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <input type="submit" className="btn btn-success" value="Añadir"></input>
                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class=" ms-auto me-5">
                        <input type="text" className="form-control form-control-md text-dark" placeholder="Buscar"></input>
                    </div>
                </div>
                <div className="mt-4 contenedor rounded">
                    <table class="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Semana de la Ciencia</td>
                                <td>El Real Jardín Botánico (RJB) del Consejo Superior de Investigaciones Científicas (CSIC) se suma una edición más a la gran fiesta de la ciencia y la tecnología que supone la celebración de la denomina...</td>
                                <td>01/11/21</td>
                                <td><div className="d-flex align-items-center align-self-center">14/11/21</div></td>
                                <td><div className="d-flex"><button className="btn btn-success">Editar</button><button className="btn btn-danger ms-3">Eliminar</button></div></td>
                            </tr>
                            <tr>
                                <td>Naturaleza Encencida</td>
                                <td>Descubre una nueva edición de la exitosa Naturaleza Encendida, EXPLORIUM, una experiencia inmersiva y llena de sorpresas que te hará viajar a las profundidades en un viaje sensorial completamente dife...</td>
                                <td>02/11/21</td>
                                <td>16/01/22</td>
                                <td><div className="d-flex"><button className="btn btn-success">Editar</button><button className="btn btn-danger ms-3">Eliminar</button></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Events
