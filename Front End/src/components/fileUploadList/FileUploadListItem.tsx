import React, {FunctionComponent, useEffect} from 'react';
import {Box, Stack, IconButton, Typography} from "@mui/material";
import {InsertDriveFile, Image, Close} from "@mui/icons-material";
import {fileNameFormatter} from "../../util/formatterUtil";
import {DownloadableFile, UploadableFile} from "../../types/common.types";

interface OwnProps {
    fileData:File | UploadableFile | DownloadableFile | null
    removeChangeHandler: (onChangeFile: File | UploadableFile | DownloadableFile | null) => void,
    isElementField?:Boolean,
    elementIdChangeHandler?:Function,
    currentElementId?:number,
    backgroundColor?:string | null,
}

type Props = OwnProps;

const FileUploadListItem: FunctionComponent<Props> = (props) => {

    const fileIcon = (props.fileData as File)?.type === 'application/pdf' ? <InsertDriveFile/> : <Image/>
    const buttonBackgroundColor = props.backgroundColor ? props.backgroundColor : '#f1f1f1'

    useEffect(() => {
        if(props.isElementField && props.elementIdChangeHandler){
            props.elementIdChangeHandler(props.currentElementId)
        }
    }, []);

    return (
        <Stack
            sx={{
                width:100,
                height:100,
                borderRadius:1,
                backgroundColor:buttonBackgroundColor,
                display:'flex',
                padding:1,
            }}
        >
            <IconButton
                sx={{alignSelf:'flex-end', width:25, height:25}}
                aria-label="upload picture"
                component="label"
                onClick={() => props.removeChangeHandler(props.fileData)}>
                <Close/>
            </IconButton>
            <Stack
                sx={{display:'flex', alignItems:'center', justifyContent:'center'}}
            >
                {fileIcon}
                <Typography>{fileNameFormatter(props.fileData?.name as string, 10)}</Typography>
            </Stack>
        </Stack>
    );
};

export default FileUploadListItem;
