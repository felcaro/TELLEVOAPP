# TELLEVOAPP

<!-- - hacer 2 tipos de perfiles -->
<!-- 
- perfil conductor: datos de usuario y auto(los tabs debe tener el agregar viaje y solicitar viaje)
- perfil pasajero : solo datos de usuario(los tabs solo el solicitar viaje) -->


-- xXPIPEXx
<!-- - icono usuario en el editar perfil y en el profile // listo supongo :o -->
<!-- - poner foto de mapa o lo que sea en el viaje // creo que esta listo si no mas tarde lo veo -->


-- negro
<!-- - editar perfil para que solo muestre auto cuando el usuario es conductor -->
<!-- - arreglar login(notificaciones) -->
<!-- - arreglar contraseñas del editar perfil y si hay sesion o no -->
<!-- - arreglar el confirmar del editar perfil para que valide los datos del auto  -->
<!-- - complementar api mapa con la imagen del viaje -->
<!-- - verificar el eliminar del viaje -->
<!-- - hacer que los viajes aceptados por los usuarios pasajeros se pongan en el home, copiar y pegar el modal del buscar viaje completo -->

-- ITAMIS
<!-- - Diseño semi profesional
- Animaciones (2)
- transicion tema black -->



CASO UBER (Pueden dejar uno de estos puntos para la tercera entrega debido a que el caso es mas extenso, basicamento por los 2 perfiles que deben programar).

<!-- 5  - Login (LocalStorage) -->
<!-- 10 - Registro (localStorage) -->
10 - Recuperar Contraseña (API Myths.cl/api)    FALTA ESTILO
<!-- 10 - Pagina Perfil (datos personales - viajes creados o solicitados) -->
<!-- 10 - Pagina Crear o Solicitar viaje (depende del perfil de usuario)   CREAR LISTO -->
<!-- 10 - Diseño semi profesional -->
<!-- 10 - Animaciones (3) -->



-- para ofrecer viaje es necesario que ademas de que esten todos los campos con datos(ya esta lista esa funcion), tiene que haber una sesion iniciada(currentuser), si no no puede darle a ofrecer viaje.

-- en el home agregar la funcion condicional, de cuando un pasajero acepta un viaje cambiar eso y que sea solicitar viaje, y el conductor, donde deveria ir el viaje aceptado en el home, replciar lo mismo del pasajero, que aparesca el viaje y un boton de aceptar solicitud, en el pasajero deve decir en ves de cancelar viaje, deve decir esperando solicitud, y cuando sea aceptado, que hay aparesca el cancelar viaje 


-- en el html de find ride, cambiar el aceptar por solicitar viaje, la idea es solicitar viaje no que se acepte, despues se espicifica mas
-- con el cambio hecho de solicitar en ves de aceptar en el TS cambiar esto para que sea condicional y epserar la respuesta de si se acepta el viaje por parte del conductor
-- en el html home, con el condicional de solicitud de viaje, copiar la forma que tiene el viaje aceptado, solo que en ves del boton de cancelar viaje que tiene el pasajero, ahora como conductor devo decidir si aceptar la solicitud de viaje o no, esto depende obvio del conductor, por eso copiar la forma de como se muestra el viaje en el html y hacerlo para el conductor, mostrando los datos del viaje y el pasajero que lo solicita(nombre)
-- hacer los cambios en el TS para que esto funcione, RECORDAR: en metodo antigua era solo que el pasajero aceptaba el viaje y ese viaje se iba para el home del pasajero para ver la informacion de esta, AHORA la idea es hacer que el pasajero haga una solicitud para el viaje(cambios de html y ts en el find ride para la solicitud), y que ahora el conductor del viaje desde el home(hacer cambios en el home, copiar la forma del viaje del pasajero y en ves de cancelar el viaje sea aceptar solicitud), aceptar la solictud de este y asi que el viaje se acepte para el pasajero y ahi recien este la opcion de cancelar viaje. 
-- EXTRA: se solicita que por cada pasajero "aceptado", el espacio de asientos disponibles baje -1 hasta llegar a 0 que es cuando ya el viaje "desaparece" de los find ride como viaje disponible, la idea es hacerlo invisible
-- EXTRA 2: se solicita que para el home del conductor aparesca el viaje que creo junto con los asientos disponbles y los pasajeros(nombre), tambien desde ese mismo lugar deve de poder eliminar el viaje(con confirmacion), se aconseja aqui copiar las funciones del find ride para hacerlo mas rapido
<!-- NOTAS  -->
--YA ESTA LISTO EL cargarViajesCreados para el home del conductor queda lo demas, ahi que revisar bien los demas codigos para ver si podemos utilizar algo a nuestro favor
--HAY UN PEQUEÑO PROBLEMA CON EL SOLICTAR, QUE BAJA EN NUMERO DE ASIENTOS Y LA IDEA ES QUE EL NUMERO BAJE CUANDO LA SOLICITUD ES ACEPTADA


haber funciona bien hasta cierto punto te explico, hay varios puntos que ver te los detallo: 
--funciona enviar la solicitud, pero la idea de aceptar el viaje es primero que nada cuando el conductor crea el viaje este automaticamente se va al find ride(esto ya funciona), lo que quiero yo es que tambien se vaya para el home y ahi esta el viaje ya?, con la opcion de borrar el viaje o no y ademas estan la solicitudes de viaje, es aparte, es: 1-viaje con todo, los pasajeros el destino, salida asientos,etc. y 2-la solicitud con el nombre del pasajero, eso quiero.
--TAMBIEN DE SUMA IMPORTACIA Y ES DEVERIA SER LO PRIMERO, TODO TIENE QUE ESTAR CONECTADO, me refiero a que si acepto un pasajero, el asiento disponible baja no?, entonces tambien en el find ride el asiento deveria bajar, hasta que llegue a 0 y desaparesca del find ride, no me refiero a borrarlo solo a ocultarlo, es de suma importacia.
--Tabmien siguiendo con que todo deve estar conectado, en el home del pasajero no aparece del viaje aceptado y de nuevo en el find-ride todavia puedo enviar solicitudes, eso no se deveria poder solo 1 a la vez, si rechazan la solicitud ahi se puede enviar de nuevo 
--YA ESTA LISTO EL cargarViajesCreados para el home del conductor queda lo demas, ahi que revisar bien los demas codigos para ver si podemos utilizar algo a nuestro favor
