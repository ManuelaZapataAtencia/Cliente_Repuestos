var oTabla = $("#tblVentas").DataTable();
jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    //Invoca la función que llena el combo de tipos de producto
    LlenarComboRepuesto();
    LlenarTablaVentas();
    LlenarTabla();
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
    LlenarTablaXServicios("http://localhost:53166/api/Ventas", "#tblVentas");
}

async function LlenarCombo() {
    LlenarComboXServicios("http://localhost:53166/api/ListRepuesto", "#cboRepuesto");
}

async function LlenarTablaVentas() {
    
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Ventas",
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
        $("#tblVentas").DataTable({
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

async function LlenarComboRepuesto() {
    
    //Solo se invoca el fetch
    try {
        const Respuesta = await fetch("http://localhost:53166/api/ListaRepuesto",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        //Presentar a respuesta en el html
       
        //Se debe recorrer para llenar el combo
        for (i = 0; i < Resultado.length; i++) {
            $("#cboRepuesto").append('<option value="' + Resultado[i].codigo + '">' + Resultado[i].nombre + '</option>');
        }
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}

async function EjecutarComando(Comando) {
    
    let fecha_venta = $("#dtFechaVenta").val();
    let codigo_repuesto = $("#cboRepuesto").val();
    let cantidad = $("#txtCantidad").val();

    //Crear la estructura json
    let DatosVenta = {
        id_venta: id_venta,
        fecha_venta: fecha_venta,
        codigo_repuesto: codigo_repuesto,
        cantidad: cantidad
    }
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Ventas",
            {
                method: Comando,
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosVenta)
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

async function Consultar() {
    
    let codigo = $("#txtCodigo").val();
    $("#dvMensaje").html("");
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Ventas/" + codigo,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Las respuestas se escriben en el html
        $("#dtFechaVenta").val(Resultado.fecha_venta);
        $("#txtCantidad").val(Resultado.cantidad);
        $("#txtValor").val(Resultado.precio_total);
        $("#cboRepuesto").val(Resultado.codigo_repuesto);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}