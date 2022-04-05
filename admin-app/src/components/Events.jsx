import React from 'react'
import {db,storage} from '../firebase/firebase-config'

import moment from 'moment'
import 'moment/locale/es'
import $ from 'jquery'
import 'bootstrap'

const Events = () => {

    //listado de eventos
    const [eventos,setEventos] = React.useState([]);
    const [items, setList] = React.useState([]);

    //estados de control
    const [loading,setLoading] = React.useState(false);
    const [edit,setEdit] = React.useState(false);
    const [error,setError] = React.useState(null);
    const [editFechaIni,setEditFechaIni] = React.useState(false);
    const [editFechaFin,setEditFechaFin] = React.useState(false);
    const [numPaginas, setNumPaginas] = React.useState(1);
    const [pagActual, setPagActual] = React.useState(1);
    const [itemActual, setItemActual] = React.useState(0);
    const [paginas, setPaginas] = React.useState([]);

    //estados para inputs
    const [busqueda,setBusqueda] = React.useState(""); 
    const [id,setID] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [image, setImage] = React.useState(null);
    

    const obtenerEventos = async () => {

        try{
            const data = await db.collection('events').get();
            const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setList(arrayData);
            setNumPaginas(arrayData.length % 5 === 0 ? (arrayData.length / 5) : (Math.trunc(arrayData.length / 5)) + 1);
            setEventos(arrayData.slice(0, 5));
            setItemActual(itemActual + 5);
            let pag = Array.from({length: numPaginas}, (_, index) => index + 1);
            setPaginas(pag);

        } catch(error){
            console.log(error);
        }

    }

    React.useEffect(()=>{obtenerEventos()},[]);

    //Funciones asincronas => Consulta a Firebase

    const nuevoEvento = async(e) => {
        e.preventDefault();

        if(new Date(startDate) > new Date(endDate)){
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

            if(image !== undefined){
                const imagenRef = storage.ref().child("/images/events").child(ev.id);
                await imagenRef.put(image)
                const imagenURL = await imagenRef.getDownloadURL()
                await db.collection('events').doc(ev.id).update({image: imagenURL});
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

    const eliminarEvento = async (id) =>
    {
        try {
            await db.collection('events').doc(id).delete();
            const imagenRef = storage.ref().child("/images/events").child(id);
            await imagenRef.delete()
            obtenerEventos();

        } catch (error) {
            console.log(error);
        }
    }

    const modificarEvento = async(e) => {
        e.preventDefault();
        
        try {
            const fecha_ini = editFechaIni ? new Date (startDate) : new Date (startDate.seconds*1000);
            const fecha_fin = editFechaFin ? new Date (endDate) : new Date (endDate.seconds*1000);

            if(new Date(fecha_ini) > new Date(fecha_fin)){
                setError("La fecha de inicio no puede ser posterior a la de fin")
                return
            }

            setLoading(true);

            await db.collection('events').doc(id).update({
                name: name,
                description: description,
                start_date: fecha_ini,
                end_date: fecha_fin,
                image: ''
            });

            if(image !== undefined){
                const imagenRef = storage.ref().child("/images/events").child(id);
                await imagenRef.put(image)
                const imagenURL = await imagenRef.getDownloadURL()
                await db.collection('events').doc(id).update({image: imagenURL});
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
        const eventoInfo = eventos.find(item => item.id === id);

        document.getElementById("name").value = eventoInfo.name;
        document.getElementById("description").value = eventoInfo.description;
        const fecha_inicio = new Date (eventoInfo.start_date.seconds*1000);
        document.getElementById("startevent").value = `${fecha_inicio.getFullYear()}-${('0' + (fecha_inicio.getMonth()+1)).slice(-2)}-${('0' + fecha_inicio.getDate()).slice(-2)}`;
        const fecha_fin = new Date (eventoInfo.end_date.seconds*1000);
        document.getElementById("endevent").value = `${fecha_fin.getFullYear()}-${('0' + (fecha_fin.getMonth()+1)).slice(-2)}-${('0' + fecha_fin.getDate()).slice(-2)}`;
        
        setID(eventoInfo.id);
        setName(eventoInfo.name);
        setDescription(eventoInfo.description);
        setStartDate(eventoInfo.start_date);
        setEndDate(eventoInfo.end_date);
        setImage(eventoInfo.image);

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

    const modificarFechaIni= (e) => {
        setStartDate(e.target.value);
        setEditFechaIni(true);
    }

    const modificarFechaFin = (e) => {
        setEndDate(e.target.value);
        setEditFechaFin(true);
    }

    const buscarEvento = (e) => {
        setBusqueda(e.target.value);
        if(busqueda === ""){
            obtenerEventos();
        }else{
            setEventos(items.filter(ev => ev.name.includes(busqueda)));
        }
    }

    const siguientePagina = () => {
        if(pagActual !== numPaginas){
            let ia = itemActual + 5;
            setItemActual(ia);
            setEventos(items.slice(itemActual, ia));
            setPagActual(pagActual + 1);
        }
    }

    const paginaAnterior = () => {
        if(pagActual !== 1){
            let ia = itemActual - 5;
            const itt = ia - 5;
            setItemActual(ia);
            setEventos(items.slice(itt, ia));
            setPagActual(pagActual - 1);
        } 
    }

    const irAPagina = (pag) => {
        const it = pag * 5;
        const itt = it - 5;
        setItemActual(it);
        setEventos(items.slice(itt,it));
        setPagActual(pag);
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
                                    <h4 className="modal-title">{edit ? 'Editar Evento':'Nuevo Evento'}</h4>
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
                                            <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" maxLength="50" onChange={e => setName(e.target.value.replace(/"/g,"'"))} required></input>
                                            <label htmlFor="name">Nombre</label>
                                        </div>
                                        <div className="form-floating mt-3">
                                            <textarea className="form-control texto" id="description" name="description" placeholder="Descripción"  onChange={e => setDescription(e.target.value.replace(/"/g,"'"))} required></textarea>
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
                                            <button type="submit" className="btn btn-success" value={edit ? 'Editar':'Añadir'}>
                                                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Cargando...
                                            </button>
                                        ):(<input type="submit" className="btn btn-success" value={edit ? 'Editar':'Añadir'}></input>)}

                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => cancelarEdit()}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className=" ms-auto me-5">
                        <input type="text" id="busc" className="form-control form-control-md text-dark" placeholder="Buscar" onChange={e => buscarEvento(e)} onKeyDown={e => buscarEvento(e)}></input>
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
                                        <td>{e.description.length>200 ?`${e.description.substring(0,200)}...`:e.description}</td>
                                        <td>{moment.unix(e.start_date.seconds).format('DD/MM/YY')}</td>
                                        <td>{moment.unix(e.end_date.seconds).format('DD/MM/YY')}</td>
                                        <td><div className="d-flex"><button className="btn btn-success" onClick={() => loadModalModificarEvento(e.id)} data-bs-toggle="modal" data-bs-target="#nuevoeventomodal">Editar</button><button className="btn btn-danger ms-3" onClick={() => eliminarEvento(e.id)}>Eliminar</button></div></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <nav className="mt-3" aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        <li className={pagActual === 1 ? "page-item disabled" : "page-item"} onClick={() => paginaAnterior()}>
                            <a className={pagActual === 1 ? "page-link deshabilitado" : "page-link clickable"}>Anterior</a>
                        </li>
                        {paginas.map((e) =>
                            <li className={pagActual === e ? "page-item active" : "page-item"} key={e} onClick={() => irAPagina(e)}> 
                                <a className="page-link clickable">{e}</a> 
                            </li>
                        )}
                        
                        <li className={pagActual === numPaginas ? "page-item disabled" : "page-item"} onClick={() => siguientePagina()}>
                            <a className={pagActual === numPaginas ? "page-link deshabilitado" : "page-link clickable"}>Siguiente</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Events
