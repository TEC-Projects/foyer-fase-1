
class ISpoilableItem:

    def __int__(self, affected_by):
        self.__afected_by = affected_by

    def get_affected_by(self):
        return self._ISpoilableItem__afected_by

    def set_affected_by(self, affected_by):
        self._ISpoilableItem__afected_by = affected_by