//Se define una variable de tipo datable, púlica para la página
jQuery(function () {
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html");
    //Activar el evento de click en los botones que vamos a programar
    //Con jquery, los objetos se identifican con "$(#" al inicio del nombre del objeto
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST", "CrearUsuario");
    });
    LlenarComboPerfiles();
});
function LlenarComboPerfiles() {
    LlenarComboXServicios("http://localhost:53166/api/Perfiles/ListarPerfiles", "#cboPerfil");
}

async function EjecutarComando(Comando, Metodo) {
    id_perfil = $("#cboPerfil").val();
    cedula_usuario = $("#txtCedula").val();
    nombre_usuario = $("#txtUsuario").val();
    clave = $("#txtClave").val();
    RepiteClave = $("#txtRepitaClave").val();
    if (clave != RepiteClave) {
        $("#dvMensaje").addClass("alert alert-danger");
        $("#dvMensaje").html("Las claves son diferentes, por favor valide la información");
        return
    }
    //Envía a grabar el usuario
    $("#dvMensaje").html("");
    //Construir el json que se va a enviar al servicio
    let DatosUsuario = {
        id: 0,
        cedula_usuario: cedula_usuario,
        nombre_usuario: nombre_usuario,
        clave: clave,
        salt: ""
    }

    //Enviar los datos al servicio, a través de la función fetch de javascript
    //Los datos del cliente, se pasan por body, en formato json
    //Javascript, tiene un objeto JSON, que permite cambiar de una etructura json, a un texto con formato json
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Usuarios/" + Metodo + "?idPerfil=" + id_perfil,
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosUsuario)
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        $("#dvMensaje").addClass("alert alert-success");
        $("#dvMensaje").html(Resultado);
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").addClass("alert alert-danger");
        $("#dvMensaje").html(_error);
    }
}