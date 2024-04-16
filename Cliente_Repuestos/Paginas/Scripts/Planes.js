jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");

    $("#btnGrabar").on("click", function () {
        Insertar();
    });
});

async function Insertar() {

    var txtDocumento = $("#txtDocumento").val();
    var txtNombre = $("#txtNombre").val();
    var txtCelular = $("#txtCelular").val();
    var txtFechaCompra = $("#txtFechaCompra").val();
    var txtPlan = $("#txtPlan").val();

    let DatosCliente = {
        txtDocumento: txtDocumento,
        txtNombre: txtNombre,
        txtCelular: txtCelular,
        txtFechaCompra: txtFechaCompra,
        txtPlan: txtPlan
    }

    try {
        const Respuesta = await fetch("http://localhost:58210/api/Planes",
            {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DatosCliente)
            });
        
        const Resultado = await Respuesta.json();
        
        $("#dvMensaje").html(Resultado);
    }
    catch (_error) {
        
        $("#dvMensaje").html(_error);
    }
}