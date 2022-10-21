import React, { FunctionComponent } from 'react';
import {Box, Stack, Typography, useTheme} from "@mui/material";
import {Responsible, Role} from "../../../../types/responsible.types";
import {personnelTypeFormatter, roleFormatter} from "../../../../util/formatterUtil";

interface OwnProps {
    responsibleData:Responsible
}

type Props = OwnProps;

const ResponsibleListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    const formattedRoles = props.responsibleData.role.map((role:Role) => roleFormatter(role))

    return (
        <Stack
            sx={{
                backgroundColor:'#f1f1f1',
                borderRadius:1,
                padding:4,
            }}
        >
            <Box
                sx={{
                    display:'flex',
                    alignItems:'flex-end',
                    marginBottom:2,
                }}
            >
                <Typography variant='h5' fontWeight='bold' sx={{marginRight:2}}>{props.responsibleData.user.name + ' ' + props.responsibleData.user.surname}</Typography>
                <Typography color={theme.palette.primary.main} fontWeight='bold' sx={{paddingBottom:0.2}}>{personnelTypeFormatter(props.responsibleData.type)}</Typography>
            </Box>
            <Typography>Roles: {formattedRoles.toString()}</Typography>
            <Typography>Identificación: {props.responsibleData.user.id}</Typography>
            <Typography>Correo electrónico: {props.responsibleData.user.email}</Typography>
            {
                props.responsibleData.type === 'CONTRACTOR' ? <Typography>Empresa: {props.responsibleData.companyName}</Typography> : null
            }
        </Stack>
    );
};

export default ResponsibleListItem;
