import {ToBeInspectedReference} from "./area.types";
import {DownloadableFile, UploadableFile} from "./common.types";

type Status = 'TO_PROCEED' | 'IN_PROGRESS' | 'EXECUTED' | 'EXECUTED_LATE' | 'LATE'
type Actions = 'INSPECTION' | 'RESTORATION' | 'CONSERVATION'

type InspectionListingItem = {
    id:string,
    toBeInspected: ToBeInspectedReference,
    responsible: {
        name: string,
        id: string,
    },
    status: Status,
    startDate: Date,
    endDate: Date,
}

type InspectionUpdate = {
    authorName: string,
    date: Date,
}

type Inspection = {
    id:string,
    toBeInspected: ToBeInspectedReference | undefined,
    responsible: {
        name: string,
        id: string
    },
    status: Status | undefined,
    startDate: Date,
    endDate: Date,
    closeDate:Date | undefined | null,
    suggestedAction: Actions | null,
    updateLog: Array<InspectionUpdate>,
    documentsListing: Array<DownloadableFile>,
}

type PlanModifyInspection = {
    id?:string,
    startDate:Date | null,
    endDate:Date | null,
    areaId?:string,
    elementId?:string | null,
    responsibleId:string,
    suggestedAction?: Actions | null,
    isClosed?:boolean,
    files?: Array<UploadableFile | File | null> | null,
}

type CloseInspection = {
    id:string,
    suggestedAction: Actions | string,
    documentsListing: Array<File | null>
}

type InspectionFilters = {
    inspectionId:string,
    responsibleId:string,
    startDate:Date | null,
    endDate:Date | null,
    status:Status | string | undefined,
}

export type {
    InspectionListingItem,
    InspectionUpdate,
    Inspection,
    Status,
    Actions,
    PlanModifyInspection,
    CloseInspection,
    InspectionFilters,
}
