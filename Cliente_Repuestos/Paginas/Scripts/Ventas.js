var oTabla = $("#tblProveedores").DataTable();
jQuery(function () {
    $("#dvMenu").load("../../Paginas/Menu.html");
    //Invoca la función que llena el combo de tipos de producto
    LlenarComboCategoria();
    LlenarTablaRepuestos();
    LlenarTabla();
    LenarCombo();
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST");
    });
    $("#btnActualizar").on("click", function () {
        EjecutarComando("PUT");
    });
    $("#btnEliminar").on("click", function () {
        EjecutarComando("DELETE");
    });
    $("#btnConsultar").on("click", function () {
        Consultar();
    });
});

async function LlenarTabla() {
    LlenarTablaXServicios("http://localhost:53166/api/Repuesto", "#tblProveedores");
}

async function LlenarCombo() {
    LlenarComboXServicios("http://localhost:53166/api/Categoria", "#cboCategoria");
}

async function LlenarTablaRepuestos() {
    //Invoca el método GET, del servicio de tipos de producto
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Categoria",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        var Columnas = [];
        NombreColumnas = Object.keys(Resultado[0]);
        for (var i in NombreColumnas) {
            Columnas.push({
                data: NombreColumnas[i],
                title: NombreColumnas[i]
            });
        }
        // Llenado de tabla
        $("#tblRepuestos").DataTable({
            data: Resultado,
            columns: Columnas,
            destroy: true
        });
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}

async function LlenarComboCategoria() {
    //Invoca el método GET, del servicio de tipos de producto
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Categoria",
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
            $("#cboCategoria").append('<option value="' + Resultado[i].codigo + '">' + Resultado[i].nombre + '</option>');
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}

async function EjecutarComando(Comando) {
    //Se captura la información del empleado
    let Codigo = $("#txtCodigo").val();
    let Nombre = $("#txtNombre").val();
    let Descripcion = $("#txtDescripcion").val();
    let Precio = $("#txtPrecio").val();
    let Categoria = $("#cboCategoria").val();

    //Crear la estructura json
    let DatosRepuesto = {
        Codigo: Codigo,
        Nombre: Nombre,
        Descripcion: Descripcion,
        Precio: Precio,
        CodigoCategoria: Categoria
    }
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Repuesto",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosRepuesto)
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        // Volver a llenar la tabla para ver las actualizaciones
        //LlenarTablaProductos();
        //Presenta el resultado en el html
        $("#dvMensaje").html(Resultado);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}

async function Consultar() {
    //Solo se captura la información del documento del empleado y se invoca el servicio
    let Codigo = $("#txtCodigo").val();
    $("#dvMensaje").html("");
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Repuesto?codigo=" + Codigo,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Las respuestas se escriben en el html
        $("#txtNombre").val(Resultado.Nombre);
        $("#txtDescripcion").val(Resultado.Descripcion);
        $("#txtPrecio").val(Resultado.Precio);
        $("#cboCategoria").val(Resultado.CodigoCategoria);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}