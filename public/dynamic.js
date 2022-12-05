let toggle = document.getElementById("#toggler");
let pwd = document.getElementsByClassName("#password");

toggle.onclick(()=>{
    const inputType = pwd.getAttribute("type") === "password" ? "text" : "password";
    pwd.setAttribute("type",inputType);

    this.classList.toggle("by-eye");
})