/* import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { teal } from '@material-ui/core/colors';
import { NavLink } from 'react-router-dom';
import styles from './InfoCard.module.css'
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    avatar: {
        backgroundColor: teal ['A100'],
    },
}));

function InfoCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root, styles.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label='plans' className={classes.avatar}>
                        P
                    </Avatar>
                }
                title={props.plan.description}
                subheader={props.plan.price}
            />
            <NavLink
                to={`planDetails/${props.plan.id_plan}`}
                style={{ textDecoration: 'none', color: 'black' }}
            >
                Ver mas
            </NavLink>
            <CardContent>
                <Typography>Cobertura:</Typography>
                <Typography>{props.plan.benefits.benefits_title}</Typography>
                {props.plan.benefits.map((d, index) => (
                    <Typography key={`cardInfo-${index}`}>
                        {d.benefit_description}
                    </Typography>
                ))}
            </CardContent>
        </Card>
    );
} */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './InfoCard.module.css';
import logoNav from '../../assets/images/logo.png';
import { NavLink } from 'react-router-dom';

function InfoCard(props) {
    return (
        <Card className={styles.root}>
            <CardActionArea>
                <CardMedia
                    className={styles.media}
                    image={logoNav}
                    title='Logo'
                />
                <CardContent className={styles.containerData}>
                    <Typography gutterBottom variant='h5'>
                        {props.plan.description}
                    </Typography>
                    <Typography
                        variant='body2'
                        color='textSecondary'
                        component='p'
                    >
                        {props.plan.benefits.benefits_title}
                    </Typography>
                </CardContent>
                <CardContent className={styles.containerData}>
                    <Typography paragraph>Cobertura:</Typography>
                    <Typography paragraph>
                        {props.plan.benefits.benefits_title}
                    </Typography>
                    {props.plan.benefits.map((d, index) => (
                        <Typography key={`cardInfo-${index}`} paragraph>
                            {d.benefit_description}
                        </Typography>
                    ))}
                </CardContent>
            </CardActionArea>
            <CardActions className={styles.popup}>
                <NavLink to={`planDetails/${props.plan.id_plan}`}>
                    <Button size='small' color='primary'>
                        Mas información
                    </Button>
                </NavLink>
            </CardActions>
        </Card>
    );
}

export default InfoCard;
