import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { POST } from "../../request";

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


  function login(values) {
    POST("auth", values, false)
      .then((data) => {
        auth.authenticate(data);
      })
      .catch((err) => {
        setErrorText("Nesprávné údaje.");
      });
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: login,
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} lg={4}>
            {" "}
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Uživatelské jméno"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
          <Box width="100%"></Box>
          <Grid item xs={12} sm={8} lg={4} mt={2}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Heslo"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Box width="100%"></Box>
          <Grid item xs={12} sm={8} lg={4} mt={2}>
            {" "}
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
      </form>
    </div>
  );
}
