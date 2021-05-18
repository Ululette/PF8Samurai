import { React, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TextField, Button } from '@material-ui/core';
import TableSpecialities from './TableSpecialities.jsx';
import {
    getMedicSpecialities,
    addSpeciality,
    findSpeciality,
} from '../../../actions/specialities.actions';

const FormSpecialities = () => {
    //---STATES
    const [inputValue, setInputValue] = useState('');
    const [rows, setRows] = useState([]);
    const medic_specialities = useSelector(
        (state) => state.specialities.medic_specialities
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMedicSpecialities());
        setRows(medic_specialities);
    }, [medic_specialities]);

    const handlerChangeInput = (event) => {
        setInputValue(event.target.value);
    };
    const handlerButtonClick = () => {
        //verificar si existe
        let buscado = medic_specialities.find(
            (item) => item.name === inputValue
        );
        if (!buscado) {
            dispatch(addSpeciality(inputValue));
            dispatch(getMedicSpecialities());
            setInputValue('');
            alert(`La especialidad ${inputValue} se agrego con exito.`);
        } else alert(`La especialidad ${inputValue} ya existe.`);
    };

    return (
        <div>
            <TextField
                size='small'
                id='outlined-basic'
                label='speciality'
                variant='outlined'
                onChange={handlerChangeInput}
                value={inputValue}
            />
            <Button
                variant='contained'
                color='primary'
                onClick={handlerButtonClick}
                disabled={!inputValue}
            >
                +
            </Button>
            {rows.length === 0 ? (
                <h2>Loading...</h2>
            ) : (
                <TableSpecialities rows={rows} />
            )}
        </div>
    );
};

export default FormSpecialities;