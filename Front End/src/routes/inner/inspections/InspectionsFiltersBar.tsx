import React, { FunctionComponent } from 'react';
import {Box, Stack, useTheme} from "@mui/material";
import UnderlineButton from "../../../components/buttons/UnderlineButton";
import {InspectionFilters, Status} from "../../../types/inspection.types";
import CustomTextField from "../../../components/fields/CustomTextField";
import StatusSelector from "../../../components/selector/StatusSelector";
import CustomDateField from "../../../components/fields/CustomDateField";

interface OwnProps {
    filtersData: InspectionFilters,
    inspectionIdChangeHandler: (onChangeId:string) => void,
    responsibleIdChangeHandler: (onChangeId:string) => void,
    startDateChangeHandler: (onChangeDate:Date | null) => void,
    endDateChangeHandler: (onChangeDate:Date | null) => void,
    statusChangeHandler: (onChangeStatus:Status) => void,
    clearFilterHandler: () => void,
}

type Props = OwnProps;

const InspectionsFilters: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    return (
        <Box>
            <Stack
                direction='row'
                gap={4}
                sx={{
                    display:'flex',
                    alignItems:'center'
                }}
            >
                <Box
                    sx={{
                        width:'16.66%'
                    }}
                >
                    <CustomTextField value={props.filtersData.inspectionId} label={'Id. de inspección'} changeHandler={props.inspectionIdChangeHandler}/>
                </Box>
                <Box
                    sx={{
                        width:'16.66%'
                    }}
                >
                    <CustomTextField value={props.filtersData.responsibleId} label={'Id. de encargado'} changeHandler={props.responsibleIdChangeHandler}/>
                </Box>
                <Box
                    sx={{
                        width:'16.66%'
                    }}
                >
                    <CustomDateField label={'Fecha de inicio'} value={props.filtersData.startDate} changeHandler={props.startDateChangeHandler} minDate={null} maxDate={null}/>
                </Box>
                <Box
                    sx={{
                        width:'16.66%'
                    }}
                >
                    <CustomDateField label={'Fecha de fin'} value={props.filtersData.endDate} changeHandler={props.endDateChangeHandler} minDate={null} maxDate={null}/>
                </Box>
                <Box
                    sx={{
                        width:'16.66%',
                        marginTop:-1
                    }}
                >
                    <StatusSelector value={props.filtersData.status as Status} changeHandler={props.statusChangeHandler}/>
                </Box>
            </Stack>
            <Box
                sx={{
                    width:'16.66%',
                    marginTop:1,
                }}
            >
                <UnderlineButton label={'Limpiar filtros'} action={props.clearFilterHandler} buttonTextColor={theme.palette.primary.main} buttonBackgroundColor={'white'}/>
            </Box>
        </Box>
    );
};

export default InspectionsFilters;
