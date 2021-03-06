# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class Balance(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, asset_id: str=None, balance: float=None):  # noqa: E501
        """Balance - a model defined in Swagger

        :param asset_id: The asset_id of this Balance.  # noqa: E501
        :type asset_id: str
        :param balance: The balance of this Balance.  # noqa: E501
        :type balance: float
        """
        self.swagger_types = {
            'asset_id': str,
            'balance': float
        }

        self.attribute_map = {
            'asset_id': 'asset_id',
            'balance': 'balance'
        }
        self._asset_id = asset_id
        self._balance = balance

    @classmethod
    def from_dict(cls, dikt) -> 'Balance':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Balance of this Balance.  # noqa: E501
        :rtype: Balance
        """
        return util.deserialize_model(dikt, cls)

    @property
    def asset_id(self) -> str:
        """Gets the asset_id of this Balance.

        Id de Y-Token.  # noqa: E501

        :return: The asset_id of this Balance.
        :rtype: str
        """
        return self._asset_id

    @asset_id.setter
    def asset_id(self, asset_id: str):
        """Sets the asset_id of this Balance.

        Id de Y-Token.  # noqa: E501

        :param asset_id: The asset_id of this Balance.
        :type asset_id: str
        """

        self._asset_id = asset_id

    @property
    def balance(self) -> float:
        """Gets the balance of this Balance.

        saldo de Y-Token de la cuenta.  # noqa: E501

        :return: The balance of this Balance.
        :rtype: float
        """
        return self._balance

    @balance.setter
    def balance(self, balance: float):
        """Sets the balance of this Balance.

        saldo de Y-Token de la cuenta.  # noqa: E501

        :param balance: The balance of this Balance.
        :type balance: float
        """

        self._balance = balance
