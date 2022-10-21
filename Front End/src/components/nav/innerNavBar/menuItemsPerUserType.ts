import { NavMenuItem } from "../../../types/common.types"


const getAdminNavItems = (navigate : Function): Array<NavMenuItem> => {
    return(
        [
            {
                label: 'Inspecciones',
                action: () => navigate('/inspections')
            },
            {
                label: 'Áreas',
                action: () => navigate('/areas')
            },
            {
                label: 'Agentes de deterioro',
                action: () => navigate('/spoilage-agents')
            },
            {
                label: 'Encargados',
                action: () => navigate('/responsible')
            },
            {
                label: 'Usuarios',
                action: () => navigate('/users')
            },
        ]
    );

}

const getOperativeNavItems = (navigate : Function): Array<NavMenuItem> => {
    return[
        {
            label: 'Inspecciones',
            action: () => navigate('/inspections')
        },
        {
            label: 'Agentes de deterioro',
            action: () => navigate('/spoilage-agents')
        },
    ]
}

export {
    getAdminNavItems,
    getOperativeNavItems,
}
