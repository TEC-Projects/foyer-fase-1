from .IDAO import IDAO
from ..EmployeeCompany import Company

class CompanyDAO(IDAO):

    def __init__(self):
        '''
        Constructor for CompanyDAO
        '''
        super().__init__()

    def retrieve_rows(self):
        '''
        Method to retrieve all the rows registered in the Company table
        '''
        return Company.objects.all()

    def add_row(self, company):
        '''
        Method to add a row to the Company table
        '''
        company.save()

    def find_existing_company(self, company_id, email):
        '''
        Method to check if a company already exists in the database by its id number
        '''
        if Company.objects.filter(id=company_id).exists() or Company.objects.filter(email=email).exists():
            return True
        else:
            return False

CompanyDAO.__doc__ = 'Class to manage the Company table in the database'

