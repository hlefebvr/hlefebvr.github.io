function add_inequality() {
    let obj = $("<div></div>");
    let model = $("#inequality_model").html();
    obj.html(model);
    obj.addClass("inequality");
    $("#inequalities").append(obj);
}

function to_sage_vec(x_1, x_2, x_3, sign, rhs) {
    let mul_x = 0
    let mul_rhs = 0
    if (sign == "<=") {
        mul_x = -1
        mul_rhs = 1
    } else if (sign == ">=") {
        mul_x = 1
        mul_rhs = -1 
    } else if (sign == "=") {
        return to_sage_vec(x_1,x_2,x_3,"<=",rhs) + to_sage_vec(x_1,x_2,x_3,">=",rhs)
    } else {
        alert("Unrecognized sign: " + sign)
    }
    x_1 = (parseFloat(x_1) * mul_x).toString()
    x_2 = (parseFloat(x_2) * mul_x).toString()
    x_3 = (parseFloat(x_3) * mul_x).toString()
    rhs = (parseFloat(rhs) * mul_rhs).toString()
    return "[" + rhs + "," + x_1 + "," + x_2 + "," + x_3 + "],"
}

function plot() {
    let sage = "Polyhedron(ieqs = [";
    $("#inequalities").children().each(function(idx, obj) {
        const x_1 = $(this).find(".coeff_x_1").val()
        const x_2 = $(this).find(".coeff_x_2").val()
        const x_3 = $(this).find(".coeff_x_3").val()
        const rhs = $(this).find(".rhs").val()
        const sign = $(this).find(".sign").val()
        sage += to_sage_vec(x_1, x_2, x_3, sign, rhs)
    })
    sage += "]).plot()"
    $(".sagecell_commands").val(sage)
    $(".sagecell_evalButton").trigger("click");
}

function handleFocusIn(obj) {
    if ( parseFloat(obj.value) == 0.0 ) {
        obj.value = ""
    }
}

function handleFocusOut(obj) {
    if ( obj.value == "" || parseFloat(obj.value) == 0.0 ) {
        obj.value = "0"
    }
}

function remove_inequality(obj) {
    obj.parentNode.remove()
}

$(document).ready(function() {
    add_inequality()
    sagecell.makeSagecell({
        "inputLocation": "#sage", 
        "editor": "textarea",
        "callback": function() {
            $(".sagecell_evalButton").trigger("click");
        }
    });
})
