# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.account import Account  # noqa: E501
from swagger_server.models.balance import Balance  # noqa: E501
from swagger_server.models.http_problem import HTTPProblem  # noqa: E501
from swagger_server.models.topup import Topup  # noqa: E501
from swagger_server.models.transaction import Transaction  # noqa: E501
from swagger_server.models.transfer import Transfer  # noqa: E501
from swagger_server.test import BaseTestCase


class TestYTokenController(BaseTestCase):
    """YTokenController integration test stubs"""

    def test_account_post(self):
        """Test case for account_post

        Registrar una nueva cuenta de Y-Token.
        """
        body = None
        response = self.client.open(
            '/ytoken/account/register',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_transaction_get(self):
        """Test case for transaction_get

        Recuperar los detalles de una transaccion identificada por su hash.
        """
        response = self.client.open(
            '/ytoken/transaction/{transactionHash}'.format(transaction_hash='transaction_hash_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_transfer_post(self):
        """Test case for transfer_post

        Crear una nueva tranferencia.
        """
        body = None
        response = self.client.open(
            '/ytoken/transfer/domain/{assetDomain}'.format(asset_domain='asset_domain_example'),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_ytoken_get(self):
        """Test case for ytoken_get

        Recuperar el saldo de Y-Token de un dominio concreto.
        """
        response = self.client.open(
            '/ytoken/{accountId}/domain/{assetDomain}'.format(account_id='account_id_example', asset_domain='asset_domain_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_ytoken_post(self):
        """Test case for ytoken_post

        Aumentar la cantidad de Y-Token de un dominio concreto para una cuenta.
        """
        body = None
        response = self.client.open(
            '/ytoken/{accountId}/domain/{assetDomain}'.format(account_id='account_id_example', asset_domain='asset_domain_example'),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
