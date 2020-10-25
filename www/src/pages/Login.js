import React, { useMemo, useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";
import CONFIG from "../configs";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const classes = useStyles();

    const history = useHistory();
    useEffect(() => {
        if (Cookies.get(CONFIG.cookiePasswordCacheKey) == CONFIG.loginPassword) {
            history.push(CONFIG.goToPage);
        }
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Username"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        defaultValue={email}
                        onChange={event => {
                            const { value } = event.target;
                            setEmail(value);
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        defaultValue={password}
                        onChange={event => {
                            const { value } = event.target;
                            setPassword(value);
                        }}
                    />

                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => {
                            if (email == 'admin' && password == CONFIG.loginPassword) {
                                Cookies.remove(CONFIG.cookiePasswordCacheKey);
                                Cookies.set(CONFIG.cookiePasswordCacheKey, password, { expires: (CONFIG.credentialExpiredTime / (24 * 60)) });
                                history.push(CONFIG.goToPage);
                            } else {
                                alert('Failed!');
                            }
                        }}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
            <Box mt={8}>
                {/* <Copyright /> */}
            </Box>
        </Container>
    );
}