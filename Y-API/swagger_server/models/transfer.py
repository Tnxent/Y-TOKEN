# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class Transfer(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, hash: str=None, status: str=None):  # noqa: E501
        """Transfer - a model defined in Swagger

        :param hash: The hash of this Transfer.  # noqa: E501
        :type hash: str
        :param status: The status of this Transfer.  # noqa: E501
        :type status: str
        """
        self.swagger_types = {
            'hash': str,
            'status': str
        }

        self.attribute_map = {
            'hash': 'hash',
            'status': 'status'
        }
        self._hash = hash
        self._status = status

    @classmethod
    def from_dict(cls, dikt) -> 'Transfer':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Transfer of this Transfer.  # noqa: E501
        :rtype: Transfer
        """
        return util.deserialize_model(dikt, cls)

    @property
    def hash(self) -> str:
        """Gets the hash of this Transfer.

        hash de la transacción.  # noqa: E501

        :return: The hash of this Transfer.
        :rtype: str
        """
        return self._hash

    @hash.setter
    def hash(self, hash: str):
        """Sets the hash of this Transfer.

        hash de la transacción.  # noqa: E501

        :param hash: The hash of this Transfer.
        :type hash: str
        """

        self._hash = hash

    @property
    def status(self) -> str:
        """Gets the status of this Transfer.

        resultado de la transacción.  # noqa: E501

        :return: The status of this Transfer.
        :rtype: str
        """
        return self._status

    @status.setter
    def status(self, status: str):
        """Sets the status of this Transfer.

        resultado de la transacción.  # noqa: E501

        :param status: The status of this Transfer.
        :type status: str
        """

        self._status = status
