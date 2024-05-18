jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    //Invoca la función que llena el combo de tipos de producto
    LlenarComboDepartamento();
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST");
    });
});

async function LlenarComboDepartamento() {
    //Invoca el método GET, del servicio de tipos de producto
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Departamento",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
        //El resultado está en formato JSON con la lista de tipos de producto
        //Se debe recorrer para llenar el combo
        for (i = 0; i < Resultado.length; i++) {
            $("#cboDepartamento").append('<option value="' + Resultado[i].codigo + '">' + Resultado[i].nombre + '</option>');
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}

async function EjecutarComando(Comando) {
    //Se captura la información del empleado
    let nombre = $("#txtNombre").val();
    let codigo_departamento = $("#cboDepartamento").val();

    //Crear la estructura json
    let DatosCiudad = {
        nombre: nombre,
        codigo_departamento: codigo_departamento
    }
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Ciudad",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosCiudad)
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