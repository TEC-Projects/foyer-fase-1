import React, { FunctionComponent } from 'react';
import {Box, Stack, Typography, useTheme} from "@mui/material";
import {Company} from "../../../../types/responsible.types";

interface OwnProps {
    companyData:Company
}

type Props = OwnProps;

const CompaniesListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    return (
        <Stack
            sx={{
                backgroundColor:theme.palette.primary.main,
                borderRadius:1,
                padding:2,
            }}
        >
            <Box sx={{marginBottom:1}}>
                <Typography fontWeight='bold' color='white'>Razón social</Typography>
                <Typography color='white'>{props.companyData.name}</Typography>
            </Box>
            <Box sx={{marginBottom:1}}>
                <Typography fontWeight='bold' color='white'>Identificación</Typography>
                <Typography color='white'>{props.companyData.id}</Typography>
            </Box>
            <Box sx={{marginBottom:1}}>
                <Typography fontWeight='bold' color='white'>Correo electrónico</Typography>
                <Typography color='white'>{props.companyData.email}</Typography>
            </Box>
        </Stack>
    );
};

export default CompaniesListItem;
