import React from 'react'
import { db, storage } from '../firebase/firebase-config'

import moment from 'moment'
import 'moment/locale/es'
import $ from 'jquery'
import 'bootstrap'
import { MDBDataTableV5 } from 'mdbreact';

const Events = () => {

    //listado de eventos
    // const [eventos, setEventos] = React.useState([]);
    // const [items, setList] = React.useState([]);

    //estados de control
    const [loading, setLoading] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [editFechaIni, setEditFechaIni] = React.useState(false);
    const [editFechaFin, setEditFechaFin] = React.useState(false);
    // const [numPaginas, setNumPaginas] = React.useState(1);
    // const [pagActual, setPagActual] = React.useState(1);
    // const [itemActual, setItemActual] = React.useState(0);
    // const [paginas, setPaginas] = React.useState([]);

    //estados para inputs
    const [busqueda, setBusqueda] = React.useState("");
    const [id, setID] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [image, setImage] = React.useState(null);

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
                    label: 'Inicio',
                    field: 'start_date',
                    sort: 'asc',
                    width: 200,
                },
                {
                    label: 'Fin',
                    field: 'end_date',
                    sort: 'asc',
                    width: 100
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



    const obtenerEventos = async () => {

        try {
            const data = await db.collection('events').get();
            // console.log(arrayData);
            const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // setList(arrayData);
            const tableRow = [];
            arrayData.forEach(element => {
                tableRow.push({
                    id: element.id,
                    name: element.name,
                    description: element.description.length > 200 ? `${element.description.substring(0, 200)}...` : element.description,
                    start_date: moment.unix(element.start_date.seconds).format('DD/MM/YYYY'),
                    end_date: moment.unix(element.end_date.seconds).format('DD/MM/YYYY'),
                    options: <div className="d-flex"><button className="btn btn-info" onClick={() => loadModalModificarEvento(element.id)} data-bs-toggle="modal" data-bs-target="#nuevoeventomodal">Editar</button><button className="btn btn-danger ms-3" onClick={() => eliminarEvento(element.id)}>Eliminar</button></div>,
                })
            })


            setDatatable({ ...datatable, rows: tableRow })





        } catch (error) {
            console.log(error);
        }

    }

    React.useEffect(() => {
        obtenerEventos()
    }, []);

    //Funciones asincronas => Consulta a Firebase

    const nuevoEvento = async (e) => {
        e.preventDefault();

        if (new Date(startDate) > new Date(endDate)) {
            setError("La fecha de inicio no puede ser posterior a la de fin")
            return
        }
        try {

            const nuevoEvento = {
                name: name,
                description: description,
                start_date: new Date(startDate),
                end_date: new Date(endDate),
                image: ''
            }

            setLoading(true);
            const ev = await db.collection('events').add(nuevoEvento);

            if (image !== undefined) {
                const imagenRef = storage.ref().child("/images/events").child(ev.id);
                await imagenRef.put(image)
                const imagenURL = await imagenRef.getDownloadURL()
                await db.collection('events').doc(ev.id).update({ image: imagenURL });
            }

            obtenerEventos();

            setLoading(false);
            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setImage('');
            setEditFechaIni(false);
            setEditFechaFin(false);
            setError(null);

            document.getElementById("formularioeventos").reset();
            window.$('#nuevoeventomodal').modal('toggle');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

        } catch (error) {
            console.log(error);
        }
    }

    const eliminarEvento = async (id) => {
        try {
            await db.collection('events').doc(id).delete();
            const imagenRef = storage.ref().child("/images/events").child(id);
            await imagenRef.delete()
            obtenerEventos();

        } catch (error) {
            console.log(error);
        }
    }

    const modificarEvento = async (e) => {
        e.preventDefault();


        try {
            const fecha_ini = editFechaIni ? new Date(startDate) : new Date(startDate.seconds * 1000);
            const fecha_fin = editFechaFin ? new Date(endDate) : new Date(endDate.seconds * 1000);

            if (new Date(fecha_ini) > new Date(fecha_fin)) {
                setError("La fecha de inicio no puede ser posterior a la de fin")
                return
            }

            setLoading(true);
            console.log(id);
            await db.collection('events').doc(id).update({
                name: name,
                description: description,
                start_date: fecha_ini,
                end_date: fecha_fin,
                image: ''
            });

            if (image !== undefined) {
                const imagenRef = storage.ref().child("/images/events").child(id);
                await imagenRef.put(image)
                const imagenURL = await imagenRef.getDownloadURL()
                await db.collection('events').doc(id).update({ image: imagenURL });
            }

            obtenerEventos();

            setLoading(false);
            setEdit(false);
            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setImage('');
            setEditFechaIni(false);
            setEditFechaFin(false);
            setError(null);

            document.getElementById("formularioeventos").reset();
            window.$('#nuevoeventomodal').modal('toggle');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            document.getElementById("busc").value = "";
            setBusqueda("");

        } catch (error) {
            console.log(error);
        }
    }

    //Funciones auxiliares => Formateo y Frontend

    const loadModalModificarEvento = (id) => {
        setEdit(true);
        const data = db.collection('events').doc(id).get().then(e => {

            // console.log(e.data())
            const eventoInfo = e.data()
            // const eventoInfo = datatable.rows.find(item => item.id === id);
            document.getElementById("name").value = eventoInfo.name;
            document.getElementById("description").value = eventoInfo.description;

            // const fecha_inicio = eventoInfo.start_date.split("/");
            const initDate = new Date(eventoInfo.start_date * 1000);
            document.getElementById("startevent").value = `${initDate.getFullYear()}-${('0' + (initDate.getMonth() + 1)).slice(-2)}-${('0' + initDate.getDate()).slice(-2)}`;

            // const fecha_fin = eventoInfo.end_date.split("/");
            const endDate = new Date(eventoInfo.end_date * 1000);
            document.getElementById("endevent").value = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;


            setID(id);
            setName(eventoInfo.name);
            setDescription(eventoInfo.description);
            setStartDate(eventoInfo.start_date);
            setEndDate(eventoInfo.end_date);
            setImage(eventoInfo.image);
        }
        );
        // const info= data.data();
        // const arrayData = data.docs(doc => ({ id: doc.id, ...doc.data() }));
        // console.log(data);

    }

    const cancelarEdit = () => {
        setEdit(false);
        setEditFechaIni(false);
        setEditFechaFin(false);
        setName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setImage('');
        setError(null);

        document.getElementById("formularioeventos").reset();
    }

    const modificarFechaIni = (e) => {
        setStartDate(e.target.value);
        setEditFechaIni(true);
    }

    const modificarFechaFin = (e) => {
        setEndDate(e.target.value);
        setEditFechaFin(true);
    }




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
                                    <h4 className="modal-title">{edit ? 'Editar Evento' : 'Nuevo Evento'}</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => cancelarEdit()}></button>
                                </div>
                                <form id="formularioeventos" onSubmit={e => edit ? modificarEvento(e) : nuevoEvento(e)}>
                                    <div className="modal-body">
                                        {error && (
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        )}
                                        <div className="form-floating mt-3">
                                            <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" maxLength="50" onChange={e => setName(e.target.value.replace(/"/g, "'"))} required></input>
                                            <label htmlFor="name">Nombre</label>
                                        </div>
                                        <div className="form-floating mt-3">
                                            <textarea className="form-control text" id="description" name="description" placeholder="Descripción" onChange={e => setDescription(e.target.value.replace(/"/g, "'"))} required></textarea>
                                            <label htmlFor="description">Descripción</label>
                                        </div>
                                        <div className="d-flex mt-4">
                                            <div className="">
                                                <label className="ms-5 me-2" htmlFor="startevent">Inicio evento: </label>
                                                <input type="date" id="startevent" name="startevent" onChange={e => modificarFechaIni(e)} required></input>
                                            </div>
                                            <div className="ms-auto me-5">
                                                <label className="me-2" htmlFor="endevent">Fin evento: </label>
                                                <input type="date" id="endevent" name="endevent" onChange={e => modificarFechaFin(e)} required></input>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center mt-4">
                                            <label htmlFor="formFile" className="form-label">Imagen: </label>
                                            <input className="form-control w-50 ms-2" type="file" accept="image/*" id="formFile" onChange={e => setImage(e.target.files[0])} required={!edit}></input>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {loading ? (
                                            <button type="submit" className="btn btn-success" value={edit ? 'Editar' : 'Añadir'}>
                                                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Cargando...
                                            </button>
                                        ) : (<input type="submit" className="btn btn-success" value={edit ? 'Editar' : 'Añadir'}></input>)}

                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => cancelarEdit()}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <div className=" ms-auto me-5">
                        <input type="text" id="busc" className="form-control form-control-md text-dark" placeholder="Buscar" onChange={e => buscarEvento(e)} onKeyDown={e => buscarEvento(e)}></input>
                    </div> */}
                </div>

                <MDBDataTableV5
                    hover
                    entriesOptions={[5, 20, 25]}
                    entries={5}
                    pagesAmount={4}
                    data={datatable}
                    paging
                    // searchTop
                    theadColor='elegant-color'
                    theadTextWhite
                    tbodyColor='rgba-grey-strong'
                    searchingLabel=''
                    searchBottom={true}
                    className="table-container mt-2"

                />
                {/* <div className="mt-4 table-container rounded">
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
                                        <td>{e.description.length>200 ?`${e.description.substring(0,200)}...`:e.description}</td>
                                        <td>{moment.unix(e.start_date.seconds).format('DD/MM/YY')}</td>
                                        <td>{moment.unix(e.end_date.seconds).format('DD/MM/YY')}</td>
                                        <td><div className="d-flex"><button className="btn btn-success" onClick={() => loadModalModificarEvento(e.id)} data-bs-toggle="modal" data-bs-target="#nuevoeventomodal">Editar</button><button className="btn btn-danger ms-3" onClick={() => eliminarEvento(e.id)}>Eliminar</button></div></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div> */}
                {/* <nav className="mt-3" aria-label="Page navigation example">
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
                </nav> */}
            </div>
        </div>
    )
}

export default Events
