# Y-TOKEN
Y-Token es un proyecto basado en la tecnología Hyperledger Iroha que permite crear una red de cadena de bloques (Blockchain) de tipo consorcio que es capaz de emitir tokens personalizados según las necesidades de sus dominios.

## Pre-requisitos para el despliegue del proyecto:
Para su despliegue necesitamos dos máquinas, una máquina virtual como servidor y otra máquina real como cliente.
1. Máquina virtual (Ubuntu 20.04.2 LTS x64)
- Dirección IP: **192.168.146.150** con acceso a internet
- **Docker** version: 20.10.5
- **Docker-compose** version: 1.26.0
- Conexión con la máquina real
2. Máquina real (Windows 10)
- Navegador **Google Chrome**
- Conexión con la máquina virtual

## Despliegue del proyecto:
Para simplificar el proceso de despliegue, se ha creado un fichero docker-compose que nos permite poner en marcha el proyecto completo con un solo commando.

### Máquina virtual:
  1. Clonar el siguiente directorio:
      ([quick-deploy](https://github.com/Tnxent/Y-TOKEN/tree/main/quick-deploy))
  2. Abir el terminal, navegar al directorio clonado y ejecutar siguente comando: 
  ```
       sudo docker-compose up
  ```
### Máquina real:
  3. Abir el Chrome con el CORS desabilitado haciendo Win+R y ejecutar el siguiente comando:
  ```
       chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
  ```
  4. Abrir la página principal de E-Marketplace:
  ```
       http://192.168.146.150:3000/
  ```
  
  
## Pruebas:
En este apartado se realizan pruebas de las funciones principales del proyecto.
- Emisión de Y-Token y su asignación al administrador de un dominio
- Registración de una cuenta Y-Token
- Aumento de saldo de una cuenta Y-Token
- Transferencia de Y-Token
- Consulta de una transferencia Y-Token
- Consulta de saldo de una cuenta Y-Token


### Emisión de Y-Token y su asignación al administrador de un dominio
#### Máquina virtual:
  1. Abir una nueva ventana del terminal (sin cerrar la de anterior) y ejecutar los siguientes comandos para acceder al iroha-cli con la cuenta del administrador.
  ```
       sudo docker exec -it ytoken-iroha1 /bin/bash
       iroha-cli -account_name admin@ytoken
  ```
  2. Seguir los siguientes pasos para emitir 1000 Y-Tokens para el dominio E-Marketplace: 
  ```
       1. New transaction (tx) 
       16. Add Asset Quantity (add_ast_qty) 
       Asset Id: ytoken#emarket
       Amount to add, e.g 123.456: 1000
       2. Send to Iroha peer (send)
       Peer address (0.0.0.0): 172.29.101.121
       Peer port (50051): 50051     
  ```
  3. Seguir los siguientes pasos para asignar 1000 Y-Tokens para la cuenta del administrador de E-Marketplace: 
  ```
       1. New transaction (tx) 
       5. Transfer Assets (tran_ast) 
       SrcAccount Id: admin@ytoken 
       DestAccount Id: admin_emarket@ytoken
       Asset Id: ytoken#emarket
       Amount to transfer, e.g 123.456: 1000
       2. Send to Iroha peer (send)
       Peer address (172.29.101.121): 172.29.101.121
       Peer port (50051): 50051     
  ```
### Registración de una cuenta Y-Token
#### Máquina real:
  4. Abir la página de registración de cuentas Y-Token:
  ```
       http://192.168.146.150:3000/ytokenregister
  ```
  5. introducir un nombre de usuario y dar al botón Sign Up, después de varios segundos se mostrará tanto la clave pública como la clave privada de la cuenta:
  ```
       Y-Token

       Register Success!!! Please write down your keys in a sufficiently secure place.

       Your account name: test007@ytoken

       Your Account's public key: 000000000000000000000000000000000000000000000000000000000000000

       Your Account's private key: 0000000000000000000000000000000000000000000000000000000000000000

       Transaction Hash: 0000000000000000000000000000000000000000000000000000000000000000000000
  ```
### Aumento de saldo de una cuenta Y-Token
#### Máquina real:
  5. Abir la página de recarga de Y-Token:
  ```
       http://192.168.146.150:3000/ytokenaddfounds
  ```
  6. introducir el nombre del usuario y la cantidad que se desea aumentar (se recomienda 100 o más), al dar al botón PayPal, se mostrará una ventanilla de pago de PayPal que está enlazada con una cuenta PayPal de Sandbox, es decir, lo que se gasta dentro no es dinero real. Una vez cofirmado el pago se mostrará el mensaje de resultado de la recarga realizada:
  ```
   Y-Token#emarket

   The payment has been completed and the funds have been added successfully to your account balance.

   Your Account: test007@ytoken

   Transaction Hash: 0000000000000000000000000000000000000000000000000000000000000000000000
  ```
### Transferencia de Y-Token
#### Máquina real:
  7. Para esta prueba, se hará una compra en E-Marketplace, elegir un producto de la página principal de E-Maeketplace y hacer llegar hasta la página de confirmación de pedido:
  ```

  ```
  8. introducir el nombre del usuario y la clave privada de la cuenta Y-Token, luego dar al botón Submit, depúes de unos segundos se refrescará la página y se va a mostrar el código hash de la transacción realizada.
  ```
    Paid at 2021-12-02T13:06:19.161Z

    Transaction Hash: 0000000000000000000000000000000000000000000000000000000000000000000000
  ```
### Consulta de una transferencia Y-Token
#### Máquina real:
  9. Abir la página de consulta de transacciones de Y-Token:
  ```
  http://192.168.146.150:3000/ytokentransactionquery
  ```
  10. introducir el código hash de la compra anterior y dar al botón OK, se mostrará las informaciones sobre dicha transacción.
  ```
    Y-Token


    Transaction Detail: commands { transfer_asset { src_account_id: "test007@ytoken" dest_account_id: "david@ytoken" asset_id: "ytoken#emarket" description: "init top up" amount: "34.91" } } creator_account_id: "test007@ytoken" created_time: 1656767174946 quorum: 1
  ```
### Consulta de saldo de una cuenta Y-Token
#### Máquina real:
  11. Abir la página de consulta de saldo de Y-Token:
  ```
  http://192.168.146.150:3000/ytoken
  ```
  12. introducir el nombre del usuario y la clave privada de la cuenta Y-Token, luego dar al botón OK y se mostrará el saldo actual de la cuenta:
  ```
    Y-Token#emarket


    Your balance: 40.9
  ```
  
## más funciones:
### Creación de dominios
#### Máquina virtual:
  - Acceder a Iroha-cli como administrador de Y-Token y seguir los siguientes pasos: 
  ```
       1. New transaction (tx) 
       10. Create Domain (crt_dmn)
       Domain Id: pethome 
       Default Role name: user
       2. Send to Iroha peer (send)
       Peer address (172.29.101.121): 172.29.101.121
       Peer port (50051): 50051     
  ```
### Creación de tokens
#### Máquina virtual:
  - Acceder a Iroha-cli como administrador de Y-Token y seguir los siguientes pasos: 
  ```
       1. New transaction (tx) 
       14. Create Asset (crt_ast)
       Asset name: ytoken
       Domain Id: pethome
       Asset precision: 2
       2. Send to Iroha peer (send)
       Peer address (172.29.101.121): 172.29.101.121
       Peer port (50051): 50051     
  ```
### Añadir un nuevo par
#### Máquina virtual:
  - El nuevo par debe tener el bloque génesis original y su clave pública y privada: 
  - Acceder a Iroha-cli como administrador de Y-Token y seguir los siguientes pasos: 
  ```
       1. New transaction (tx) 
       15. Add Peer to Iroha Network (add_peer)
       Full address of a peer: 192.168.146.120
       Public Key: 0000000000000000000000000000000000000000000000000000000000000000
       2. Send to Iroha peer (send)
       Peer address (172.29.101.121): 172.29.101.121
       Peer port (50051): 50051     
  ```
