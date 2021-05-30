import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import blue from '@material-ui/core/colors/blue'
import 'firebase/auth';
import Swal from 'sweetalert2';
import { Avatar } from '@material-ui/core';
import supabase from '../../../supabase.config';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'results',
        numeric: false,
        disablePadding: false,
        label: 'Resultados',
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Fecha',
    },
    {
        id: 'study_name',
        numeric: false,
        disablePadding: false,
        label: 'Estudio',
    },
    { id: 'namePartner', numeric: false, disablePadding: true, label: 'Paciente' },
    { id: 'dni', numeric: false, disablePadding: true, label: 'DNI' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Médico' },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Estado',
    },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead className={classes.title}>
            <TableRow>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={`${headCell.id}-${index}`}
                        align='left'
                        padding='default'
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            className={classes.title}
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

//------------------------makeStyle1---------------------------------------------------------------------------------------
const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
        backgroundColor: lighten('#34a7a1', 0.3), 
        
        //color barra superior '
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: '#fafafa',
                backgroundColor: lighten(blue[500], 0.5),//color barra superior cuando selecciono item
                fontWeight:'bold',
                fontSize:'30px'
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: lighten('#34a7a1', 0.3),
                
            },
    title: {
        flex: '1 1 100%',
        fontWeight:'bold',
        fontSize:'1.4rem',
        color: '#fafafa',
        textAlign:'center'
    },
    filters:{
        display:'flex'
    },
    iconFilter:{
        color:'#fafafa',
        fontWeight:'bold',
        '&:hover':{
            backgroundColor: '#34a7a1',
        }
    },
    iconBlock:{
        color:'#fafafa',
        fontWeight:'bold',
        '&:hover':{
            backgroundColor: lighten('#34a7a1', 0.8),
        }
    }
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, setToShowRows} = props;
    let userFamilyGroup = JSON.parse(localStorage.getItem('affiliatedata')).family_group;

    
    const fetchOrders = async () => {
        try {
            const { data: orders, error: dataError } = await supabase
                .from('orders')
                .select(`study_name,date,status(name),results,partners(dni, name, lastname, family_group),medics(name,lastname)`)
                // .eq('partner_dni',userDni)
            console.log(orders);
            console.log(dataError, 'error');
            setToShowRows(
                orders.filter(
                    (el) => el.partners.family_group === userFamilyGroup
                )
            );
        } catch (err) {
            return err;
        }
    };

    useEffect(async()=>{
        fetchOrders()
    },[]);

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Typography
                className={classes.title}
                variant='h6'
                id='tableTitle'
                component='div'
            >
                Mis autorizaciones
            </Typography>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};


//-------------------- EnhancedTableToolbar Style
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'relative',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
        
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    },
    title:{
        color:'#212121',
        fontWeight: 'bold',
        backgroundColor: lighten('#34a7a1', 0.6)
    },
    rowColor:{
        backgroundColor: lighten('#e0e0e0', 0.3),
        ':checked':{
            color:blue[500]
        }
    },
    iconFilter:{
        color:'rgba(0, 0, 0, 0.47)',
        fontWeight:'bold',
        '&:hover':{
            backgroundColor: lighten('#34a7a1', 0.8),
        }
    }
}));

export default function MyOrders() {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [toShowRows, setToShowRows] = React.useState([]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = toShowRows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    toShowRows.length>14?console.log('16 medicos'):console.log(toShowRows)

    const emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, toShowRows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    setToShowRows={setToShowRows}
                />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby='tableTitle'
                        size='small'
                        aria-label='enhanced table'
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={toShowRows.length}
                        />
                        <TableBody>
                            {stableSort(
                                toShowRows,
                                getComparator(order, orderBy)
                            )
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    let medicName = `${row.medics.name} ${row.medics.lastname}`
                                    let patientName=`${row.partners.name} ${row.partners.lastname}`
                                    return (
                                        <TableRow
                                            hover
                                            // onClick={(event) => handleClick(event, row.name)}
                                            role='checkbox'
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell align='left' className={index%2 ===1 ? classes.rowColor :null}>
                                                <Tooltip title='Resultados' className={classes.iconFilter}>
                                                    <IconButton aria-label='Resultados' >
                                                        <InfoIcon
                                                            // onClick={() =>
                                                            //     handleInfo(row)
                                                            // }
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align='left' className={index%2 ===1 ? classes.rowColor :null}>
                                                    {row.date}
                                            </TableCell>
                                            <TableCell
                                                className={index%2 ===1 ? classes.rowColor :null}
                                                component='th'
                                                id={labelId}
                                                scope='row'
                                                padding='default'
                                            >
                                                {row.study_name}
                                            </TableCell>
                                            <TableCell align='left' className={index%2 ===1 ? classes.rowColor :null}>  
                                                {patientName}
                                            </TableCell>
                                            <TableCell align='left' className={index%2 ===1 ? classes.rowColor :null}>  
                                                {row.partners.dni}
                                            </TableCell>
                                            <TableCell align='left' className={index%2 ===1 ? classes.rowColor :null}>
                                                {medicName}
                                            </TableCell>
                                            <TableCell align='left' className={index%2 ===1 ? classes.rowColor :null}>
                                                {row.status.name}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 33 * emptyRows }}>
                                    <TableCell colSpan={10} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    className={classes.root}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    component='div'
                    count={toShowRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}