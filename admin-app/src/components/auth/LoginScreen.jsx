import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from '../../hooks/useForm';
import { startLoginEmailPassword } from '../../actions/auth';


export const LoginScreen = () => {

    const dispatch = useDispatch();
    const { loading } = useSelector( state => state.ui );

    const [ formValues, handleInputChange ] = useForm({
        email: '',
        password: ''
    });

    const { email, password } = formValues;

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch( startLoginEmailPassword( email, password ) );
    }


    return (
        <>
            <h3 className="title-auth">Inicio de sesión</h3>

            <form onSubmit={ handleLogin }>

                <input 
                    type="text"
                    placeholder="Email"
                    name="email"
                    className="input-auth"
                    autoComplete="off"
                    value={ email }
                    onChange={ handleInputChange }
                />

                <input 
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    className="input-auth"
                    value={ password }
                    onChange={ handleInputChange }
                />


                <button
                    type="submit"
                    className="btn btn-primary mt-2"
                    disabled={ loading }
                >
                    Iniciar sesión
                </button>

            


            </form>
        </>
    )
}
