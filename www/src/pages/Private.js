import Main from "./Main";
import Login from "./Login";
import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Route, Redirect, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import CONFIG from "../configs";
import { useHistory } from "react-router-dom";


export default function Private() {
    const history = useHistory();
    useEffect(() => {
        if (Cookies.get(CONFIG.cookiePasswordCacheKey) !== CONFIG.loginPassword) {
            history.push(CONFIG.goToLogin);
        }
    }, []);

    return (
        <>
            <Router>
                {(Cookies.get(CONFIG.cookiePasswordCacheKey) == CONFIG.loginPassword) ?
                    (
                        <Route path="/app/main" component={Main} />
                    ) : null
                }

            </Router>
        </>
    );
}
