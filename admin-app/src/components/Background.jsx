import React from 'react'
import {Link} from 'react-router-dom'

const Background = () => {
    return (
        <div className="background">
            <div className="container mt-5 w-75">
                <div className="row justify-content-center mt-5">
                    <div className="col justify-content-center mt-5">
                        <div className="row justify-content-center mt-5">
                            <div className="col justify-content-center mt-5 w-50">
                                <h1 className="ms-3">Bienvenido a la aplicación de administración del</h1>
                                <h1 className="ms-3">Real Jardín Botánico de Madrid</h1>
                            </div>
                        </div>
                        <div className="container mt-5">
                            <div className="row justify-content-start">
                                <div className="col-3">
                                    <Link to="/events">
                                        <button className="btn btn-success btn-lg">Eventos</button>
                                    </Link>
                                </div>
                                <div className="col-4">
                                    <Link to="/plants">
                                        <button className="btn btn-success btn-lg">Plantas y Lugares</button>
                                    </Link>
                                    
                                </div>
                                <div className="col-4">
                                    <Link to="/itineraries">
                                        <button className="btn btn-success btn-lg">Itinerarios</button>
                                    </Link>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Background
