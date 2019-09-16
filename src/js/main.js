//Переделать под ES6

function depoFunc(){

    let depositCoins =  document.getElementById("depositCoin").value;
    // let dataSys = new Date();
    let dataSys =  clrDate();
    let outBalansHTML = "<div class='action__place__balans'>" +depositCoins + '' + '<label>руб.</label><p>внесено </p>'+  dataSys + '</div>';

    //alert(depositCoins + dataSys);
    // ToDo Применю для изменения текста
    // document.getElementById("action__balans").innerText = + depositCoins + "<label> руб </label>";
    document.getElementById("action__balans").innerHTML = outBalansHTML;
    document.getElementById("depositCoin").value = "0";

};
//Почистим Date
function clrDate() {
    let dataSys = new Date();
    let getHrs = dataSys.getHours();
    let getMin = dataSys.getMinutes();
    let getDate = dataSys.getDate();
    let getMouth = dataSys.getMonth();
    let getYear  = dataSys.getFullYear();

    return getHrs + " " + "ч." + " " +  getMin + " " +  "мин" + "  " + getDate + "." + getMouth + "." + getYear;
}



function validCoins(eventPressUp) {
    eventPressUp.value = eventPressUp.value.replace(/[^0-9]/g," ");
};



function  focusClear() {
    if (this.value == 'Ваш email')
        {this.value=''}

};


function focusOut(){
    if (this.value == '')
        {this.value='0'}
};




document.getElementById("acceptCoins").onclick = depoFunc;






function validForm(f) {
    // Если введено число, то скрываем предупреждение
    if (isDigit(f.value)) document.getElementById("msg").style.display = "none";
    // В противном случае отображаем предупреждение
    else document.getElementById("msg").style.display = "inline";
}


// Функция по проверке, число введено или нет
function isDigit(data) {
    var numStr="0123456789";
    var k = 0;
    for (i=0;i<data.length;i++) {
        thisChar = data.substring(i, i+1);
        if (numStr.indexOf(thisChar) != -1) k++;
    }
    if (k == data.length) return 1;
    else return 0;
}


//ToDo Попробовать это для валидации ввода coins
//"if ( isNaN(this.value + String.fromCharCode(event.keyCode) )) return false;"


// <form action="">
//     <p>Введите любое число.</p>
// <p><input type="text" name="num" onkeyup="validForm(this)">
//     <span id="msg">Вы ошиблись. Пожалуйста, введите число.</span></p>
// </form>



