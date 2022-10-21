import React, { FunctionComponent } from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {SelectorItem} from "../../types/common.types";

interface OwnProps {
    label: string,
    value: string,
    itemCollection: Array<SelectorItem>
    changeHandler: (e:any) => void,
}

type Props = OwnProps;

const GeneralTypeSelector: FunctionComponent<Props> = (props) => {

    return (
        <FormControl fullWidth sx={{marginTop:1}}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.value}
                label={props.label}
                onChange={(e) => props.changeHandler(e.target.value)}
            >
                {
                    props.itemCollection.map((item: SelectorItem) => {
                        return(
                            <MenuItem value={item.value}>{item.label}</MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
};

export default GeneralTypeSelector;
