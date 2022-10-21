import {ApolloClient} from "@apollo/client";

import {validateAddCompany, validateAddResponsible} from "../../util/validatorUtil";
import {AddResponsible, Company, ResponsibleFilters, Role} from "../../types/responsible.types";
import {ADD_COMPANY, ADD_EMPLOYEE, GET_COMPANIES, GET_EMPLOYEES} from "../Queries/responsibleQueries";



/**
 * Function that adds a new responsible.
 */
const addResponsible = async (apolloClient:ApolloClient<any>, responsibleData:AddResponsible, navigate:Function):Promise<void> => {
    let roles: Array<Role> = [];

    if(responsibleData.isCurator) roles.push('CONSERVATION')
    if(responsibleData.isInspector) roles.push('INSPECTION')
    if(responsibleData.isRestorer) roles.push('RESTORATION')

    validateAddResponsible(responsibleData, roles)

    const {data} = await apolloClient.mutate({
        mutation: ADD_EMPLOYEE,
        variables: {
            userId: responsibleData.userId,
            companyId: responsibleData.companyId,
            roles
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.addEmployee.response){
        throw new Error(data.addEmployee.message)
    }
    navigate('/responsible')
};

/**
 * Function that adds a new company.
 */
const addCompany = async (apolloClient:ApolloClient<any>, companyData:Company, navigate:Function):Promise<void> => {
    validateAddCompany(companyData)
    const {data} = await apolloClient.mutate({
        mutation: ADD_COMPANY,
        variables: companyData
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.addCompany.response){
        throw new Error(data.addCompany.message);
    }
    navigate('/responsible')
};

/**
 * Function that retrieves responsible listing with filters.
 */
const getResponsibleListing = async (apolloClient:ApolloClient<any>, setState:Function, filters:ResponsibleFilters):Promise<void> => {
    let roles = [];

    if(filters.filterCurator) roles.push('CONSERVATION')
    if(filters.filterInspector) roles.push('INSPECTION')
    if(filters.filterRestorer) roles.push('RESTORATION')

    const {data} = await apolloClient.query({
        query: GET_EMPLOYEES,
        variables: {
            roles,
            personnelType: filters.personnelType? filters.personnelType: null,
            companyId: filters.companyId? filters.companyId: null
        },
        fetchPolicy: "no-cache",
    });

    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');

    console.log(data.retrieveEmployees)

    setState(data.retrieveEmployees)
}

/**
 * Function that retrieves companies listing.
 */
const getCompaniesListing = async (apolloClient:ApolloClient<any>, setState:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_COMPANIES,
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState(data.retrieveCompanies)
}

export {
    addResponsible,
    addCompany,
    getCompaniesListing,
    getResponsibleListing,
}
