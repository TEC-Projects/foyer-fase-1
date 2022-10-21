from __future__ import annotations

import datetime, re

from django.db import connection

from Foyer.Models import User, Role
from Foyer.Models.DAO.PdfDAO import PdfDAO
from Foyer.Models.ESupervisionResult import Actions
from Foyer.Models.DAO import IDAO, AreaDAO, ElementDAO
from Foyer.Models.Supervision import Supervision
from Foyer.Models.DAO.UserDAO import UserDAO


class SupervisionDAO(IDAO):
    dao_area: AreaDAO
    dao_element: ElementDAO
    dao_user: UserDAO
    dao_pdf: PdfDAO

    def __init__(self):
        """
        Constructor method
        """
        super().__init__()
        self.dao_area = AreaDAO()
        self.dao_element = ElementDAO()
        self.dao_user = UserDAO()
        self.dao_pdf = PdfDAO()

    def retrieve_rows(self, filter: dict):
        """
        Method to retrieve all the supervisions registered in the database by the filter selected
        """

        supervision_id = filter['inspectionId']
        start_date = filter['startDate']
        end_date = filter['endDate']
        id_number = filter['responsibleId']
        status = filter['status']
        s = None

        supervisions = Supervision()
        uninitialized = True

        if supervision_id is not None:
            supervisions = Supervision.objects.filter(supervision_id=supervision_id)
            uninitialized = False

        if start_date is not None:
            if uninitialized:
                supervisions = Supervision.objects.filter(start_date__gte=start_date)
                uninitialized = False
            else:
                supervisions = supervisions.filter(start_date__gte=start_date)
        if end_date is not None:
            if uninitialized:
                supervisions = Supervision.objects.filter(end_date__lte=end_date)
                uninitialized = False
            else:
                supervisions = supervisions.filter(end_date__lte=end_date)
        if id_number is not None:
            if uninitialized:
                supervisions = Supervision.objects.filter(id_number=id_number)
                uninitialized = False
            else:
                supervisions = supervisions.filter(id_number=id_number)
        if status is not None:
            if status == "TO_PROCEED":
                if uninitialized:
                    supervisions = Supervision.objects.filter(start_date__gte=datetime.date.today(),
                                                              execution_date=None)
                    uninitialized = False
                else:
                    supervisions = supervisions.filter(start_date__gte=datetime.date.today(), execution_date=None)
            if status == "IN_PROGRESS":
                if uninitialized:
                    supervisions = Supervision.objects.filter(start_date__lte=datetime.date.today(),
                                                              end_date__gte=datetime.date.today(), execution_date=None)
                    uninitialized = False
                else:
                    supervisions = supervisions.filter(start_date__lte=datetime.date.today(),
                                                       end_date__gte=datetime.date.today(), execution_date=None)
            if status == "LATE":
                if uninitialized:
                    supervisions = Supervision.objects.exclude(start_date__gt=datetime.date.today())
                    supervisions = supervisions.filter(end_date__lt=datetime.date.today(), execution_date=None)
                    uninitialized = False
                else:
                    supervisions = supervisions.exclude(start_date__gt=datetime.date.today())
                    supervisions = supervisions.filter(end_date__gt=datetime.date.today(), execution_date=None)
            if status == "EXECUTED":
                if uninitialized:
                    supervisions = Supervision.objects.exclude(execution_date=None)
                    supervisions = supervisions.raw('SELECT * FROM SUPERVISION WHERE EXECUTION_DATE < END_DATE')
                    uninitialized = False
                else:
                    supervisions = supervisions.exclude(execution_date=None)
                    supervisions = supervisions.raw('SELECT * FROM SUPERVISION WHERE EXECUTION_DATE < END_DATE')

            if status == "EXECUTED_LATE":
                if uninitialized:
                    supervisions = Supervision.objects.exclude(execution_date=None)
                    supervisions = supervisions.raw('SELECT * FROM SUPERVISION WHERE EXECUTION_DATE > END_DATE')
                    uninitialized = False
                else:
                    supervisions = supervisions.exclude(execution_date=None)
                    supervisions = supervisions.raw('SELECT * FROM SUPERVISION WHERE EXECUTION_DATE > END_DATE')
        if uninitialized:
            supervisions = Supervision.objects.all()

        return supervisions

    def add_row(self, data: dict) -> object:
        """
        Method to register a supervision in the database
        """

        if data['elementId'] is not None:
            if not re.match('A\d+-\d+$', data['elementId']):
                return {
                    'response': True,
                    'message': 'El elemento consultado no posee un formato de identificación correcto.',
                    'id': None
                }
            else:
                theatre_good_id = int(data['elementId'][1:].split('-')[1])

            if not self.dao_element.retrieve_rows({'id': theatre_good_id}).exists():
                return {
                    'response': True,
                    'message': 'No existe un elemento con el ID proporcionado',
                    'id': None
                }
        else:
            if not re.match(r'A([0-9])+$', data['areaId']):
                return {
                    'response': True,
                    'message': 'El área consultado no posee un formato de identificación correcto.',
                    'id': None
                }
            theatre_good_id = int(data['areaId'][1:])
            if not self.dao_area.retrieve_rows({'id': theatre_good_id}).exists():
                return {
                    'response': True,
                    'message': 'No existe un área con el ID proporcionado',
                    'id': None
                }

        if data['responsibleId'] is None:
            return {
                'response': True,
                'message': 'El ID del responsable de la inspección no puede ser vacío',
                'id': None
            }

        if data['startDate'] is None:
            return {
                'response': True,
                'message': 'La fecha de inicio de la inspección no puede ser vacía',
                'id': None
            }

        if data['endDate'] is None:
            return {
                'response': True,
                'message': 'La fecha de fin de la inspección no puede ser vacía',
                'id': None
            }

        if not self.dao_user.find_existing_user(data['responsibleId'], ""):
            return {
                'response': True,
                'message': 'No existe un encargado con el ID proporcionado',
                'id': None
            }

        if not User.objects.filter(id_number=data['responsibleId'], type=Role.objects.get(value='OPERATIVE_USER')):
            return {
                'response': True,
                'message': 'No se puede asignar una inspección a un usuario que no sea operativo ',
                'id': None
            }

        format = "%Y-%m-%d"
        start_date_dt_object = datetime.datetime.strptime(data['startDate'], format)
        end_date_dt_object = datetime.datetime.strptime(data['endDate'], format)

        if start_date_dt_object >= end_date_dt_object:
            return {
                'response': True,
                'message': 'La fecha de inicio debe ser menor a la fecha de fin',
                'id': None
            }

        with connection.cursor() as cursor:
            try:
                cursor.execute(
                    'INSERT INTO SUPERVISION (THEATRE_GOOD_ID,ID_NUMBER,START_DATE,END_DATE) VALUES (%s,%s,%s,%s)',
                    [theatre_good_id, data['responsibleId'], data['startDate'], data['endDate']])
            except Exception as e:
                print(e)
                return {
                    'response': True,
                    'message': 'Error en la inserción en la base de datos. Error: ' + e,
                    'id': None
                }
            cursor.execute('SELECT LAST_INSERT_ID()')
            (id,) = cursor.fetchone()
        return {
            'response': False,
            'message': None,
            'id': id
        }

    def delete_row(self, id: int) -> bool:
        pass

    def update_row(self, type: int, data: dict) -> object:
        """
        Method to update a supervision in the database, if the type is 1 is for conclude the supervision else is for
        modify the supervision
        """

        global validar
        if data['inspectionId'] is None:
            return {
                'response': True,
                'message': 'El ID de la inspección no puede ser vacío.',
                'id': None
            }
        if data['adminId'] is None:
            return {
                'response': True,
                'message': 'El ID del adminsitrador que realiza el cambio no puede ser vacío.',
                'id': None
            }

        if not Supervision.objects.filter(supervision_id=data['inspectionId']):
            return {
                'response': True,
                'message': 'No existe una inspección con el ID proporcionado.',
                'id': None
            }

        if type == 1:  ###### CONCLUDE INSPECTION ########

            if not Actions.objects.filter(value=data['action']):
                return {
                    'response': True,
                    'message': 'La acción ingresada no existe.',
                    'id': None
                }

            action = Actions.objects.get(value=data['action']).actions_id

            for pdf in data['documentListing']:
                if not self.dao_pdf.add_row({'file': pdf, 'sp_id': data['inspectionId']}):
                    return {
                        'response': True,
                        'message': 'No se pudo adjuntar el PDF.',
                        'id': None
                    }

            with connection.cursor() as cursor:
                try:
                    cursor.execute(
                        'UPDATE SUPERVISION SET ACTION_ID = %s, EXECUTION_DATE = CURDATE() WHERE SUPERVISION_ID = %s ',
                        [action, data['inspectionId']])
                    # cursor.execute('INSERT INTO PDF (VALUE, SUPERVISION_ID, NAME) VALUES(%s,%s,%s)   ',
                    # [data['pdf']['source'], data['inspectionId'], data['pdf']['name']])
                    cursor.execute(
                        'INSERT INTO SUPERVISION_CHANGE_LOG (LAST_CHANGE_ID_NUMBER, SUPERVISION_ID, LAST_CHANGE_DATE) VALUES(%s,%s,CURDATE())   ',
                        [data['adminId'], data['inspectionId']])

                except Exception as e:
                    print(e)
                    return {
                        'response': True,
                        'message': 'Error en la base de datos. Error: ' + e,
                        'id': None
                    }
            return {
                'response': False,
                'message': None,
                'id': data['inspectionId']
            }

        if type == 2:  ###### UPDATE INSPECTION #######
            if data['responsibleId'] is None:
                return {
                    'response': True,
                    'message': 'El ID del responsable no puede ser vacío.',
                    'id': None
                }
            if data['startDate'] is None:
                return {
                    'response': True,
                    'message': 'La fecha de inicio de la inspección no puede ser vacía',
                    'id': None
                }

            if data['endDate'] is None:
                return {
                    'response': True,
                    'message': 'La fecha de fin de la inspección no puede ser vacía',
                    'id': None
                }

            if not self.dao_user.find_existing_user(data['responsibleId'], ""):
                return {
                    'response': True,
                    'message': 'No existe un encargado con el ID proporcionado',
                    'id': None
                }

            format = "%Y-%m-%d"
            start_date_dt_object = datetime.datetime.strptime(data['startDate'], format)
            end_date_dt_object = datetime.datetime.strptime(data['endDate'], format)

            if start_date_dt_object >= end_date_dt_object:
                return {
                    'response': True,
                    'message': 'La fecha de inicio debe ser menor a la fecha de fin',
                    'id': None
                }
            if data['action'] is None:
                if Supervision.objects.get(supervision_id=data['inspectionId']).action_id is not None:
                    return {
                        'response': True,
                        'message': 'Se debe asignar una acción resultante a una inspección ya finalizada.',
                        'id': None
                    }
                action = None
            else:
                if Supervision.objects.get(supervision_id=data['inspectionId']).action_id is None:
                    return {
                        'response': True,
                        'message': 'Se debe finalizar la inspección primero, en caso de actualizar el tipo de acción y el pdf resultante.',
                        'id': None
                    }

                if not Actions.objects.filter(value=data['action']):
                    return {
                        'response': True,
                        'message': 'La acción ingresada no existe.',
                        'id': None
                    }
                action = Actions.objects.get(value=data['action']).actions_id
                for pdf in data['documentListing']:
                    if not self.dao_pdf.add_row({'file': pdf, 'sp_id': data['inspectionId']}):
                        return {
                            'response': True,
                            'message': 'No se pudo adjuntar el PDF.',
                            'id': None
                        }
            with connection.cursor() as cursor:
                try:
                    cursor.execute(
                        'UPDATE SUPERVISION SET ID_NUMBER = %s,START_DATE = %s, END_DATE = %s, ACTION_ID = %s WHERE SUPERVISION_ID = %s ',
                        [data['responsibleId'], data['startDate'], data['endDate'], action, data['inspectionId']])
                    # cursor.execute('INSERT INTO PDF (VALUE, SUPERVISION_ID, NAME) VALUES(%s,%s,%s)   ',
                    # [data['pdf']['source'], data['inspectionId'], data['pdf']['name']])
                    cursor.execute(
                        'INSERT INTO SUPERVISION_CHANGE_LOG (LAST_CHANGE_ID_NUMBER, SUPERVISION_ID, LAST_CHANGE_DATE) VALUES(%s,%s,CURDATE())',
                        [data['adminId'], data['inspectionId']])

                except Exception as e:
                    return {
                        'response': True,
                        'message': 'Error en la base de datos. Error: ' + e,
                        'id': None
                    }
            return {
                'response': False,
                'message': None,
                'id': data['inspectionId']
            }


SupervisionDAO.__doc__ = 'Database object that connects to the database and manages the CRUD actions on the ' \
                         'SUPERVISION table '
