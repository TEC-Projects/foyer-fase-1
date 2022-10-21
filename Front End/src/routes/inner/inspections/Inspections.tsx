import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box} from "@mui/material";
import SnackbarMessage from "../../../components/SnackbarMessage";
import Header from "../../../components/Header";
import {getSessionData} from "../../../util/sessionDataUtil";
import {InspectionFilters, InspectionListingItem, Status} from "../../../types/inspection.types";
import InspectionsFiltersBar from "./InspectionsFiltersBar";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {getInspectionsListing} from "../../../graphQL/Functions/inspection";
import InspectionsList from "./inspectionsList/InspectionsList";

interface OwnProps {}

type Props = OwnProps;

const Inspections: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)

    const showButton = getSessionData()?.user.type === 'ADMIN_USER'

    const [inspections, setInspections] = useState<Array<InspectionListingItem>>([]);

    const [filters, setFilters] = useState<InspectionFilters>({
        inspectionId: '',
        responsibleId: '',
        startDate: null,
        endDate: null,
        status: '',
    });


    const handleInspectionIdFilter = (onChangeId:string) : void => {
        setFilters({
            ...filters,
            inspectionId: onChangeId
        })
    }

    const handleResponsibleIdFilter = (onChangeId:string) : void => {
        setFilters({
            ...filters,
            responsibleId: onChangeId
        })
    }

    const handleStartDateFilter = (onChangeDate : Date | null) : void => {
        if(filters.endDate && filters.endDate < (onChangeDate as Date)){
            showSnackbar('Por favor ingresar una fecha de inicio anterior a la de fin', 'warning')
        }else{
            setFilters({
                ...filters,
                startDate: onChangeDate
            })
        }

    }

    const handleEndDateFilter = (onChangeDate : Date | null) : void => {
        if(filters.startDate && filters.startDate > (onChangeDate as Date)){
            showSnackbar('Por favor ingresar una fecha de fin posterior a la de inicio', 'warning')
        }else{
            setFilters({
                ...filters,
                endDate: onChangeDate
            })
        }
    }

    const handleStatusFilter = (onChangeStatus : Status) : void => {
        setFilters({
            ...filters,
            status: onChangeStatus
        })
    }

    const handleClearFilters = () : void => {
        setFilters({
            inspectionId: '',
            responsibleId: '',
            startDate: null,
            endDate: null,
            status: '',
        })
    }

    useEffect(() => {
        try {
            getInspectionsListing(apolloClient, setInspections, filters)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [filters])

    return (
        <Box>
            <Header title={'INSPECCIONES'} showFirstButton={showButton} firstButtonNavigationRoute={'plan-inspection'} firstButtonLabel={'PLANEAR INSPECCIÓN'} showSecondButton={false}/>
            <InspectionsFiltersBar filtersData={filters} inspectionIdChangeHandler={handleInspectionIdFilter} responsibleIdChangeHandler={handleResponsibleIdFilter} startDateChangeHandler={handleStartDateFilter} endDateChangeHandler={handleEndDateFilter} statusChangeHandler={handleStatusFilter} clearFilterHandler={handleClearFilters}/>
            <InspectionsList inspections={inspections}/>
            <SnackbarMessage/>
        </Box>
    );
};

export default Inspections;
