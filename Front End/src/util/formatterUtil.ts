import {PersonnelType, Role} from '../types/responsible.types';
import {UserType} from '../types/user.types';
import {Actions, Status} from '../types/inspection.types';
import {Story} from '../types/area.types';

const dateFormatter = (date: Date, type:string) : string => {
    const longOptions : Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const shortOptions : Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', type === 'long' ? longOptions : shortOptions)
}

const roleFormatter = (role:Role) : string => {
    switch (role){
        case 'CONSERVATION':
            return 'Conservador';
        case 'INSPECTION':
            return 'Inspector'
        case 'RESTORATION':
            return 'Restaurador'
    }
}

const userTypeFormatter = (userType:UserType) :string => {
    switch (userType){
        case 'ADMIN_USER':
            return 'Administrador';
        case 'OPERATIVE_USER':
            return 'Operativo'
        case 'SUPER_USER':
            return 'Superusuario'
    }
}

const statusTypeFormatter = (status:Status) :string => {
    switch (status){
        case 'IN_PROGRESS':
            return 'En progreso';
        case 'EXECUTED':
            return 'Ejecutada'
        case 'EXECUTED_LATE':
            return 'Ejecutada con retraso'
        case 'LATE':
            return 'Retrasada'
        case 'TO_PROCEED':
            return 'Por suceder'
    }
}

const actionsTypeFormatter = (action:Actions) :string => {
    switch (action){
        case 'CONSERVATION':
            return 'Conservación';
        case 'INSPECTION':
            return 'Inspección'
        case 'RESTORATION':
            return 'Restauración'
    }
}

const storyTypeFormatter = (story:Story) :string => {
    switch (story){
        case 'FIRST':
            return 'Primer nivel';
        case 'SECOND':
            return 'Segundo nivel'
        case 'THIRD':
            return 'Tercer nivel'
        case 'BASEMENT':
            return 'Sótano'
        case 'OUTSIDE':
            return 'Exterior'
    }
}

const personnelTypeFormatter = (personnel:PersonnelType) : string => {
    switch (personnel){
        case 'INTERNAL':
            return 'Personal interno';
        case 'CONTRACTOR':
            return 'Personal subcontratado'
    }
}

const fileNameFormatter = (fileName: string, maxLength:number): string => {
    const sliceLength = (maxLength / 2) -2
    return fileName.length > maxLength ? fileName.slice(0,sliceLength) + '... ' + fileName.slice(-sliceLength) : fileName
}

export{
    dateFormatter,
    roleFormatter,
    userTypeFormatter,
    statusTypeFormatter,
    actionsTypeFormatter,
    storyTypeFormatter,
    personnelTypeFormatter,
    fileNameFormatter,
}
