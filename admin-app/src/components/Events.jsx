import React from 'react'
import {db,auth,storage} from '../firebase'

import moment from 'moment'
import 'moment/locale/es'

const Events = () => {

    const [eventos,setEventos] = React.useState([]);

    React.useEffect(()=>{
        const obtenerEventos = async () => {

            try{
                const data = await db.collection('events').get();
                const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setEventos(arrayData);

            } catch(error){
                console.log(error);
            }

        }

        obtenerEventos();

    },[]);

    return (
        <div className="background">
            <div className="d-flex justify-content-center mt-5">
                <h1>Eventos</h1>
            </div>
            <div className="container d-flex flex-column">
                <div className="d-flex mt-5">
                    <button className="btn btn-success ms-5" data-bs-toggle="modal" data-bs-target="#nuevoeventomodal">Nuevo Evento</button>
                    <div className="modal fade text-dark" id="nuevoeventomodal">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Nuevo Evento</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <form>
                                    <div className="modal-body">
                                        <div className="form-floating mt-3">
                                            <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" maxLength="50"></input>
                                            <label htmlFor="name">Nombre</label>
                                        </div>
                                        <div className="form-floating mt-3">
                                            <textarea className="form-control" id="description" name="description" placeholder="Descripción" maxLength="200"></textarea>
                                            <label htmlFor="description">Descripción</label>
                                        </div>
                                        <div className="d-flex mt-4">
                                            <div className="">
                                                <label className="ms-5 me-2" htmlFor="startevent">Inicio evento: </label>
                                                <input type="date" id="startevent" name="startevent"></input>
                                            </div>
                                            <div className="ms-auto me-5">
                                                <label className="me-2" htmlFor="endevent">Fin evento: </label>
                                                <input type="date" id="endevent" name="endevent"></input>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center mt-4">
                                            <label htmlFor="formFile" className="form-label">Imagen: </label>
                                            <input className="form-control w-50 ms-2" type="file" accept="image/*" id="formFile"></input>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <input type="submit" className="btn btn-success" value="Añadir"></input>
                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className=" ms-auto me-5">
                        <input type="text" className="form-control form-control-md text-dark" placeholder="Buscar"></input>
                    </div>
                </div>
                <div className="mt-4 contenedor rounded">
                    <table className="table table-striped table-hover">
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
                            {
                                eventos.map(e => (
                                    <tr key={e.id}>
                                        <td>{e.name}</td>
                                        <td>{e.description}</td>
                                        <td>{moment.unix(e.start_date.seconds).format('DD/MM/YY')}</td>
                                        <td>{moment.unix(e.end_date.seconds).format('DD/MM/YY')}</td>
                                        <td><div className="d-flex"><button className="btn btn-success">Editar</button><button className="btn btn-danger ms-3">Eliminar</button></div></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Events
