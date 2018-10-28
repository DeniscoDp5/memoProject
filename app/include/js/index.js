var global = {
    scope: this,
    main: $("#main-content")
};

function startLoading() {
    $.ajax({
        url: 'http://localhost:8080/memo',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            data.response.forEach(function (el) {
                this.memoElementAdd(el);
            }, global.scope);
        }
    })
};

/**
 * this function is responsable for creating the basic row-Element
 */
memoElementAdd = function (data) {

    var row =
        $("<div/>", {
            class: 'row form-group '
        }).append(
            $("<div/>", {
                class: "col-sm memo-text-container",
                "data-memoid": data.id
            }).append(
                $('<p/>', {
                    text: data.title,
                    class: 'memo-title'
                }))
                .append(
                    $('<p/>', {
                        text: data.description,
                        class: 'memo-description'
                    }))
                .append(
                    $('<button/>', {
                        text: "modify",
                        click: function () {
                            global.scope.onModifyButon(
                                this,
                                this.parentElement.getAttribute('data-memoid')
                            )
                        }
                    }))
                .append(
                    $('<button/>', {
                        text: 'delete',
                        click: function () {
                            global.scope.onDeleteButton(
                                this,
                                this.parentElement.getAttribute('data-memoid')
                            )
                        }
                    })
                )
        );
    global.main.prepend(row)
};

/**
 * @param button The button clicked
 * @param id The id of the memo
 */
onModifyButon = function (button, id) {
    console.log('modify button')
}

/**
 * @param button The button clicked
 * @param id The id of the memo
 */
onDeleteButton = function (button, id) {
    console.log('delete Button');
    $.ajax({
        url: 'http://localhost:8080/memo/' + id,
        type: 'DELETE',
        success: function (data, textStatus, jqXHR) {
            button.parentElement.parentElement.remove();
        }
    })
};

onAddClick = function () {
    /**
     * Fomr creation TODO: find way to create form in a better way
     */
    var popup = $('<div/>', {
        div: 'popup',
        class: 'popup'
    }).append($('<div/>', {
        class: 'modal-content'
    }).append($('<span/>', {
        class: 'close',
        text: 'X',
        click: function () {
            global.scope.onCloseClick()
        }
    })).append($('<form/>', {
        id: 'memoForm'
    }).append($('<div/>', {
        class: 'form-group'
    }).append($('<label/>', {
        for: 'memoTitle',
        text: "Memos'title"
    })).append($('<input>', {
        class: "form-control",
        id: 'memoTitle',
        placeholder: "Inserti Memo title",
        type: 'text'
    }))).append($('<div/>', {
        class: 'form-group'
    }).append($('<label/>', {
        text: "Memo's description",
        for: 'memoDescription'
    })).append($('<textarea/>', {
        class: 'form-control',
        id: 'memoDescription'
    }))).append($('<button/>', {
        type: 'button',
        class: 'btn btn-primary',
        html: 'add Memo',
        click: function () {
            var memoForm = $('#memoForm');
            global.scope.onSubmitClick(
                memoForm.find('#memoTitle').val(),
                memoForm.find('#memoDescription').val()
            );
        }
    }))));

    global.popup = popup;
    global.main.append(global.popup);

};

onCloseClick = function () {
    global.popup.remove();
};

/**
 * controller for the form
 * @param {String} title the title inserted in the form
 * @param {String} description The  body text in the text area
 */
onSubmitClick = function (title, description) {
    /**
     * parameters validation
     * TODO: add a better feedback for the user. Add a better validation
     */
    if(title == "" || description == "") {
        console.log('Invalid parameters inserted, add title or description');
        return;
    }

    $.ajax({
        url: 'http://localhost:8080/memo',
        type: 'POST',
        data: {
            title: title,
            description: description
        },
        success: function (data, textStatus, jqXHR) {
            global.scope.memoElementAdd(data.data[0]);
            global.scope.onCloseClick();
        },
        error: function () {
            console.log('Error on iserting the data') ;
        }
    })
}