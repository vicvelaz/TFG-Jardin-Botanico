import React from 'react'
import {db,auth,storage} from '../firebase'

import moment from 'moment'
import 'moment/locale/es'

const Events = () => {
    //estados de control
    const [eventos,setEventos] = React.useState([]);
    const [busqueda,setBusqueda] = React.useState(""); 
    const [edit,setEdit] = React.useState(false);

    //estados para inputs
    const [id,setID] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startDate, setStartDate] = React.useState({});
    const [endDate, setEndDate] = React.useState({});
    const [image, setImage] = React.useState("");
    
    
    

    const obtenerEventos = async () => {

        try{
            const data = await db.collection('events').get();
            const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setEventos(arrayData);

        } catch(error){
            console.log(error);
        }

    }

    React.useEffect(()=>{
    
        obtenerEventos();

    },[]);

    const nuevoEvento = async(e) => {
        e.preventDefault();
        if(!name.trim()||!startDate.trim()||!endDate.trim()){
            console.log("Los campos están vacios")
            return
        }
        try {

            const nuevoEvento = {
                name: name,
                description: description,
                start_date: new Date(startDate),
                end_date: new Date(endDate),
                image: image
            }

            const data = await db.collection('events').add(nuevoEvento);

            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setImage('');
            setEventos([
                ...eventos,{...nuevoEvento, id: data.id}
            ])
            document.getElementById("formularioeventos").reset();

        } catch (error) {
            console.log(error);
        }
    }

    const eliminarEvento = async (id) =>
    {
        try {
            
            await db.collection('events').doc(id).delete();
            const arrayFiltrado = eventos.filter(item => item.id !== id);
            setEventos(arrayFiltrado);

        } catch (error) {
            console.log(error);
        }
    }

    const loadModalModificarEvento = (id) => {
        setEdit(true);
        const eventoInfo = eventos.find(item => item.id === id);

        document.getElementById("name").value = eventoInfo.name;
        document.getElementById("description").value = eventoInfo.description;
        const fecha_inicio = new Date (eventoInfo.start_date.seconds*1000);
        document.getElementById("startevent").value = `${fecha_inicio.getFullYear()}-${fecha_inicio.getMonth()+1}-${fecha_inicio.getDate()}`;
        const fecha_fin = new Date (eventoInfo.end_date.seconds*1000);
        document.getElementById("endevent").value = `${fecha_fin.getFullYear()}-${fecha_fin.getMonth()+1}-${fecha_fin.getDate()}`;
        
        setID(eventoInfo.id);
        setName(eventoInfo.name);
        setDescription(eventoInfo.description);
        setStartDate(eventoInfo.start_date);
        setEndDate(eventoInfo.end_date);
        setImage(eventoInfo.image);
    }

    const cancelarEdit = () => {
        setEdit(false);
        setName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setImage('');
            
        document.getElementById("formularioeventos").reset();
    }

    const modificarEvento = async(e) => {
        e.preventDefault();
        if(name===""||startDate===""||endDate===""){
            console.log("Los campos están vacios");
            return
        }
        try {
            await db.collection('events').doc(id).update({
                name: name,
                description: description,
                start_date: new Date(startDate.seconds*1000),
                end_date: new Date(endDate.seconds*1000),
                image: image
            });

            const arrayEditado = eventos.map(item => (
                item.id === id ? {id:item.id, name:name,description:description,start_date:startDate,end_date:endDate,image:image } : item
            ));

            setEventos(arrayEditado);
            setEdit(false);
            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setImage('');
            
            document.getElementById("formularioeventos").reset();
            
        } catch (error) {
            console.log(error);
        } 
    }

    const buscarEvento = (e) => {
        setBusqueda(e.target.value);
        if(busqueda === ""){
            obtenerEventos();
        }else{
            setEventos(eventos.filter(ev => ev.name.includes(busqueda)));
        }
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
                                        <div className="form-floating mt-3">
                                            <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" maxLength="50" onChange={e => setName(e.target.value)}></input>
                                            <label htmlFor="name">Nombre</label>
                                        </div>
                                        <div className="form-floating mt-3">
                                            <textarea className="form-control" id="description" name="description" placeholder="Descripción" maxLength="200" onChange={e => setDescription(e.target.value)}></textarea>
                                            <label htmlFor="description">Descripción</label>
                                        </div>
                                        <div className="d-flex mt-4">
                                            <div className="">
                                                <label className="ms-5 me-2" htmlFor="startevent">Inicio evento: </label>
                                                <input type="date" id="startevent" name="startevent" onChange={e => setStartDate(e.target.value)}></input>
                                            </div>
                                            <div className="ms-auto me-5">
                                                <label className="me-2" htmlFor="endevent">Fin evento: </label>
                                                <input type="date" id="endevent" name="endevent" onChange={e => setEndDate(e.target.value)}></input>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center mt-4">
                                            <label htmlFor="formFile" className="form-label">Imagen: </label>
                                            <input className="form-control w-50 ms-2" type="file" accept="image/*" id="formFile" onChange={e => setImage(e.target.value)}></input>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <input type="submit" className="btn btn-success" data-bs-dismiss="modal" value={edit ? 'Editar':'Añadir'}></input>
                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => cancelarEdit()}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className=" ms-auto me-5">
                        <input type="text" className="form-control form-control-md text-dark" placeholder="Buscar" onChange={e => buscarEvento(e)} onKeyDown={e => buscarEvento(e)}></input>
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
                                        <td><div className="d-flex"><button className="btn btn-success" onClick={() => loadModalModificarEvento(e.id)} data-bs-toggle="modal" data-bs-target="#nuevoeventomodal">Editar</button><button className="btn btn-danger ms-3" onClick={() => eliminarEvento(e.id)}>Eliminar</button></div></td>
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
