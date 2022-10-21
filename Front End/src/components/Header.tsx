import React, { FunctionComponent } from 'react';
import {Button, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface OwnProps {
    title:string,
    firstButtonLabel?:string,
    firstButtonNavigationRoute?:string,
    firstButtonParams?:any,
    secondButtonLabel?:string,
    secondButtonNavigationRoute?:string,
    secondButtonParams?:any,
    showFirstButton:boolean
    showSecondButton:boolean
}

type Props = OwnProps;

const Header: FunctionComponent<Props> = (props) => {

    const navigate = useNavigate();

    const titleGridSize = (props.showFirstButton && props.showSecondButton) ? 4 : props.showFirstButton ? 4 : 12

    return (
        <Grid
            container
            spacing={4}
            sx={{
                marginBottom:8,
            }}
        >
            <Grid
                item
                xs={titleGridSize}
            >
                <Typography variant='h4' fontWeight='bold'>{props.title}</Typography>
            </Grid>
            <Grid
                item
                xs={4}
            >
                {
                    props.showSecondButton ?
                        <Button
                            onClick={() => navigate(
                                props.secondButtonNavigationRoute ? props.secondButtonNavigationRoute : '',
                                {state:props.secondButtonParams}
                            )}
                            variant='contained'
                            sx={{
                                width:'100%',
                                height:'100%'
                            }}
                        >{props.secondButtonLabel}</Button>
                        :
                        null
                }
            </Grid>
            <Grid
                item
                xs={4}
            >
                {
                    props.showFirstButton ?
                        <Button
                            onClick={() => navigate(
                                props.firstButtonNavigationRoute ? props.firstButtonNavigationRoute : '',
                                {state:props.firstButtonParams}
                            )}
                            variant='contained'
                            sx={{
                                width:'100%',
                                height:'100%'
                            }}
                        >{props.firstButtonLabel}</Button>
                        :
                        null
                }
            </Grid>
        </Grid>
    );
};

export default Header;
