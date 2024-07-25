
const uploadBtn = document.getElementById("uploadBtn")
const cross = document.querySelector(".cross")
const profilechangeForm = document.getElementById("profilechangeForm")
console.log("HELLO");
cross.addEventListener("click" , ()=>{
    changeProfileImage.close()
})
profilechangeForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const newForm = new FormData(profilechangeForm);
    const url = window.location.href;
    const response = await axios.put("http://localhost:5000/user/updateUserProfile",newForm ,{
        headers : {
            'Content-Type' : 'multipart/form-data'
        }
    })
    if(response){
        window.location.href = url;
        return
    }

})
