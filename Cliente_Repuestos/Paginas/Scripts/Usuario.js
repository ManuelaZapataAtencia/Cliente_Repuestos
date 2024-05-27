//Se define una variable de tipo datable, púlica para la página
var oTabla = $("#tblUsuarios").DataTable();
jQuery(function () {
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html");
    //Activar el evento de click en los botones que vamos a programar
    //Con jquery, los objetos se identifican con "$(#" al inicio del nombre del objeto
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST", "CrearUsuario");
    }); 
    $("#btnActualizar").on("click", function () {
        EjecutarComando("PUT", "ActualizarUsuario");
    });
    $("#btnDesactivar").on("click", function () {
        EjecutarComando("PUT", "DesactivarUsuario");
    });
    $("#btnActivar").on("click", function () {
        EjecutarComando("PUT", "ActivarUsuario");
    });
    LlenarComboPerfiles();
    LlenarTablaUsuarios();
});
function Editar(Documento, Empledo, Cargo, Usuario, idPerfil) {
    $("#txtDocumento").val(Documento);
    $("#txtUsuario").val(Usuario);
    $("#txtNombre").val(Empledo);
    $("#txtCargo").val(Cargo);
    $("#cboPerfil").val(idPerfil);
}
function LlenarComboPerfiles() {
    LlenarComboXServicios("http://localhost:53166/api/Perfiles/ListarPerfiles", "#cboPerfil");
}
function LlenarTablaUsuarios() {
    LlenarTablaXServicios("http://localhost:58511/api/Usuarios/ListarUsuariosPerfil", "#tblUsuarios");
}

async function EjecutarComando(Comando, Metodo) {
    idPerfil = $("#cboPerfil").val();
    Documento = $("#txtDocumento").val();
    Usuario = $("#txtUsuario").val();
    Clave = $("#txtClave").val();
    RepiteClave = $("#txtConfirmaClave").val();
    if (Clave != RepiteClave) {
        $("#dvMensaje").html("Las claves son diferentes, por favor valide la información");
        return
    }
    //Envía a grabar el usuario
    $("#dvMensaje").html("");
    //Construir el json que se va a enviar al servicio
    let DatosUsuario = {
        id: 0,
        cedula_usuario: Documento,
        nombre_usuario: Usuario,
        clave: clave,
        salt: ""
    }

    //Enviar los datos al servicio, a través de la función fetch de javascript
    //Los datos del cliente, se pasan por body, en formato json
    //Javascript, tiene un objeto JSON, que permite cambiar de una etructura json, a un texto con formato json
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Usuarios/" + Metodo + "?idPerfil=" + idPerfil,
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosUsuario)
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        $("#dvMensaje").html(Resultado);
        LlenarTablaUsuarios();
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}
async function Buscar() {
    let Documento = $("#txtDocumento").val();
    try {
        const Respuesta = await fetch("http://localhost:58511/api/Empleados/ConsultarConCargo?Documento=" + Documento,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        if (Resultado[0] != undefined) {
            $("#txtNombre").val(Resultado[0].NombreCompleto);
            $("#txtCargo").val(Resultado[0].Cargo);
            $("#dvMensaje").html("");
        }
        else {
            $("#txtNombre").val("");
            $("#txtCargo").val("");
            $("#dvMensaje").html("No existe ningún empleado con el documento digitado");
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}