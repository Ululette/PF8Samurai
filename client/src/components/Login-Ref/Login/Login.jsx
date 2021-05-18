import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Select,
    TextField,
    MenuItem,
    CircularProgress,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import HealingIcon from '@material-ui/icons/Healing';
import SecurityIcon from '@material-ui/icons/Security';
import 'firebase/auth';
import { useUser } from 'reactfire';
import supabase from '../../../supabase.config.js';
import styles from './Login.module.css';

function Login({ firebase }) {
    const [role, setRole] = useState(10);
    const [doc, setDoc] = useState(40);
    const [input, setInput] = useState({ doc: '', pass: '' });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const userFire = useUser();

    const userData = JSON.parse(localStorage.getItem('userdata'));
    if (userData && userData.role === 'admin' && userFire.data)
        window.location = `/${userData.dni}/admin`;

    if (userData && userData.role === 'medic' && userFire.data)
        window.location = `/${userData.dni}/medic`;

    if (userData && userData.role === 'affiliate' && userFire.data)
        window.location = `/${userData.dni}/affiliate`;

    const handleChange = (event) => {
        const value = event.target.value;
        value <= 30 ? setRole(value) : setDoc(value);
    };

    const handleInput = (event) => {
        const value = event.target.value;
        const id = event.target.id;
        const regex = /^[0-9\b]+$/; // this regex is to accept only numbers
        if (id === 'doc') {
            if ((value === '' || regex.test(value)) && value.length <= 8)
                setInput({
                    ...input,
                    doc: value,
                });
        } else {
            setInput({
                ...input,
                pass: value,
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setInput({ doc: '', pass: '' });
        setLoading(true);
        try {
            let { data: users, error } = await supabase
                .from('users')
                .select('dni, email, role, avatar_url')
                .eq('dni', input.doc);
            if (error) return console.log(error);
            const numRole =
                users[0].role === 'affiliate'
                    ? 10
                    : users[0].role === 'medic'
                    ? 20
                    : 30;
            if (numRole !== role) {
                setLoading(false);
                return setErrors('Usuario y/o contraseña incorrecto.');
            } else {
                setErrors(null);
            }

            if (users[0].role === 'affiliate') {
                let { data: userInfo, error: errorFetchUserInfo } =
                    await supabase
                        .from(`partners`)
                        .select(
                            'name, lastname, family_group, plans (id, name)'
                        )
                        .eq('dni', users[0].dni);

                if (errorFetchUserInfo) {
                    console.log(errorFetchUserInfo);
                    setLoading(false);
                    return alert('Error en fetch user info.');
                }

                const affiliateData = {
                    name: userInfo[0].name,
                    lastname: userInfo[0].lastname,
                    plan_id: userInfo[0].plans.id,
                    plan_name: userInfo[0].plans.name,
                    family_group: userInfo[0].family_group,
                };
                localStorage.setItem(
                    'affiliatedata',
                    JSON.stringify(affiliateData)
                );
            }

            if (users[0].role === 'admin') {
                let { data: userInfo, error: errorFetchUserInfo } =
                    await supabase
                        .from(`admins`)
                        .select('name, lastname, root')
                        .eq('dni', users[0].dni);

                if (errorFetchUserInfo) {
                    console.log(errorFetchUserInfo);
                    setLoading(false);
                    return alert('Error en fetch user info.');
                }

                const adminData = {
                    name: userInfo[0].name,
                    lastname: userInfo[0].lastname,
                    root: userInfo[0].root,
                };
                localStorage.setItem('admindata', JSON.stringify(adminData));
            }

            await firebase
                .auth()
                .signInWithEmailAndPassword(users[0].email, input.pass);

            const dataUser = {
                dni: users[0].dni,
                email: users[0].email,
                role: users[0].role,
                avatar_url: users[0].avatar_url,
            };

            localStorage.setItem('userdata', JSON.stringify(dataUser));
            setLoading(false);
        } catch (error) {
            setErrors('Usuario y/o contraseña incorrecto.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <aside className={styles.header}>
                <h2>¡Bienvenido a Mi Integra Salud!</h2>
                <p>
                    Aqui podras administrar tu informacion, gestionar tramites,
                    recetas, estudios. Todo en un mismo lugar y mucho mas facil.
                </p>
                <NavLink to='/asociate'>
                    <button className={styles.buttonRegister}>Asociate</button>
                </NavLink>
            </aside>
            <form className={styles.formLogin} onSubmit={handleSubmit}>
                <section>
                    <label className={styles.labelRole} htmlFor='role'>
                        Ingresar como:
                    </label>
                    <Select
                        value={role}
                        id='role'
                        className={styles.selectRole}
                        onChange={handleChange}
                    >
                        <MenuItem value={10} className={styles.itemRole}>
                            <PersonIcon />
                            Socio
                        </MenuItem>
                        <MenuItem value={20} className={styles.itemRole}>
                            <HealingIcon />
                            Medico
                        </MenuItem>
                        <MenuItem value={30} className={styles.itemRole}>
                            <SecurityIcon />
                            Admin
                        </MenuItem>
                    </Select>
                </section>

                <img
                    src='../../assets/images/logo.png'
                    alt='Logo Integra.'
                    className={styles.logo}
                />
                {userFire.data ? <p>{userFire.data.email}</p> : null}
                <img
                    src='https://picsum.photos/200'
                    alt='Avatar icon.'
                    className={styles.userPic}
                />
                {role === 20 ? (
                    <p className={styles.matricula}>Bienvenido Doctor</p>
                ) : role === 10 ? (
                    <Select
                        value={doc}
                        className={styles.selectDoc}
                        onChange={handleChange}
                    >
                        <MenuItem value={40}>DNI</MenuItem>
                        <MenuItem value={50}>Pasaporte</MenuItem>
                    </Select>
                ) : (
                    <p className={styles.matricula}>Bienvenido Admin</p>
                )}
                <TextField
                    className={styles.inputData}
                    id='doc'
                    label='Nº de documento'
                    value={input.doc}
                    onChange={handleInput}
                    required
                />
                <TextField
                    className={styles.inputData}
                    id='pass'
                    label='Contraseña'
                    type='password'
                    value={input.pass}
                    onChange={handleInput}
                    required
                />
                {errors ? (
                    <p className={styles.warningLogin}>
                        Usuario y/o contraseña incorrecta
                    </p>
                ) : null}

                {loading ? (
                    <CircularProgress className={styles.progressLoad} />
                ) : (
                    <input
                        className={styles.buttonLogin}
                        type='submit'
                        value='Ingresar'
                    />
                )}
            </form>
        </div>
    );
}

export default Login;