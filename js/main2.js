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

/* 
let keywords = ["halb", "viertel", "nach", "vor", "uhr"];
let numbers = [
    {text: "eins", value:1},
    {text: "zwei", value:2},
    {text: "drei", value:3},
    {text: "vier", value:4},
    {text: "fünf", value:5},
    {text: "sechs", value:6},
    {text: "sieben", value:7},
    {text: "acht", value:8},
    {text: "neun", value:9},
    {text: "zehn", value:10},
    {text: "elf", value:11},
    {text: "zwölf", value:12},
    {text: "dreizehn", value:13},
    {text: "vierzehn", value:14},
    {text: "fünfzehn", value:15},
    {text: "sechszehn", value:16},
    {text: "siebzehn", value:17},
    {text: "achtzehn", value:18},
    {text: "neunzehn", value:19},
    {text: "zwanzig", value:20},
    {text: "einundzwanzig", value:21},
    {text: "zweiundzwanzig", value:22},
    {text: "dreiundzwanzig", value:23},

    {text: "halb", value:30, special: true},
    {text: "viertel", value:15, special: true},
]; */

/**
 * Bu programin giris fonksiyonudur.
 */
function main2() {
    // degeri al
    // degiskene ata
    let value2 = getValue2();


    // degeri validate et
    let validation = true; //validate2(value);

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
    if (/^[a-zA-Z\süöä]+$/.test(pValue) == false) {
        throw new Error(`Lütfen sadece harf ve bosluk kullanin, girilen deger: ${pValue}`);
    }

    if (keywords.some(key => pValue.includes(key)) == false) {
        throw new Error(`Lütfen beklenen degerleri giriniz, girilen deger: ${pValue}`);
    }

    if (numbers.some(obj => pValue.includes(obj.text)) == false) {
        throw new Error(`Lütfen sayi giriniz, girilen deger: ${pValue}`);
    }

    let partials = pValue.split(" ").filter(word => !numbers.find(obj => !obj.special && obj.text == word));
    let checkSet = new Set(partials);
    if (checkSet.size != partials.length) {
        throw new Error(`Lütfen sayi olmayan ifadeleri bir defa giriniz, girilen deger: ${pValue}`);
    }

    return true;
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
    let valueHour = pValue.split(":")[0];
    let valueMinute = pValue.split(":")[1];
    console.log(valueHour, valueMinute);
    // 5:10 veya 5:26 veya 5:47  benzeri icin; result: "zehn nach fünf" olacak sekilde:
    if (["15", "30", "45"].some(key => valueMinute.includes(key)) == false) {  // valueMinute (dakika) 15,30,45 degilse:
        if(valueMinute < 30) {      // dakika 30'dan kucukse  "nach" kullan
            console.log("ilk if icindeyim")
            return `${valueMinute} nach ${valueHour}`;
        } else {    // dakika 30'dan buyukse  "vor" kullan, saati +1 yapmayi unutma!!
            console.log("ikinci if icindeyim", "hour:", valueHour)
            return `${60 - valueMinute} vor ${+valueHour + 1}`;
        }

    } else {        // yani dakika degeri icerisinde 15,30,45 varsa buraya gir!
        if (+valueMinute == 15) {
            return `viertel nach ${valueHour}`;
        }

        if (+valueMinute == 45) {
            return `viertel vor ${+valueHour + 1}`;
        }

        if (+valueMinute == 30) {
            return `halb ${+valueHour + 1}`;
        }
    }

    return "ERROR";
}

function showResult2(pResult) {
    $("#result2").html(pResult);
}