import React, { FunctionComponent } from 'react';
import {Stack} from "@mui/material";
import FileUploadListItem from "./FileUploadListItem";
import UploadButton from "./UploadButton";
import {DownloadableFile, UploadableFile} from "../../types/common.types";

interface OwnProps {
    uploadFileType:string,
    maxUploadCount:number,
    fileList:Array<File | UploadableFile | DownloadableFile | null>,
    addChangeHandler: (onChangeFile: File | null, onChangeElementId?:number) => void
    removeChangeHandler: (onChangeFile: File | UploadableFile | DownloadableFile | null, onChangeElementId?:number) => void,
    elementIdChangeHandler?:Function,
    currentElementId?:number,
}

type Props = OwnProps;

const FileUploadList: FunctionComponent<Props> = (props) => {

    return (
        <Stack direction='row' gap={4}>
            {
                props.fileList.map((file ) => {
                    return (<FileUploadListItem
                        fileData={file}
                        removeChangeHandler={props.removeChangeHandler}
                        isElementField={true}
                        elementIdChangeHandler={props.elementIdChangeHandler}
                        currentElementId={props.currentElementId}
                        backgroundColor={props.currentElementId ? '#d1d1d1' : null}
                    />);
                })
            }
            {
                props.fileList.length < props.maxUploadCount ?
                    <UploadButton
                        fileType={props.uploadFileType}
                        addChangeHandler={props.addChangeHandler}
                        isElementField={true}
                        elementIdChangeHandler={props.elementIdChangeHandler}
                        currentElementId={props.currentElementId}
                    />
                    :
                null
            }
        </Stack>
    );
};

export default FileUploadList;
