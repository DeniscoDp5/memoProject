function onButtonPress() {
    $.ajax({
        url: 'http://localhost:8080/tasks',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            var element = document.getElementById('responseArea');
            element.innerHTML = data;
        }
    })
}