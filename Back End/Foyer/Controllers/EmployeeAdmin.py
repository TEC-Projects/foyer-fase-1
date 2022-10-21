# from ..Models.DAO.EmployeeDAO import EmployeeDAO

from ..Models.DAO.CompanyDAO import CompanyDAO
from ..Models.DAO.UserDAO import UserDAO
from ..Models.EmployeeCompany import Company
from ..Models.DAO.EmployeeDAO import EmployeeDAO
from ..Models.Employee import Employee
from Foyer.Util.GeneralUtil import check_event_loop
from django.db import connection
from .UserAdmin import UserAdmin
from time import time 

class EmployeeAdmin:

    company_dao : CompanyDAO
    user_admin : UserAdmin
    user_dao : UserDAO
    employee_dao : EmployeeDAO

    def __init__(self):
        '''
        Constructor method for the EmployeeAdmin class
        '''
        super().__init__()
        self.company_dao = CompanyDAO()
        self.employee_dao = EmployeeDAO()
        self.user_admin = UserAdmin()
        self.user_dao = UserDAO()

    def retrieve_companies(self):
        '''
        Method that contains the logic to retrieve all the companies registered in the system and returns them in a list
        '''
        return self.company_dao.retrieve_rows()
        

    def add_company(self, id, name, email):
        '''
        Method that contains the logic to add a new company to the system and returns a boolean value indicating if the operation was successful
        '''
        if self.company_dao.find_existing_company(id, email) is False:
            company = Company(id=id, name=name, email=email)
            self.company_dao.add_row(company)
            return {
                'response' : False,
                'message' : None
            }
        else:
            return {
                'response' : True,
                'message' : 'Error al agregar la empresa: La empresa ya existe'
            }

    def retrieve_employees(self, e_type, company_id, e_roles):
        '''
        Method that contains the logic to retrieve all the employees registered in the system and returns them in a list
        '''
        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP

        t = time()

        employees: list[object] = []
        database_response = self.employee_dao.retrieve_rows()
        for employee in database_response:
            if employee is not None:

                roles = []
                for action in employee.action.all():
                    roles.append(action.value)

                company: Company = employee.company.get()
                if company.id == "3007110978":
                    employee_type = 'INTERNAL'
                else:
                    employee_type = 'CONTRACTOR'

                if(company_id != None and company_id != company.id):
                    continue
                if(e_type != None and e_type != employee_type):
                    continue
                if(e_roles and all(elem in roles for elem in e_roles) == False):
                    continue

                user = employee.user
                employees.append({
                    'id': str(employee.employee_id),
                    'user' : {
                        'user_id' : user.user_id,
                        'id': user.id_number,
                        'name': user.name,
                        'surname': user.surname,
                        'email': user.email,
                        'type': user.type.value
                    },
                    'company_name': company.name,
                    'role' : roles,
                    'type' : employee_type
                })

        t = time() - t

        print(t)

        return employees

    def add_employee(self, employee_id, company_id, roles):
        '''
        Method that contains the logic to add a new employee to the system and returns a boolean value indicating if the operation was successful
        '''
        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP
        if company_id is not None and company_id.strip() != "":
            if self.employee_dao.find_existing_employee(employee_id) is False:
                if self.user_dao.find_row_by_id(employee_id) is True:
                    self.employee_dao.add_row(employee_id, company_id, roles)
                    return {
                        'response' : False,
                        'message' : None
                    }
                else:
                    return {
                        'response' : True,
                        'message' : 'Error al agregar el empleado: No existe el usuario con el id especificado'
                    }
            else:
                return {
                    'response' : True,
                    'message' : 'Error al agregar el empleado: El empleado ya existe'
                }
        else:
            return {
                'response' : True,
                'message' : 'Error al agregar el empleado: No se especificó una empresa'
            }

EmployeeAdmin.__doc__ = "Class that handles the logic for the employees and companies administration in the system"


        