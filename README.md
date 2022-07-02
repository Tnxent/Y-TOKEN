# Y-TOKEN
Y-Token es un proyecto basado en la tecnología Hyperledger Iroha que permite crear una red de cadena de bloques (Blockchain) de consorcio de tokens personalizados que es capaz de resolver los problemas como dificultades regulatorias y la opacidad de la información en el proceso de circulación y emisión de tokens.

## Comenzando:
Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento para propósitos de desarrollo y pruebas.
Mira [Despliegue del proyecto](#despliegue-del-proyecto) para conocer como desplegar el proyecto.

### Pre-requisitos:
Para su despliegue necesitamos dos máquinas, una máquina virtual como servidor y otra máquina real como cliente.
Máquina virtual(Ubuntu 20.04.2 LTS x64)
     * Dirección IP: **192.168.146.150** con acceso a internet
     * Docker version: 20.10.5
     * Docker-compose version: 1.26.0
     * Conexión con la máquina real
Máquina real (Windows 10)
     * Navegador Google Chrome
     * Conexión con la máquina virtual

## Despliegue del proyecto:
Para simplificar el proceso de despliegue, se ha creado un fichero docker-compose que nos permite poner en marcha el proyecto completo con un solo commando.

### Máquina virtual:
  1. Clonar siguientes fichero y carpetas y agruparlos en un mismo directorio de la máquina virtual 
       * [docker-compose.yml](path%20with%20spaces/other_file.md)
       * [node1](path%20with%20spaces/other_file.md)
       * [node2](path%20with%20spaces/other_file.md)
       * [node3](path%20with%20spaces/other_file.md)
  2. Abir el terminal, navegar al directorio donde reside el fichero docker-compose y ejecutar siguente comando: 
  ```
       sudo docker-compose up
  ```
### Máquina real:
  3. Abir el Chrome con el CORS desabilitaod haciendo Win+R y introduciendo siguiente:
  ```
       chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
  ```
  4. Abrir la página principal de E-Marketplace introduciendo en la barra de direcciones:
  ```
       http://192.168.146.150:3000/
  ```
  
  
## Pruebas:
En este apartado se realizan pruebas de las funciones principales del proyecto.
     * Emisión de Y-Token y su asignación al administrador de un dominio.
     * Registración de una cuenta Y-Token.
     * Aumento de saldo de una cuenta Y-Token.
     * Transferencia de Y-Token.
     * Consulta de saldo de una cuenta Y-Token.
     * Transferencia de Y-Token.
     * Consulta de una transferencia Y-Token.

### Emisión de Y-Token y su asignación al administrador de un dominio
#### Máquina virtual:
  1. Abir una nueva ventana del terminal (sin cerrar la de anterior) y ejecutar siguientes comandos para acceder al iroha-cli con la cuenta del administrador.
  ```
       sudo docker exec -it ytoken-iroha1 /bin/bash
       iroha-cli -account_name admin@ytoken
  ```
  2. Seguir siguientes pasos para asignar 1000 Y-Tokens para la cuenta del administrador de E-Marketplace: 
  ```
       1. New transaction (tx) 
       16. Add Asset Quantity (add_ast_qty) 
       Asset Id: ytoken#emarket
       Amount to add, e.g 123.456: 1000
       2. Send to Iroha peer (send)
       Peer address (0.0.0.0): 172.29.101.121
       Peer port (50051): 50051     
  ```
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
  3. Abir la página de registración de cuentas Y-Token introduciendo en la barra de direcciones:
  ```
       http://192.168.146.150:3000/ytokenregister
  ```
  4. introducir un nombre de usuario y dar al botón Sign Up, después de varios segundos se mostrará tanto la clave pública como la clave privada del usuario que se debe apuntar en un sitio suficientemente seguro:
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
  5. Abir la página de recarga de Y-Token introduciendo en la barra de direcciones:
  ```
       http://192.168.146.150:3000/ytokenaddfounds
  ```
  6. introducir el nombre del usuario y la cantidad que se desea aumentar (se recomienda 100 o más), al dar al botón PayPal, se mostrará una ventanilla de pago de PayPal que está enlazada con una cuenta PayPal de Sandbox, es decir, lo que se gasta no es dinero real. Una vez cofirmado el pago se mostrará el mensaje de resultado de la recarga realizada:
  ```
   Y-Token#emarket

   The payment has been completed and the funds have been added successfully to your account balance.

   Your Account: test007@ytoken

   Transaction Hash: 0000000000000000000000000000000000000000000000000000000000000000000000
  ```
