import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik, useFormik } from "formik";
import * as yup from "yup";
import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { POST } from "../request";
import FTextField from "./formik/FTextField";
import { useAppContext } from "../providers/AppContextProvider";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = yup.object({
  username: yup
    .string("Zadejte uživatelské jméno")
    .required("Uživatelské jméno nesmí být prázdné"),
  password: yup
    .string("Zadejte heslo")
    //.min(8, 'Password should be of minimum 8 characters length')
    .required("Heslo nesmí být prázdné"),
});

export function LoginPage({ auth }) {
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();
  const { setPageActions, setDrawerDisabled } = useAppContext();

  useEffect(() => {
    setPageActions([]);
    setDrawerDisabled(true);

    return () => {
      setDrawerDisabled(false);
    }
  }, []);

  function login(values) {
    POST("auth", values, false)
      .then((data) => {
        auth.authenticate(data);
      })
      .catch((err) => {
        setErrorText("Nesprávné údaje.");
      });
  }

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/questionnaires/");
    }
  }, [auth.isAuthenticated]);

  return (
    <Formik
      onSubmit={login}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Form>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} lg={4}>
            <FTextField name="username" label="Uživatelské jméno" />
          </Grid>
          <Box width="100%"></Box>
          <Grid item xs={12} sm={8} lg={4} mt={2}>
            <FTextField name="password" label="Heslo" type="password" />
          </Grid>
          <Box width="100%"></Box>
          <Grid item xs={12} sm={8} lg={4} mt={2}>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Přihlásit se
            </Button>
          </Grid>
          <Box width="100%"></Box>
          <Grid item xs={12} sm={8} lg={4} mt={2}>
            <Typography color="error" textAlign="center">
              {errorText}
            </Typography>
          </Grid>
          <Box width="100%"></Box>
        </Grid>
      </Form>
    </Formik>
  );
}
