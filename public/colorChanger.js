const toggle = document.querySelector(".toggle input")
x = false

toggle.addEventListener('click', () => {
  if (x == false) {
    document.getElementById("nav").style.backgroundColor = "white"
    x = true
    document.getElementsByClassName("change").style.color = "gray"
    
    
  } else if (x == true) {
    document.getElementById("nav").style.backgroundColor = "black"
    x = false
  }
})


