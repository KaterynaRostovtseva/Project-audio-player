import React from "react";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import PageRegister from "./PageRegister";



const PageMain = (prop) => {

    const isLoggedIn = prop.props;

    return (
        <>
            {isLoggedIn && (
                <Grid container component="main" sx={{ height: '100vh', justifyContent: 'space-around', marginTop: "80px" }}>
                    <CssBaseline />
                    <Typography variant="h4" textAlign="center" sx={{ marginTop: "80px" }}>
                        Ласкаво просимо на сайт!
                    </Typography>
                </Grid>
            )}
            {!isLoggedIn && (
                <Grid container component="main" sx={{ height: '100hv', justifyContent: 'space-around', marginTop: "80px" }}>
                    <CssBaseline />
                    < Typography variant="h4" textAlign="center" marginTop="80px">
                        Ласкаво просимо на сайт!<br/>Будь ласка, увійдіть або зареєструйтесь
                        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <ArrowForwardIcon />
                            </Avatar>
                        </Box>
                    </Typography>
                    <PageRegister />
                </Grid>
            )}
        </>

    )
}

export default PageMain;