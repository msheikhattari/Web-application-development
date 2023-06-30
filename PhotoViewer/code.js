window.onload = main;
var curr;
var slideshowVar;
var randSlideshowVar;
var loaded = false;

function main() {
    document.getElementById("load").onclick = loadPhoto;
    document.getElementById("next").onclick = next;
    document.getElementById("image").onclick = next;
    document.getElementById("previous").onclick = previous;
    document.getElementById("first").onclick = first;
    document.getElementById("last").onclick = last;
    document.getElementById("slideshow").onclick = slideshow;
    document.getElementById("random").onclick = randSlideshow;
    document.getElementById("stop").onclick = stop;
}

function loadPhoto() {
    var folder = document.getElementById("folder").value;
    var common = document.getElementById("common").value;
    var start = Number(document.getElementById("start").value);
    var end = Number(document.getElementById("end").value);
    curr = start;

    if(start > end){
        document.querySelector("#status").innerHTML = "<p>Error: Invalid Range</p>"
    }else {
        img = "<img src = " + folder + common + curr + ".jpg>";
        document.querySelector("#image").innerHTML = img;
        document.getElementById("imgDisplay").value = folder + common + curr + ".jpg"
        loaded = true;
        document.querySelector("#status").innerHTML = "<p>Photo Viewer System</p>"
    }
}

function next() {
    if(loaded){
        var folder = document.getElementById("folder").value;
        var common = document.getElementById("common").value;
        var start = Number(document.getElementById("start").value);
        var end = Number(document.getElementById("end").value);

        var updateCurr = (x) => {
            if(x === end){
                return start;
            }else {
                return x + 1;
            }
        }
    
        curr = updateCurr(curr)

        img = "<img src = " + folder + common + curr + ".jpg>";
        document.querySelector("#image").innerHTML = img;
        document.getElementById("imgDisplay").value = folder + common + curr + ".jpg"
    }else {
        document.querySelector("#status").innerHTML = "<p>Error: you must load data first</p>"
    }
}

function previous() {
    if(loaded){
        var folder = document.getElementById("folder").value;
        var common = document.getElementById("common").value;
        var start = Number(document.getElementById("start").value);
        var end = Number(document.getElementById("end").value);

        var updateCurr = (x) => {
            if(x === start){
                return end;
            }else {
                return x - 1;
            }
        }
    
        curr = updateCurr(curr)

        img = "<img src = " + folder + common + curr + ".jpg>";
        document.querySelector("#image").innerHTML = img;
        document.getElementById("imgDisplay").value = folder + common + curr + ".jpg"
    }else {
        document.querySelector("#status").innerHTML = "<p>Error: you must load data first</p>"
    }
}

function first() {
    if(loaded){
        var start = Number(document.getElementById("start").value);
        var folder = document.getElementById("folder").value;
        var common = document.getElementById("common").value;
        curr = start;

        img = "<img src = " + folder + common + curr + ".jpg>";
        document.querySelector("#image").innerHTML = img;
        document.getElementById("imgDisplay").value = folder + common + curr + ".jpg"
    }else {
        document.querySelector("#status").innerHTML = "<p>Error: you must load data first</p>"
    }
}

function last() {
    if(loaded){
        var end = Number(document.getElementById("end").value);
        var folder = document.getElementById("folder").value;
        var common = document.getElementById("common").value;
        curr = end;

        img = "<img src = " + folder + common + curr + ".jpg>";
        document.querySelector("#image").innerHTML = img;
        document.getElementById("imgDisplay").value = folder + common + curr + ".jpg"
    }else {
        document.querySelector("#status").innerHTML = "<p>Error: you must load data first</p>"
    }
}

function slideshow() {
    if(loaded){
        slideshowVar = setInterval("slides()", 1000);
    }else {
        document.querySelector("#status").innerHTML = "<p>Error: you must load data first</p>"
    } 
}

function randSlideshow() {
    if(loaded){
        randSlideshowVar = setInterval("randSlides()", 1000)
    }else {
        document.querySelector("#status").innerHTML = "<p>Error: you must load data first</p>"
    }
}

function stop() {
    clearInterval(slideshowVar);
    clearInterval(randSlideshowVar)
}

function slides() {
    var folder = document.getElementById("folder").value;
    var common = document.getElementById("common").value;
    var start = Number(document.getElementById("start").value);
    var end = Number(document.getElementById("end").value);

    img = "<img src = " + folder + common + curr + ".jpg>";
    document.querySelector("#image").innerHTML = img;
    document.getElementById("imgDisplay").value = folder + common + curr + ".jpg"

    var updateCurr = (x) => {
        if(x === end){
            return start;
        }else {
            return x + 1;
        }
    }

    curr = updateCurr(curr)
}

function randSlides() {
    var folder = document.getElementById("folder").value;
    var common = document.getElementById("common").value;
    var start = Number(document.getElementById("start").value);
    var end = Number(document.getElementById("end").value);
    var randomSlide = Math.floor(Math.random() * (end + 1 - start)) + start;

    img = "<img src = " + folder + common + randomSlide + ".jpg>";
    document.querySelector("#image").innerHTML = img;
    document.getElementById("imgDisplay").value = folder + common + randomSlide + ".jpg"
}