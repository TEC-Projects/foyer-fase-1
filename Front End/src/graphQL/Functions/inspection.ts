import {ApolloClient} from "@apollo/client";
import {validateCloseInspection, validateInspectionFilters, validateModifyInspection, validatePlanInspection,
} from "../../util/validatorUtil";
import {CloseInspection, InspectionFilters, PlanModifyInspection} from "../../types/inspection.types";
import {dummyInspection, dummyInspectionListing} from "../../dummyData/inspectionDummyData";
import {
    CONCLUDE_SUPERVISION,
    CREATE_SUPERVISION,
    GET_INSPECTION_DETAIL,
    GET_INSPECTIONS, MODIFY_SUPERVISION
} from "../Queries/inspectionQueries";
import validator from "validator";
import isEmpty = validator.isEmpty;

/**
 * Function that adds a new inspection.
 */
const planInspection = async (apolloClient:ApolloClient<any>, inspectionData:PlanModifyInspection, navigate:Function):Promise<void> => {
    validatePlanInspection(inspectionData)
    const {data} = await apolloClient.mutate({
        mutation: CREATE_SUPERVISION,
        variables: {
            input: {
                ...inspectionData,
                elementId: inspectionData.elementId === '-1'? null: inspectionData.elementId,
                startDate: inspectionData.startDate?.toISOString().split('T')[0],
                endDate: inspectionData.endDate?.toISOString().split('T')[0],
            }
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    console.log(data);
    if(data.createSupervision.response){
        throw new Error(data.createSupervision.message)
    }
    navigate('/inspections/' + data.createSupervision.id)
};

/**
 * Function that modifies an inspection.
 */
const modifyInspection = async (apolloClient:ApolloClient<any>, inspectionData:PlanModifyInspection, fileList:Array<File>, adminId: string|undefined, navigate:Function):Promise<void> => {
    validateModifyInspection(inspectionData)
    console.log({
        inspectionId: inspectionData.id,
        startDate: inspectionData.startDate?.toISOString().split('T')[0],
        endDate: inspectionData.endDate?.toISOString().split('T')[0],
        documentListing: fileList,
        action: inspectionData.suggestedAction,
        adminId,
        responsibleId: inspectionData.responsibleId
    })
    console.log("hola")
    const {data} = await apolloClient.mutate({
        mutation: MODIFY_SUPERVISION,
        variables: {
            input: {
                inspectionId: inspectionData.id,
                startDate: inspectionData.startDate?.toISOString().split('T')[0],
                endDate: inspectionData.endDate?.toISOString().split('T')[0],
                documentListing: fileList.length === 0? []: fileList[0],
                action: inspectionData.suggestedAction,
                adminId,
                responsibleId: inspectionData.responsibleId
            }
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if (data.updateSupervision.response){
        throw new Error(data.updateSupervision.message);
    }
    navigate('/inspections/' + inspectionData.id)
};

/**
 * Function that closes an inspection.
 */
const closeInspection = async (apolloClient:ApolloClient<any>, inspectionData:CloseInspection, adminId: string|undefined, navigate:Function):Promise<void> => {
    validateCloseInspection(inspectionData);
    const {data} = await apolloClient.mutate({
        mutation: CONCLUDE_SUPERVISION,
        variables: {
            input: {
                documentListing: inspectionData.documentsListing,
                inspectionId: inspectionData.id,
                action: inspectionData.suggestedAction,
                adminId
            },
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.concludeSupervision.response){
        throw new Error(data.concludeSupervision.message)
    }
    navigate('/inspections/' + inspectionData.id)
};

/**
 * Function that retrieves inspection listing with filters.
 */
const getInspectionsListing = async (apolloClient:ApolloClient<any>, setState:Function, filters:InspectionFilters):Promise<void> => {
    validateInspectionFilters(filters);
    const {data} = await apolloClient.query({
        query: GET_INSPECTIONS,
        variables: {
            input: {
                startDate: filters.startDate? filters.startDate.toISOString().split('T')[0] : null,
                endDate: filters.endDate? filters.endDate.toISOString().split('T')[0]: null,
                inspectionId: filters.inspectionId === "" ? null: filters.inspectionId,
                responsibleId: filters.responsibleId === "" ? null: filters.responsibleId,
                status: filters.status === "" ? null: filters.status
            }
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState(data.getFilteredSupervisions.map((supervision: any) => {
        return {
            ...supervision,
            startDate: new Date(supervision.startDate+ 'T06:00:00.000Z'),
            endDate: new Date(supervision.endDate+ 'T06:00:00.000Z')
        }
    }))
    // setState(dummyInspectionListing)
}

/**
 * Function that retrieves an inspection detail.
 */
const getInspectionDetail = async (apolloClient:ApolloClient<any>, setState:Function, inspectionId:string):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_INSPECTION_DETAIL,
        variables: {
            inspectionId
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    console.log(new Date().toISOString())
    setState({
        ...data.getSupervision,
        startDate: new Date(data.getSupervision.startDate+ 'T06:00:00.000Z'),
        endDate: new Date(data.getSupervision.endDate+ 'T06:00:00.000Z'),
        closeDate: data.getSupervision.executionDate? new Date(data.getSupervision.executionDate + 'T06:00:00.000Z') : null,
        updateLog: data.getSupervision.updateLog.map((v: any) => {
            return {
                ...v,
                date: new Date(v.date+ 'T06:00:00.000Z')
            }
        })

    })

    // setState(dummyInspection)
}

export {
    planInspection,
    modifyInspection,
    closeInspection,
    getInspectionsListing,
    getInspectionDetail
}
