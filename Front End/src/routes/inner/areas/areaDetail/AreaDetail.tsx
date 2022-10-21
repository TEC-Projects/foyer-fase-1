import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Grid, Icon, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../../components/buttons/GoBackButton";
import Header from "../../../../components/Header";
import {storyTypeFormatter} from "../../../../util/formatterUtil";
import DownloadableFileList from "../../../../components/downloadableList/DownloadableFileList";
import {useNavigate, useParams} from "react-router-dom";
import {Area} from "../../../../types/area.types";
import {deleteArea, getAreaDetail} from "../../../../graphQL/Functions/area";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";
import {Warning} from "@mui/icons-material";
import CustomTextField from "../../../../components/fields/CustomTextField";
import {getSessionData} from "../../../../util/sessionDataUtil";
import AreaElementList from "./areaElementList/AreaElementList";


interface OwnProps {}

type Props = OwnProps;

const AreaDetail: FunctionComponent<Props> = (props) => {

    const theme = useTheme();
    const apolloClient = useApolloClient()
    const {showSnackbar} = useContext(Context);
    const navigate = useNavigate();
    const {areaId} = useParams()

    const showFirstButton = getSessionData()?.user.type === 'ADMIN_USER';

    const [areaDetail, setAreaDetail] = useState<Area>({
        id: '',
        name: '',
        story: 'FIRST',
        location: '',
        description: '',
        elementListing: [{id: '', name: '', location: ''}],
        imagesListing: [{id: '', name: '', source: '',}],
    });

    const [deleteConfirmation, setDeleteConfirmation] = useState<string>('');

    const handleDeleteArea = async () => {
        try {
            await deleteArea(apolloClient, areaDetail.id, deleteConfirmation, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }


    useEffect(() => {
        try {
            getAreaDetail(apolloClient, setAreaDetail, areaId as string)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])

    return (
        <Box>
            <GoBackButton/>
            <Header
                title={areaDetail.name}
                showFirstButton={showFirstButton}
                firstButtonLabel={'Modificar área'}
                firstButtonNavigationRoute={'modify-area'}
                firstButtonParams={{
                    areaId: areaDetail.id,
                    areaName:areaDetail.name,
                    story: areaDetail.story,
                    location: areaDetail.location,
                    description: areaDetail.description,
                    files:areaDetail.imagesListing,
                }}
                showSecondButton={false}
            />
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Typography fontWeight='bold' color={theme.palette.primary.main} sx={{marginBottom:2}}>Área no. {areaDetail.id}</Typography>
                    <Grid container spacing={4} sx={{marginBottom:4}}>
                        <Grid item xs={4}>
                            <Typography fontWeight='bold'>Localización:<Typography>{storyTypeFormatter(areaDetail.story)}</Typography></Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography fontWeight='bold'>Ubicación exacta:<Typography>{areaDetail.location}</Typography></Typography>
                        </Grid>
                    </Grid>
                    <Typography fontWeight='bold' sx={{marginBottom:8}}>Descripción:<Typography>{areaDetail.description}</Typography></Typography>
                    <AreaElementList elements={areaDetail.elementListing}/>
                    <Stack
                        gap={2}
                        sx={{
                            padding:4,
                            borderRadius:1,
                            border:1,
                            borderColor:'red',
                            marginTop:8
                        }}
                    >
                        <Box sx={{display:'flex', alignItems:'center'}}>
                            <Warning sx={{color:'red', marginRight:2}} />
                            <Typography variant='h5' fontWeight='bold' color='red'>Precaución: eliminar área</Typography>
                        </Box>
                        <Typography>Esta acción es irreversible, borrará tanto el área como los elementos contenidos en la misma y las inspecciones asociadas. Tener precaución.</Typography>
                        <Typography fontWeight='bold'>Por favor digite en el cuadro de texto "Eliminar area: {areaId}"</Typography>
                        <CustomTextField label={'Confirmación'} value={deleteConfirmation} changeHandler={setDeleteConfirmation}/>
                        <Button
                            variant='outlined'
                            color='error'
                            sx={{height:56, width:'33.33%'}}
                            onClick={handleDeleteArea}
                        >Eliminar área</Button>
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant='h5' fontWeight='bold'>Imágenes del área</Typography>
                    <DownloadableFileList downloadableFileList={areaDetail.imagesListing}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AreaDetail;
