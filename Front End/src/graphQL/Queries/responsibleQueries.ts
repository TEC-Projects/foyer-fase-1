import gql from 'graphql-tag';
import {DocumentNode} from "graphql";

let GET_EMPLOYEES: DocumentNode = gql`
    query($personnelType: String, $companyId: String, $roles: [String]!){
        retrieveEmployees(type: $personnelType, companyName: $companyId, roles: $roles){
            id
            user{
                id
                name
                surname
                type
                email
            }
            companyName
            role
            type
        }
    }

`

let ADD_EMPLOYEE: DocumentNode = gql`
    mutation($userId: String!, $companyId: String!, $roles:[String]){
        addEmployee(employeeId: $userId, companyId: $companyId, roles: $roles){
            response
            message
        }
        
    }
`

let GET_COMPANIES: DocumentNode = gql`
    query getCompanies {
        retrieveCompanies {
            id
            name
            email
        }
    }
`

let ADD_COMPANY : DocumentNode = gql`
    mutation addCompany($id: String!, $name: String!, $email: String!){
        addCompany(id: $id, name: $name, email: $email){
            response
            message
        }
    }
`

export {
    GET_EMPLOYEES,
    GET_COMPANIES,
    ADD_COMPANY,
    ADD_EMPLOYEE
}