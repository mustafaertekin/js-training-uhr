/**
 * 
 * Bu program, ekranda, input olarak verilen almanca saat ifadelerini, digital saat eslenigine ceviriyor.
 * Varsayilanlar
 * 1) Input alaninin ekranda olmasi lazim
 * 2) Islemi baslatmak icin buton
 * 3) Outpu alani olmasi lazim
 * 4) Validation kurallari tanimlanmis olmasi lazim
 * 
 * Programin isleyis asamalari
 * 
 * 1) Kullanici input alanina bir deger girer.
 * 2) Kullanici buttona basar.
 * 3) Girilen deger javascript tarafindan JS SPACE alinir.
 * 3.1) Bu deger bir degiskene atanir 
 * 3.2) Bu deger VALIDATE edilir. 
 * 4) Girilen deger yorumlanir.
 * 4.1) "act uhr": Eger verilen input icinde "nach", "vor", "halb", "viertel" gecmiyorsa, o zaman bu deger icin "uhr" i cikartirim kalan deger tam bir saate denk gelmeli.
 * 4.2) "halb zehn": "halb" geciyorsa, halbi cikar ve bunu 30 dakika olarak yorumlama, geri kalani sayiya cevir ve bir eksilt
 * 4.3) "viertel vor sieben": "vor" girilen deger icinde geciyorsa, bu deger ikiye "vor" üzerinden ikiye parcalanir ve u iki sayi ayri ayri degerlendirilir. Parcalanan degerin ilk bölümü dakika olarak degerlendirilir ve 60dak dan cikarilir. Ikinci kisim ise sayiya cevrilir ve 1 eksiltilir
 * 4.4) "viertel nach fünf": "nach" burada iki sayiyi birlesitiriyor. Solda kalan sayi ayniyle dakikayi olustururken sagdaki sayi ise ayniyle saati olusturur.
 * 4.5) "fünf vor halb sechs": ?
 * 5) Sonuc bulunur ve #result1 alanina yazdirilir
 *
 * 
 * Lösungsansatz Mustafa:
 * Su kelimeler varsa:   "nach", "vor", "viertel", "halb", "uhr" ve sayilar
 * 
 * Lösungansatz Mehmet:
 * viertel von acht
 * halb zehn
 * acht uhr
 * 
 */



$("#button1").on("click", function(){
    main();
});

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
];

 /**
  * Bu programin giris fonksiyonudur.
  */
 function main(){
    // degeri al
    // degiskene ata
    let value = getValue();
    
    // degeri validate et
    let validation = validate(value);

    // degeri yorumla
    let result = parseValue(value);
    
    // bulunan degeri outputa yazdir
    showResult(result);
 }



 function getValue(){
    return $("#input1").val().toLowerCase();
 }

 /**
  * Rules:
  * 1) Harf olmayan (bosluk disinda) bir sayi varsa, hata ver.
  * 2) "halb", "viertel", "vor", "nach", "uhr" ve sayi ifadeleri gecmesi lazim.
  * 3) "halb", "viertel", "vor", "nach", "uhr" sadece birer defa gecmeli.
  * @param {*girilen deger} pValue 
  */
 function validate(pValue){
    // teyit et
    if(/^[a-zA-Z\süöä]+$/.test(pValue)==false){
        throw new Error(`Lütfen sadece harf ve bosluk kullanin, girilen deger: ${pValue}`);
    }

    if(keywords.some(key=>pValue.includes(key))==false) {
        throw new Error(`Lütfen beklenen degerleri giriniz, girilen deger: ${pValue}`);
    }

    if(numbers.some(obj=>pValue.includes(obj.text))==false) {
        throw new Error(`Lütfen sayi giriniz, girilen deger: ${pValue}`);
    }

    let partials = pValue.split(" ").filter(word => !numbers.find(obj => !obj.special && obj.text==word));
    let checkSet = new Set(partials);
    if(checkSet.size != partials.length){
        throw new Error(`Lütfen sayi olmayan ifadeleri bir defa giriniz, girilen deger: ${pValue}`);
    }

    return true;
 }

 /**
  * Parse rules
  * 4.1) "act uhr": Eger verilen input icinde "nach", "vor", "halb", "viertel" gecmiyorsa, o zaman bu deger icin "uhr" i cikartirim kalan deger tam bir saate denk gelmeli.
  * 4.2) "halb zehn": "halb" geciyorsa, halbi cikar ve bunu 30 dakika olarak yorumlama, geri kalani sayiya cevir ve bir eksilt
  * 4.3) "viertel vor sieben": "vor" girilen deger icinde geciyorsa, bu deger ikiye "vor" üzerinden ikiye parcalanir ve u iki sayi ayri ayri degerlendirilir. Parcalanan degerin ilk bölümü dakika olarak degerlendirilir ve 60dak dan cikarilir. Ikinci kisim ise sayiya cevrilir ve 1 eksiltilir
  * 4.4) "viertel nach fünf": "nach" burada iki sayiyi birlesitiriyor. Solda kalan sayi ayniyle dakikayi olustururken sagdaki sayi ise ayniyle saati olusturur.
  * 4.5) "fünf vor halb sechs": ?
  * @param {*girilen ve teyit edilmis deger} pValue 
  */
 function parseValue(pValue){
     // acht uhr
    if(["nach", "vor", "halb", "viertel"].some(key => pValue.includes(key))==false){
        let hour = pValue.replace("uhr", "").trim();
        let number = numbers.find(obj => obj.text == hour);

        return `${number.value}:00`.padStart(5, "0");
    }
    // halb zehn
    if(pValue.includes("halb")){
        let hour = pValue.replace("halb", "").trim();
        let number = numbers.find(obj => obj.text == hour);

        return `${number.value-1}:30`.padStart(5, "0");
    }

    // viertel
    if(pValue.includes("viertel")){
        if(pValue.includes("nach")){
            let hour = pValue.replace("viertel nach", "").trim();
            let number = numbers.find(obj => obj.text == hour);

            return `${number.value}:15`.padStart(5, "0");
        }
        if(pValue.includes("vor")){
            let hour = pValue.replace("viertel vor", "").trim();
            let number = numbers.find(obj => obj.text == hour);

            return `${number.value-1}:45`.padStart(5, "0");
        }
    }

    return "ERROR";
 }

 function showResult(pResult){
    $("#result1").html(pResult);
 }