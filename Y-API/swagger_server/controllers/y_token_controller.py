# Librerías importadas
import os
import time
import uuid
import binascii
from flask import request, jsonify
from iroha import IrohaCrypto
from iroha import Iroha, IrohaGrpc

# Permiso de Iroha importado
from iroha.primitive_pb2 import can_transfer_my_assets

# Informaciones sobre los pares de la red y la cuenta del administrador:

# Iroha par 1
IROHA_HOST_ADDR_1 = os.getenv('IROHA_HOST_ADDR_1', '192.168.146.132')
IROHA_PORT_1 = os.getenv('IROHA_PORT_1', '50051')
# Iroha par 2
IROHA_HOST_ADDR_2 = os.getenv('IROHA_HOST_ADDR_2', '192.168.146.132')
IROHA_PORT_2 = os.getenv('IROHA_PORT_2', '50052')
# Iroha par 3
IROHA_HOST_ADDR_3 = os.getenv('IROHA_HOST_ADDR_2', '192.168.146.132')
IROHA_PORT_3 = os.getenv('IROHA_PORT_3', '50053')

ADMIN_ACCOUNT_ID = os.getenv('ADMIN_ACCOUNT_ID', 'admin@ytoken')
ADMIN_PRIVATE_KEY = os.getenv(
    'ADMIN_PRIVATE_KEY', 'a209da278b1267c04da0d82e043b9d5094db2cff2c1d85d3038105a287656c18')

iroha = Iroha(ADMIN_ACCOUNT_ID)
# Redes IrohaGrpc para los pares 1, 2, 3
net_1 = IrohaGrpc('{}:{}'.format(IROHA_HOST_ADDR_1, IROHA_PORT_1))
net_2 = IrohaGrpc('{}:{}'.format(IROHA_HOST_ADDR_2, IROHA_PORT_2))
net_3 = IrohaGrpc('{}:{}'.format(IROHA_HOST_ADDR_3, IROHA_PORT_3))

def send_transaction_and_print_status(transaction):
    """Envío de transacción a la red de Iroha.
    
    :param transaction: una transacción que contiene uno o varios comandos.
    :type transaction: transaction

    :return: resultado de la transacción.
    :rtype: string
    """
    result = {
            "log": "",
            "hash": ""
    }
    hex_hash = binascii.hexlify(IrohaCrypto.hash(transaction))
    result['hash'] = str(hex_hash.decode("utf-8"))
    print('Transaction hash = {}, creator = {}'.format(
        hex_hash, transaction.payload.reduced_payload.creator_account_id))
    net_3.send_tx(transaction)
    for status in net_3.tx_status_stream(transaction):
        print(status)
        result['log'] = result['log']+str(status)
    return result

"""
*********************************************Registro de cuenta Y-Token*********************************************
"""

def create_priv_key(user_name):
    """Crear una clave privada

    :param user_name: el nombre del usuario de la nueva cuenta.
    :type user_name: string

    :return: la clave privada generada por IrohaCrypto.
    :rtype: string
    """
    private_key = IrohaCrypto.private_key()

    # the rest of the code writes the key into the file
    with open('keypair_' + user_name + '.priv', 'wb') as f:
        f.write(private_key)

    return private_key


def create_pub_key(user_name, priv_key):
    """Crear una clave pública a base de una clave privada

    :param user_name: el nombre del usuario de la nueva cuenta.
    :type user_name: string
    :param priv_key: la clave privada del usuario de la nueva cuenta.
    :type priv_key: string

    :return: la clave pública generada por IrohaCrypto.
    :rtype: string
    """
    public_key = IrohaCrypto.derive_public_key(priv_key)

    # the rest of the code writes the key into the file
    with open('keypair_' + user_name + '.pub', 'wb') as f:
        f.write(public_key)

    return public_key

def create_account(acc_name):
    """Crear una cuenta nueva.

    :param acc_name: el nombre del usuario de la nueva cuenta.
    :type acc_name: string

    :return: resultado del registro de un usuario nuevo que contiene el estado del resultado, un mensaje del resultado, la clave pública de la cuenta y la clave privada de la cuenta.
    :rtype: json
    """
    response = {
            "account_id": acc_name + '@ytoken',
            "hash": "",
            "status": "",
            "message": "",
            "public_key": "",
            "private_key": ""
    }

    try:
        acc_priv_key = create_priv_key(acc_name)
        acc_pub_key = create_pub_key(acc_name, acc_priv_key)
        tx = iroha.transaction([
            iroha.command('CreateAccount', account_name=acc_name, domain_id='ytoken',
                        public_key=acc_pub_key)
        ])
        IrohaCrypto.sign_transaction(tx, ADMIN_PRIVATE_KEY)
        result = send_transaction_and_print_status(tx)
        if ('COMMITTED' in result['log']):
            response['hash'] = result['hash']
            response['status'] = 'COMPLETED'
            """
            Regalar 100 Y-Tokens
            try:
                add_coin_to_admin('1000')
                time.sleep(2)
                grant_can_transfer_my_asset_permission(acc_name+'@'+'emarket', acc_priv_key )
                time.sleep(2)
                transfer_asset('admin@ytoken', acc_name+'@'+'ytoken', 'ytoken#emarket', '100.00', ADMIN_PRIVATE_KEY)
            except Exception:
                pass
            """
            response['message'] = "Register Success!!! Please write down your keys in a sufficiently secure place."
            response['public_key'] = str(acc_pub_key.decode("utf-8"))
            response['private_key'] = str(acc_priv_key.decode("utf-8"))
        else:
            response['status'] = 'FAILED'
            response['message'] = "Register Failed, Please try with another username."
    except Exception:
        response['status'] = 'FAILED'
        response['message'] = "Register Failed, connection failed."

    return jsonify(response)

def grant_can_transfer_my_asset_permission(acc_id, acc_priv_key):
    """Hacer que el administrador pueda transferir los activos del usuario solictante. 

    :param acc_id: id de la cuenta del usuario solicitante.
    :type acc_id: string
    :param acc_priv_key: clave privada de la cuenta del usuario solicitante.
    :type acc_priv_key: string
    """
    tx = iroha.transaction([
        iroha.command('GrantPermission', account_id='admin@ytoken', permission=can_transfer_my_assets)
    ], creator_account=acc_id)
    IrohaCrypto.sign_transaction(tx, acc_priv_key)
    send_transaction_and_print_status(tx)

def account_post(body):  # noqa: E501
    """Registrar una cuenta nueva de Y-Token.

    :param body: contiene el id que será usado para crear una cuenta de Y-Token.
    :type body: json

    :return: resultado del registro de un usuario nuevo.
    :rtype: json
    """
    
    return create_account(body['acc_name'])

"""
*********************************************Consulta de transacción de Y-Token*********************************************
"""

def get_transactions_by_hash(hash):
    """Recuperar una transacción.

    :param hash: el hash de la transacción.
    :type acc_id: string
    :param acc_priv_key: clave privada de la cuenta solicitante.
    :type acc_priv_key: string

    :return: resultado de la conulta.
    :rtype: response
    """
    query = iroha.query('GetTransactions', tx_hashes=[str(hash)])
    IrohaCrypto.sign_query(query, ADMIN_PRIVATE_KEY)

    response = net_2.send_query(query)
    return response.transactions_response.transactions

def transaction_get(transaction_hash):  # noqa: E501
    """Recupera los detalles de una transaccion identificada por su hash.

    Recupera los detalles de una transaccion identificada por su hash. # noqa: E501

    :param transaction_hash: El hash de la transacción
    :type transaction_hash: str

    :rtype: Topup
    """
    response = {
        "transaction": ""
    }
    transactions = get_transactions_by_hash(transaction_hash)
    for tx in transactions:
        response['transaction'] = str(tx.payload.reduced_payload)

    return jsonify(response)

"""
*********************************************Transferencia de Y-Token*********************************************
"""

def transfer_asset(src_acc_id, dest_acc_id, ass_id, amount, src_acc_priv_key):
    """Realiza una nueva transferencia. 

    :param src_acc_id: id usuario de la cuenta remitente.
    :type src_acc_id: string
    :param dest_acc_id: id usuario de la cuenta destinataria.
    :type dest_acc_id: string
    :param ass_id: id del activo que va a transferir.
    :type ass_id: string
    :param amount: cantidad de activos que va a transferir.
    :type amount: string
    :param src_acc_priv_key: clave privada de la cuenta del remitente.
    :type src_acc_priv_key: string

    :return: resultado de la transacción.
    :rtype: string
    """
    tx = iroha.transaction([
        iroha.command('TransferAsset', src_account_id=src_acc_id, dest_account_id=dest_acc_id,
                      asset_id=ass_id, description='init top up', amount=amount)
    ], creator_account=src_acc_id)
    IrohaCrypto.sign_transaction(tx, src_acc_priv_key)
    return(send_transaction_and_print_status(tx)) 

def transfer_post(body, asset_domain):  # noqa: E501
    """Crea una nueva transferencia.

    :param body: contiene datos como el id de la cuenta remitente, el id de la cuenta destinataria y la cantidad de activos que va a transferir.
    :type body: json
    :param asset_domain: El nombre del dominio al que pertenece el Y-Token
    :type account_id: str

    :return: resultado de la transacción que contiene un id y el estado del resultado de la transferencia.
    :rtype: json

    :rtype: Transfer
    """
    headers = request.headers
    src_priv_key = headers.get("ACCOUNT-PRIVATE-KEY")
    response = {
        "hash": "",
        "status": ""
    }

    try:
        result = transfer_asset(body['src_acc_name']+'@'+'ytoken', body['dest_acc_name']+'@'+'ytoken', 'ytoken#'+asset_domain, body['amount'], src_priv_key)
        if ('COMMITTED' in result['log']):
            response['hash'] = result['hash']
            response['status'] = 'COMPLETED'
        else:
            response['status'] = 'FAILED'
    except Exception:
        response['status'] = 'FAILED'

    return jsonify(response)

"""
*********************************************Consulta de saldo de Y-Token*********************************************
"""

def send_transaction(transaction):
    """Envío de transacción a la red de Iroha.
    
    :param transaction: Una transacción que contiene uno o varios comandos.
    :type transaction: transaction
    """
    hex_hash = binascii.hexlify(IrohaCrypto.hash(transaction))
    print('Transaction hash = {}, creator = {}'.format(
        hex_hash, transaction.payload.reduced_payload.creator_account_id))
    net_1.send_tx(transaction)


def get_account_assets(acc_id, acc_priv_key):
    """Obtener activos de una cuenta.

    :param acc_id: id de la cuenta solicitante.
    :type acc_id: string
    :param acc_priv_key: clave privada de la cuenta solicitante.
    :type acc_priv_key: string

    :return: resultado de la conulta.
    :rtype: response
    """
    query = iroha.query('GetAccountAssets', account_id=acc_id, creator_account=acc_id)
    IrohaCrypto.sign_query(query, acc_priv_key)

    response = net_1.send_query(query)
    return response.account_assets_response.account_assets

def ytoken_get(account_id, asset_domain):  # noqa: E501
    """Recupera el saldo de Y-Token de una cuenta concreta identificado por su id y su clave privada.

    Devuelve el saldo de Y-Token de la cuenta identificada por su id y su clave privada. # noqa: E501

    :param account_id: El id de la cuenta
    :type account_id: str
    :param asset_domain: El nombre del dominio al que pertenece el Y-Token
    :type account_id: str


    :return: resultado de la consulta de monedero que contiene id del activo y el saldo actual.
    :rtype: json
    """
    headers = request.headers
    priv_key = headers.get("ACCOUNT-PRIVATE-KEY")
    response = {
        "asset_id": '',
        "balance": 0,
    }
    assets = get_account_assets(account_id+'@ytoken', priv_key)

    for asset in assets:
        if (asset_domain in asset.asset_id):
            response['asset_id'] = asset.asset_id
            response['balance'] = float(asset.balance)
        
    return jsonify(response)

"""
*********************************************Recarga de saldo de Y-Token*********************************************
"""


def add_coin_to_admin(amt):
    """
    Agregar saldo para el administrador.

    :param amt: cantidad de Y-Tokens que va a agregar.
    :type amt: string
    """
    tx = iroha.transaction([
        iroha.command('AddAssetQuantity',
                      asset_id='ytoken#emarket', amount=amt)
    ])
    IrohaCrypto.sign_transaction(tx, ADMIN_PRIVATE_KEY)
    send_transaction(tx)


def ytoken_post(body, account_id, asset_domain):  # noqa: E501
    """Aumenta la cantidad de Y-Token de una cuenta concreta.

    Aumenta la cantidad de Y-Token de una cuenta identificada por su id y la clave privada. # noqa: E501

    :param body: contiene datos como el nombre de la cuenta de administrador del dominio y la cantidad de saldo que aumenta
    :type body: json
    :param account_id: El id de la cuenta
    :type account_id: str
    :param asset_domain: El nombre del dominio al que pertenece el Y-Token
    :type account_id: str

    :return: resultado de la consulta de monedero que contiene id del activo, el saldo actual y el estado del resultado.
    :rtype: json
    """
    headers = request.headers
    domain_admin_priv_key = headers.get("DOMAIN-ADMIN-PRIVATE-KEY")
    response = {
        "hash": '',
        "status":''
    }

    try:
        # add_coin_to_admin(body['amount'])
        # time.sleep(2)
        result = transfer_asset(body['domain_admin_acc_name']+'@ytoken',account_id+'@ytoken', 'ytoken#'+asset_domain, body['amount'], domain_admin_priv_key)
        if ('COMMITTED' in result['log']):
            response['hash'] = result['hash']
            response['status'] = 'COMPLETED'
        else:
            response['status'] = 'FAILED'
    except Exception:
        response['status'] = 'FAILED'

    return jsonify(response)
