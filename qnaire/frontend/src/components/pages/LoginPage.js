import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, TextField, Grid, Box } from "@mui/material";
import { getToken, setToken } from "../../auth";
import { handleErrors } from "../../network";

const validationSchema = yup.object({
  username: yup.string("Enter your username").required("username is required"),
  password: yup
    .string("Enter your password")
    //.min(8, 'Password should be of minimum 8 characters length')
    .required("Password is required"),
});

export function LoginPage(props) {
  const navigate = useNavigate();

  function login(values) {
    fetch("/api/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => {
        setToken(data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
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
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
          <Box width="100%"></Box>
          <Grid item xs={12} sm={8} lg={4}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Box width="100%"></Box>
          <Grid item xs={12} sm={8} lg={4}>
            {" "}
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Grid>
          <Box width="100%"></Box>
        </Grid>
      </form>
    </div>
  );
}
