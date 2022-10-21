import React, {FunctionComponent, useEffect, useState} from 'react';
import {Box} from "@mui/material";
import Header from "../../../components/Header";
import SnackbarMessage from "../../../components/SnackbarMessage";
import DownloadReportButton from "../../../components/buttons/DownloadReportButton";
import {AreasReportBuilder} from "../../../util/reportBuilder/builder";
import {getAreasForReport, getAreasListing} from "../../../graphQL/Functions/area";
import {useApolloClient} from "@apollo/client";
import {AreaListingItem} from "../../../types/area.types";
import AreasList from "./areasList/AreasList";

interface OwnProps {}

type Props = OwnProps;

const Areas: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();

    const [reportData, setReportData] = useState<Array<any>>([]);
    const [areaListing, setAreaListing] = useState<Array<AreaListingItem>>([]);

    const builder:AreasReportBuilder = new AreasReportBuilder(reportData)

    useEffect(() => {
        getAreasForReport(apolloClient).then(res => setReportData(res))
    }, []);

    useEffect(() => {
        getAreasListing(apolloClient, setAreaListing)
    }, []);

    return (
        <Box>
            <Header title={'ÁREAS'}
                    showFirstButton={true}
                    firstButtonNavigationRoute={'add-area'}
                    firstButtonLabel={'AGREGAR AREA'}
                    showSecondButton={false}/>
            <DownloadReportButton reportBuilder={builder}/>
            <AreasList areas={areaListing}/>
            <SnackbarMessage/>
        </Box>
    );
};

export default Areas;
