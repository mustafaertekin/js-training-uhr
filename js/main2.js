/**
 * 
 * Bu program, ekranda, digital olarak input girilen saat ifadelerini, text formatina ceviriyor.
 * Varsayilanlar
 * 1) Input alaninin ekranda olmasi lazim
 * 2) Islemi baslatmak icin buton
 * 3) Output alani olmasi lazim
 * 4) Validation kurallari tanimlanmis olmasi lazim
 * 
 * Programin isleyis asamalari
 * 
 * 1) Kullanici input alanina bir deger girer.
 * 2) Kullanici buttona basar.
 * 3) Girilen deger javascript tarafindan JS SPACE alinir.
 * 3.1) Input validate edilir, 05:30 orneginden ele alirsak ":" karakteri var mi ve rakam disinda bir karakter var mi diye validate edilir:
 * 3.2) validation OK ise ":" ile split edilip 2 parca elde edilir.
 * 4) Eldeki 2 parca deger yorumlanir.
 * 4.1) "05:15": ikinci deger 15 ise "viertel nach fünf"
 * 4.2) "05:45": ikinci deger 45 ise "viertel vor (fünf - 1)"
 * 4.3) "05:30": ikinci deger 30 ise "halb (fünf + 1)"
 * 4.4) "05:25": ikinci deger "15,45,30" degilse, bakilir
 * 4.4.1) 30'dan kücük ise " x nach fünf"
 * 4.4.2) 30'dan büyük ise " x vor (fünf + 1)"
 * 5) Sonuc bulunur ve #result2 alanina yazdirilir
 *
 * 
 */


$("#button2").on("click", function () {
    main2();
});


/**
 * Bu programin giris fonksiyonudur.
 */
function main2() {
    // degeri al
    // degiskene ata
    let value2 = getValue2();


    // degeri validate et
    let validation = validate2(value2);
    

    // degeri yorumla
    let result = parseValue2(value2);

    // bulunan degeri outputa yazdir
    showResult2(result);
}



function getValue2() {
    return $("#input2").val().toLowerCase();
}

/**
 * Rules:
 * 1) Harf olan (":"" disinda) bir karakter varsa, hata ver.
 * 2) ":" bulunmasi lazim
 * 3) ":" karakterinin oncesindeki deger 24 >= Hour >= 0 olmali
 * 4) ":" karakterinin sonrasindaki deger 60 >= Minute >= 0 olmali
 * @param {*girilen deger} pValue 
 */


function validate2(pValue) {
    // teyit et
    if (/^((0?[0-9]{1})|(1{1}[0-2]{1}))((:[0-5][0-9])?)\s(AM|PM|am|pm|Am|Pm)$/.test(pValue) == true || 
        /^((0?[0-9]{1})|(1{1}[0-2]{1}))((:[0-5][0-9])?)\s(AM|PM|am|pm|Am|Pm)$/.test(pValue) == true) {
            return true;
    } else {
        $("#result2").html(`
        Lütfen "hh:mm pm" veya "hh:mm am" formati disinda giris yapmayin!
        Ve dahi saat kismina 0-12 disinda deger girmeyin. 
        Ve dahi dakika kismina 0-59 disinda zinhar giris yapmayin.`);
        throw new Error(`Lütfen sadece < hh:mm pm > formatinda girin, "02:07 pm" gibi.. 
        ":" isaretini ve am-pm ibaresinden birini yazmayi unutmayin!!
        girilen deger: ${pValue}`);
    }
}

/**
 * Parse rules
 * 4.1) "05:15": ikinci deger 15 ise "viertel nach fünf"
 * 4.2) "05:45": ikinci deger 45 ise "viertel vor (fünf - 1)"
 * 4.3) "05:30": ikinci deger 30 ise "halb (fünf + 1)"
 * 4.4) "05:25": ikinci deger "15,45,30" degilse, bakilir
 * 4.4.1) 30'dan kücük ise " x nach fünf"
 * 4.4.2) 30'dan büyük ise " x vor (fünf + 1)"
 * @param {*girilen ve validate edilmis deger} pValue 
 */


function parseValue2(pValue) {
    let valueMinute = pValue.split(":")[1].split(" ")[0];
    let valueHour = pValue.split(":")[0];
    let amOrPm = dayLight (pValue.split(":")[1].split(" ")[1].toLowerCase(), valueHour);  // 02:35 pm -> icinden "pm" kismini cekip alir. ve bunu dayLight fonksiyonuna gonderir.
    

    console.log(valueMinute)
    console.log(valueHour, valueMinute);
    // 5:10 veya 5:26 veya 5:47  benzeri icin; result: "zehn nach fünf" olacak sekilde:
    if (["15", "30", "45", "00"].some(key => valueMinute.includes(key)) == false) {  // valueMinute (dakika) 15,30,45 degilse:
        
        if(valueMinute < 30) {      // dakika 30'dan kucukse  "nach" kullan
            let hourInText = numbers.find(obj => obj.value == valueHour);
            let minInText = numbers.find(obj => obj.value == valueMinute);
            return `${minInText.text} nach ${hourInText.text} ${amOrPm}`;

        } else {    // dakika 30'dan buyukse  "vor" kullan, saati +1 yapmayi unutma!!
            let hourInText = numbers.find(obj => obj.value == +valueHour + 1);
            let minInText = numbers.find(obj => obj.value == 60 - +valueMinute);
            
            return `${minInText.text} vor ${hourInText.text} ${amOrPm}`;
        }

    } else {        // yani dakika degeri icerisinde 15,30,45 varsa buraya gir!
        if (+valueMinute == 00) {
            let hourInText = numbers.find(obj => obj.value == valueHour);
            
            return `Es ist ${hourInText.text} Uhr ${amOrPm}`;
        }

        if (+valueMinute == 15) {
            let hourInText = numbers.find(obj => obj.value == valueHour);
            
            return `viertel nach ${hourInText.text} ${amOrPm}`;
        }

        if (+valueMinute == 45) {
            let hourInText = numbers.find(obj => obj.value == +valueHour + 1);

            return `viertel vor ${hourInText.text} ${amOrPm}`;
        }

        if (+valueMinute == 30) {
            let hourInText = numbers.find(obj => obj.value == +valueHour + 1);
            
            return `halb ${hourInText.text} ${amOrPm}`;
        }
    }

    return "ERROR";
}

function showResult2(pResult) {
    $("#result2").html(pResult);
}

// kendisine gelene bakar;
// eger icinde "am" iceriyorsa "am Morgen"
// eger icinde "pm" iceriyorsa "am Abend"  dondurur.
// else -> ERROR
function dayLight (pValue, pValueHour) {
    if (+pValueHour == 0 || pValue.includes("am")) {    // burada < +pValueHour == 0 > ko$ulu, "00:15 pm" verildigi durumda am Abend degil de am Morgen yazilmasini saglar. 
        return "am Morgen"
    }
    if (pValue.includes("pm")) {
        return "am Abend";
    } else {
        $("#result2").html(`Lütfen "AM" veya "PM" degerini düzgün giriniz!`);
        throw new Error(`Lütfen sadece "AM" veya "PM" giriniz!`);
    }

}