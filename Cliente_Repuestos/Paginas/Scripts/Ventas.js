var oTabla = $("#tblVentas").DataTable();
jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    //Invoca la función que llena el combo de tipos de producto
    //LlenarComboCategoria();
    LlenarComboRepuestos()
    //LlenarTablaVentas();
    LlenarTabla();
    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST");
    });
    $("#btnEliminar").on("click", function () {
        EjecutarComando("DELETE");
    });
    $("#btnConsultar").on("click", function () {
        Consultar();
    });
});

async function LlenarTabla() {
    let CodigoVenta = $("#txtCodigoVenta").val();
    LlenarTablaXServiciosAuth("http://localhost:53166/api/Ventas/LlenarTablaVenta?CodigoVenta=", + CodigoVenta, "#tblVentas");
}

//async function LlenarComboCategoria() {
//    let rpta = await LlenarComboXServicios("http://localhost:53166/api/Categoria/LlenarCombo", "#cboCategoria");
//    LlenarComboRepuestos();
//}

async function LlenarComboRepuestos() {
    let rpta = await LlenarComboXServicios("http://localhost:53166/api/Repuesto/LlenarCombo", "#cboRepuesto");
    PresentarValorUnitario();
}

function PresentarValorUnitario() {
    let DatosRepuesto = $("#cboRepuesto").val();
    let CodigoRepuesto = DatosRepuesto.split('|')[0];
    let ValorUnitario = DatosRepuesto.split('|')[1];
    $("#txtUnitario").val(ValorUnitario);
    $("#txtCodigoRepuesto").val(CodigoRepuesto);
    $("#txtValorUnitario").val(ValorUnitario);
    CalcularSubtotal();
}

function CalcularSubtotal() {
    let ValorUnitario = $("#txtUnitario").val();
    let Cantidad = $("#txtCantidad").val();
    $("#txtTotal").val(Cantidad * ValorUnitario);
}

async function Eliminar(codigoVenta) {
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Ventas/EliminarVenta?codigoVenta=" + codigoVenta,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        //Leer la respuesta del servicio
        const Resultado = await Respuesta.json();
        LlenarTabla();
    }
    catch (_error) {
        //Presentar a respuesta del error en el html
        $("#dvMensaje").html(_error);
    }
}

//async function LlenarTablaVentas() {
    
//    //Solo se invoca el fetch
//    try {
//        const Respuesta = await fetch("http://localhost:53166/api/Ventas",
//            {
//                method: "GET",
//                mode: "cors",
//                headers: { "Content-Type": "application/json" }
//            });
//        //Leer la respuesta del servicio
//        const Resultado = await Respuesta.json();
//        var Columnas = [];
//        NombreColumnas = Object.keys(Resultado[0]);
//        for (var i in NombreColumnas) {
//            Columnas.push({
//                data: NombreColumnas[i],
//                title: NombreColumnas[i]
//            });
//        }
//        // Llenado de tabla
//        $("#tblVentas").DataTable({
//            data: Resultado,
//            columns: Columnas,
//            destroy: true
//        });
//    }
//    catch (_error) {
//        //Presentar a respuesta del error en el html
//        $("#dvMensaje").html(_error);
//    }
//}

//async function LlenarComboRepuesto() {
//    let CodigoCategoria = $("#cboCategoria").val();
//    //Solo se invoca el fetch
//    try {
//        const Respuesta = await fetch("http://localhost:53166/api/Repuesto/LlenarCombo?CodigoCategoria=", + CodigoCategoria,
//            {
//                method: "GET",
//                mode: "cors",
//                headers: { "Content-Type": "application/json" }
//            });
//        //Leer la respuesta del servicio
//        const Resultado = await Respuesta.json();
//        //Presentar a respuesta en el html

//        //Se debe recorrer para llenar el combo
//        for (i = 0; i < Resultado.length; i++) {
//            $("#cboRepuesto").append('<option value="' + Resultado[i].Codigo + '">' + Resultado[i].Nombre + '</option>');
//        }
//    }
//    catch (_error) {
//        //Presentar a respuesta del error en el html
//        $("#dvMensaje").html(_error);
//    }
//    PresentarValorUnitario();
//}

async function EjecutarComando(Comando) {
    let codigo_venta = $("#txtCodigoVenta").val();
    let nombre_cliente = $("#txtNombreCompleto").val();
    let codigo_repuesto = $("#cboRepuesto").val();
    let cantidad = $("#txtCantidad").val();
    let precio_total = $("#txtTotal").val();

    //Crear la estructura json
    let DatosVenta = {
        codigo: codigo_venta,
        fecha_venta: fecha_venta,
        codigo_repuesto: codigo_repuesto,
        cantidad: cantidad,
        nombre_cliente: nombre_cliente,
        precio_total: precio_total
    }
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Ventas/AgregarProducto",
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
    
    let cedula = $("#txtCedula").val();
    $("#dvMensaje").html("");
    //Fetch para grabar en la base de datos
    try {
        const Respuesta = await fetch("http://localhost:53166/api/Cliente?cedula=" + cedula,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Las respuestas se escriben en el html
        $("#txtNombreCompleto").val(Resultado.nombre);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}