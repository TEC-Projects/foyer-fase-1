import React, { FunctionComponent } from 'react';
import blackLogo from "../../assets/identity/black_main_logo.svg";
import {Link, useNavigate} from "react-router-dom";
import {Box, Stack} from "@mui/material";
import UnderlineButton from "../../buttons/UnderlineButton";
import {NavMenuItem, SessionData} from "../../../types/common.types";
import {getAdminNavItems, getOperativeNavItems} from "./menuItemsPerUserType";
import {getSessionData} from "../../../util/sessionDataUtil";

interface OwnProps {}

type Props = OwnProps;

const OuterNavBar: FunctionComponent<Props> = (props) => {

    const navigate = useNavigate();

    const sessionData : SessionData | null | undefined = getSessionData();

    const navItems : Array<NavMenuItem> = sessionData?.user.type === 'OPERATIVE_USER' ? getOperativeNavItems(navigate) :  sessionData?.user.type === 'ADMIN_USER' ? getAdminNavItems(navigate) : [] ;

    return (
        <Stack
            direction='row'
            gap={4}
        >
            {
                navItems.map((item) => {
                    return(
                        <UnderlineButton buttonBackgroundColor='black' buttonTextColor='white' action={item.action} label={item.label}/>
                    );
                })
            }
        </Stack>
    );
};

export default OuterNavBar;
