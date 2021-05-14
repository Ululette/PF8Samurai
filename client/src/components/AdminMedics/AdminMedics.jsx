import React, { useState, useEffect } from 'react';
import supabase from '../../supabase.config.js';
import 'firebase/auth';
import AdminMedicEdit from './AdminMedicEdit.jsx';

//styles
import styles from './AdminMedic.module.css';

//icons
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';

// functions
import calculateAge from '../../functions/calculateAge.js';

function AdminMedic() {
    const [listMedics, setListMedics] = useState([]);
    const [medicSpecialities, setMedicSpecialities] = useState([]);
    const [editActive, setEditActive] = useState(false);
    const [medicData, setMedicData] = useState(null);

    const fetchMedics = async () => {
        const { data: medics, error: errorFetchMedics } = await supabase
            .from('medics')
            .select(
                'dni, name, lastname, medic_license, email, phone_number, birthdate, state, profilePic, medical_specialities (id, name)'
            );
        if (errorFetchMedics) return console.log(errorFetchMedics);
        setListMedics(medics);
    };

    const fetchSpecialities = async () => {
        const { data: specialities, error: errorFetchSpecialities } =
            await supabase.from('medical_specialities').select('name, id');
        if (errorFetchSpecialities) return console.log(errorFetchSpecialities);
        setMedicSpecialities(specialities);
    };

    useEffect(() => {
        fetchMedics();
        fetchSpecialities();
        console.log('useRender activated');
    }, []);

    const handleEdit = (medicData) => {
        setMedicData(medicData);
        setEditActive(true);
    };

    const handleDelete = async (medicData) => {
        const confirm = window.confirm(
            `Desea eliminar al medico ${medicData.name} ${medicData.lastname} de la obra social? (Esta accion no se puede deshacer)`
        );
        if (confirm) {
            try {
                await supabase.from('medics').delete().eq('dni', medicData.dni);
            } catch (error) {
                console.log(error);
            }
        }
    };

    if (listMedics.length === 0) return <h2>Cargando...</h2>;
    console.log(listMedics);

    return (
        <div className={styles.container}>
            <h2>Lista de medicos</h2>
            <ul>
                {listMedics.map((el, index) => (
                    <li
                        key={`medic-${index}`}
                        className={styles.medicContainer}
                    >
                        <CreateIcon
                            className={styles.editMedic}
                            onClick={() => handleEdit(el)}
                        />
                        <DeleteIcon
                            className={styles.editMedic}
                            onClick={() => handleDelete(el)}
                        />
                        {el.profilePic ? (
                            <img
                                className={styles.profilePic}
                                src={el.profilePic}
                                alt='Medic profile pic'
                            />
                        ) : null}
                        <p>DNI: {el.dni}</p>
                        <p>Nombre: {el.name}</p>
                        <p>Apellido: {el.lastname}</p>
                        <p>Matricula: {el.medic_license}</p>
                        <p>Edad: {calculateAge(el.birthdate)}</p>
                        <p className={styles.email}>Email: {el.email}</p>
                        <p
                            className={
                                el.state === 'accepted'
                                    ? styles.accepted
                                    : el.state === 'pending'
                                    ? styles.pending
                                    : el.state === 'rejected'
                                    ? styles.rejected
                                    : styles.withdrawn
                            }
                        >
                            Estado: {el.state}
                        </p>
                        <p>Especialidades:</p>
                        <ul>
                            {el.medical_specialities.map(
                                (speciality, index) => (
                                    <li key={`speciality-${index}`}>
                                        {speciality.name}
                                    </li>
                                )
                            )}
                        </ul>
                    </li>
                ))}
            </ul>
            {editActive ? (
                <AdminMedicEdit
                    medicData={medicData}
                    medicSpecialities={medicSpecialities}
                />
            ) : null}
        </div>
    );
}

export default AdminMedic;