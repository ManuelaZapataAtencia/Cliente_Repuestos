﻿jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    //Invoca la función que llena el combo de tipos de producto
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST");
    });
});

async function EjecutarComando(Comando) {
    //Se captura la información del empleado
    let nombre = $("#txtNombre").val();

    //Crear la estructura json
    let DatosDepartamento = {
        nombre: nombre,
    }
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Departamento",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosDepartamento)
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        // Volver a llenar la tabla para ver las actualizaciones
        //Presenta el resultado en el html
        $("#dvMensaje").html(Resultado);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}