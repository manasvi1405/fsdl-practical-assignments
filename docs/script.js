const nameStr = "Manasvi Patil";
let j = 0;

function typeEffect() {

    if (j < nameStr.length) {

        document.getElementById("typewriter-text").innerHTML += nameStr.charAt(j);

        j++;

        setTimeout(typeEffect, 200);
    }
}

window.onload = typeEffect;


// Theme Toggle

function toggleTheme() {

    document.body.classList.toggle("dark-theme");

    document.body.classList.toggle("light-theme");

}


// Scroll Reveal

window.addEventListener('scroll', () => {

    const reveals = document.querySelectorAll('.reveal');

    for (let i = 0; i < reveals.length; i++) {

        const windowHeight = window.innerHeight;

        const elementTop = reveals[i].getBoundingClientRect().top;

        const elementVisible = 150;


        if(elementTop < windowHeight - elementVisible){

            reveals[i].classList.add("active");

        }
    }

});