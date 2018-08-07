var objMarcas = {};
var objModelos = {};
var marca;
var tipo;
var id;
var ano;

$( document ).ready(function() {

    $(".form-select").on('change', function() {

        let className = $(this).attr('data-id');

        switch (className) {
            case "vehicle":

                $(".type-marca option:not(:first)").remove();
                $(".type-modelo option:not(:first)").remove();
                $(".type-ano option:not(:first)").remove();

                $(".type-marca").val("default").change();
                $(".type-modelo").val("default").change();
                $(".type-ano").val("default").change();

                $(".type-modelo").prop("disabled", true);
                $(".type-ano").prop("disabled", true);


                tipo = $(this).val();
                buscarMarcas(tipo);
                $(".type-marca").prop("disabled", false);
            break;


            case "marca":

                $(".type-modelo option:not(:first)").remove();
                $(".type-ano option:not(:first)").remove();

                $(".type-modelo").val("default").change();
                $(".type-ano").val("default").change();

                $(".type-ano").prop("disabled", true);

                marca = $(this).val();

                $.each(objMarcas, function(i , field) {
                    if(field.name == marca){
                        buscarModelo(field.id);
                        marca = field.id;
                    }
                })

                $(".type-modelo").prop("disabled", false);
            break;


            case "modelo":

                $(".type-ano option:not(:first)").remove();

                $(".type-ano").val("default").change();

                let valor = $(this).val();

                $.each(objModelos, function(i , field) {
                    if(field.name == valor){
                        id = field.id;
                        buscarAno(tipo, marca, id);
                    }
                })

                $(".type-ano").prop("disabled", false);
            break;
        }

    });

    $(".form-button").on("click", function(event) {
        event.preventDefault();
        exibirResult(tipo, marca, id, $(".type-ano").val());
    });

    $(".new-search").on("click", function() {
        newSearch();
    });

});


function buscarMarcas(tipo) {
    $(".spinner").show();
    $.getJSON("http://fipeapi.appspot.com/api/1/"+tipo+"/marcas.json", function(result){
        $.each(result, function(i, field){
            let marcas = $(".type-marca");
            let option = $("<option>");
            option.val(field.name).text(field.fipe_name);
            marcas.append(option);
            objMarcas[i] = field;
        });
    }).always(function() {
        $(".spinner").hide();
    });
}

function buscarModelo(marca, tipo) {
    $(".spinner").show();
    $.getJSON("http://fipeapi.appspot.com/api/1/"+tipo+"/veiculos/"+marca+".json", function(result){
        $.each(result, function(i, field){
            let modelo = $(".type-modelo");
            let option = $("<option>");
            option.val(field.name).text(field.fipe_name);
            modelo.append(option);
            objModelos[i] = field;
        });
    }).always(function() {
        $(".spinner").hide();
    });
}

function buscarAno(tipo, marca, id) {
    $(".spinner").show();
    $.getJSON("http://fipeapi.appspot.com/api/1/"+tipo+"/veiculo/"+marca+"/"+id+".json", function(result){
        $.each(result, function(i, field){
            let tipe = $(".type-ano");
            let option = $("<option>");
            option.val(field.fipe_codigo).text(field.name);
            tipe.append(option);
        });
    }).always(function() {
        $(".spinner").hide();
    });
}

function exibirResult(tipo, marca, id, ano) {
    $(".spinner").show();
    $.getJSON("http://fipeapi.appspot.com/api/1/"+tipo+"/veiculo/"+marca+"/"+id+"/"+ano+".json", function(result){
        $(".codigo").text("Código Fipe: " + result.fipe_codigo);
        $(".veiculo").text("Veículo: " + result.veiculo);
        $(".marca").text("Marca: " + result.marca);
        $(".ano").text("Ano: " + result.ano_modelo);
        $(".combustivel").text("Combustível: " + result.combustivel);
        $(".preco").text("Preço: " + result.preco);

        $(".resultado-veiculo-component").show();
    }).fail(function() {
        alert("Por favor selecione todos os campos!");
    })
    .always(function() {
        $(".spinner").hide();
    });
}

function newSearch() {
    $(".resultado-veiculo-component").hide();
    $(".type-marca option:not(:first)").remove();
    $(".type-modelo option:not(:first)").remove();
    $(".type-ano option:not(:first)").remove();

    $(".type-vehicle").val("default").change();
    $(".type-marca").val("default").change();
    $(".type-modelo").val("default").change();
    $(".type-ano").val("default").change();

    $(".type-marca").prop("disabled", true);
    $(".type-modelo").prop("disabled", true);
    $(".type-ano").prop("disabled", true);
}
