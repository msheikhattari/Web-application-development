function submitIt() {
    txt = ""
    
    var phoneFirstPart = document.querySelector("#phoneFirstPart").value
    var phoneSecondPart = document.querySelector("#phoneSecondPart").value
    var phoneThirdPart = document.querySelector("#phoneThirdPart").value
    
    var highBloodPressure = document.querySelector("#highBloodPressure").checked
    var diabetes = document.querySelector("#diabetes").checked
    var glaucoma = document.querySelector("#glaucoma").checked
    var asthma = document.querySelector("#asthma").checked
    var none = document.querySelector("#none").checked

    var never = document.querySelector("#never").checked
    var less = document.querySelector("#less").checked
    var ott = document.querySelector("#ott").checked
    var more = document.querySelector("#more").checked

    var firstFourDigits = document.querySelector("#firstFourDigits").value
    var secondFourDigits = document.querySelector("#secondFourDigits").value
    
    
    

    if(isNaN(Number(phoneFirstPart)) || isNaN(Number(phoneSecondPart)) || isNaN(Number(phoneThirdPart)) || phoneFirstPart.length != 3 || phoneSecondPart.length != 3 || phoneThirdPart.length != 4) {
        txt += "Invalid phone number\n"
    }

    if(!(highBloodPressure || diabetes || glaucoma || asthma || none)){
        txt += "No conditions selected\n"
    }
    if(none && (highBloodPressure || diabetes || glaucoma || asthma)){
        txt += "Invalid conditions selection\n"
    }
    if(!(never || less || ott || more)){
        txt += "No time period selected\n"
    }
    if(firstFourDigits.length != 4 || secondFourDigits.length != 4 || firstFourDigits.charAt(0) != 'A' || secondFourDigits.charAt(0) != 'B' || isNaN(Number(firstFourDigits.slice(1))) || isNaN(Number(secondFourDigits.slice(1)))){
        txt += "Invalid study id"
    }

    if(txt.length == 0){
        if(confirm("Do you want to submit the form data?")) {
            return true
        }
    }else{
        alert(txt)
    }
    return false
}