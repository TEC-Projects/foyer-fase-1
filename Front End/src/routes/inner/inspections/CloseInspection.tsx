import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Grid, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import SuggestedActionSelector from "../../../components/selector/SuggestedActionSelector";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {useLocation, useNavigate} from "react-router-dom";
import {closeInspection as closeInspectionFunction, planInspection} from "../../../graphQL/Functions/inspection";
import {Actions, CloseInspection as CloseInspectionStructure} from "../../../types/inspection.types";
import FileUploadList from "../../../components/fileUploadList/FileUploadList";
import {DownloadableFile, UploadableFile} from "../../../types/common.types";
import {getSessionData} from "../../../util/sessionDataUtil";

interface OwnProps {}

type Props = OwnProps;

const CloseInspection: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)
    const navigate = useNavigate();
    const location = useLocation()
    const theme = useTheme();

    const [closeInspection, setCloseInspection] = useState<CloseInspectionStructure>({
        id: '',
        suggestedAction: '',
        documentsListing: []
    });

    const suggestedActionChangeHandler = (actionOnChange : Actions | string) : void => {
        setCloseInspection({
            ...closeInspection,
            suggestedAction: actionOnChange,
        })
    }

    const addDocumentListingChangeHandler = (onChangeDocument : File | null) : void => {
        if(onChangeDocument?.type === 'application/pdf'){
            let newDocumentListing:Array<File | null> = [];
            newDocumentListing.push(onChangeDocument)
            setCloseInspection({
                ...closeInspection,
                documentsListing: newDocumentListing
            })
        }else{
            showSnackbar('Por favor adjunte un archivo de formato PDF',  'warning')
        }
    }

    const removeDocumentListingChangeHandler = (onChangeDocument : File | UploadableFile | DownloadableFile | null) : void => {
        setCloseInspection({
            ...closeInspection,
            documentsListing: []
        })
    }

    useEffect(() => {
        setCloseInspection({
            ...closeInspection,
            id: location.state.inspectionId
        })
    }, [location.state]);

    const handleCloseInspection = async () : Promise<void> => {
        try {
            await closeInspectionFunction(apolloClient, closeInspection, getSessionData()?.user.id, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Stack>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>FINALIZAR INSPECCIÓN</Typography>
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant='h6' fontWeight='bold'>Inspección No. {location.state.inspectionId}</Typography>
                            <Typography fontWeight='bold' color={theme.palette.primary.main}>{location.state.toBeInspectedType + ' ' + location.state.toBeInspectedName}</Typography>
                        </Stack>
                        <SuggestedActionSelector value={closeInspection.suggestedAction} changeHandler={suggestedActionChangeHandler}/>
                        <FileUploadList
                            uploadFileType={'application/pdf'}
                            maxUploadCount={1}
                            fileList={closeInspection.documentsListing}
                            addChangeHandler={addDocumentListingChangeHandler}
                            removeChangeHandler={removeDocumentListingChangeHandler}
                        />
                        <Button
                            onClick={handleCloseInspection}
                            variant='contained'
                            sx={{
                                width:'100%',
                                paddingY: 2,
                            }}
                        >PLANIFICAR INSPECCIÓN</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default CloseInspection;
