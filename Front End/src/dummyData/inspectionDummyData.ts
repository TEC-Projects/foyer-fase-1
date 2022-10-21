import {Inspection, InspectionListingItem} from "../types/inspection.types";

const dummyInspectionListing : Array<InspectionListingItem> = [
    {
        id:'425125',
        toBeInspected: {
            id: '1025',
            name: 'Palco derecho',
            type: 'AREA'
        },
        responsible:{
            name: 'Andrés Montero Gamboa',
            id: '2074558669'
        },
        status: 'TO_PROCEED',
        startDate: new Date(),
        endDate: new Date(),
    },
    {
        id:'402256',
        toBeInspected: {
            id: '1025',
            name: 'Foso',
            type: 'AREA'
        },
        responsible:{
            name: 'José Arce Morales',
            id: '2074558669'
        },
        status: 'EXECUTED_LATE',
        startDate: new Date(),
        endDate: new Date(),
    },
    {
        id:'415233',
        toBeInspected: {
            id: '1025',
            name: 'Cortina',
            type: 'ELEMENT'
        },
        responsible:{
            name: 'Joshua Gamboa Calvo',
            id: '2074558669'
        },
        status: 'IN_PROGRESS',
        startDate: new Date(),
        endDate: new Date(),
    },
    {
        id:'400012',
        toBeInspected: {
            id: '1025',
            name: 'Cornisa',
            type: 'ELEMENT'
        },
        responsible:{
            name: 'Esteban Vargas Quirós',
            id: '100442586'
        },
        status: 'EXECUTED',
        startDate: new Date(),
        endDate: new Date(),
    }
]

const dummyInspection : Inspection = {
    documentsListing: [
        {
            id:'001',
            name: 'Reporte de inspección 402256.pdf',
            source: 'http://www.javier8a.com/itc/bd1/articulo.pdf',
        },
    ],
    id: "402256",
    responsible: {
        name:"José Arce Morales",
        id: "208220445"
    },
    startDate: new Date('2022-10-22'),
    endDate: new Date('2022-10-31'),
    closeDate: null,
    status: 'EXECUTED_LATE',
    suggestedAction: null,
    toBeInspected: {
        id: '1025',
        name: 'Palco derecho',
        type: 'AREA'
    },
    updateLog: [
        {
            authorName: 'Jose Arce Morales',
            date: new Date(),
        },
        {
            authorName: 'Andrés Montero Gamboa',
            date: new Date(),
        }
    ]

}

export {
    dummyInspection,
    dummyInspectionListing,
}
