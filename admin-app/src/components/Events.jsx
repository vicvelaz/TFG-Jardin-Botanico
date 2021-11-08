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
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Nuevo Evento</h4>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    Modal body..
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                </div>
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
                                <td><div className="d-flex"><button className="btn btn-secondary">Editar</button><button className="btn btn-danger ms-3">Eliminar</button></div></td>
                            </tr>
                            <tr>
                                <td>Naturaleza Encencida</td>
                                <td>Descubre una nueva edición de la exitosa Naturaleza Encendida, EXPLORIUM, una experiencia inmersiva y llena de sorpresas que te hará viajar a las profundidades en un viaje sensorial completamente dife...</td>
                                <td>02/11/21</td>
                                <td>16/01/22</td>
                                <td><div className="d-flex"><button className="btn btn-secondary">Editar</button><button className="btn btn-danger ms-3">Eliminar</button></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Events
