const name1=document.getElementById("name")
const description1=document.getElementById("description")
const price1=document.getElementById("price")
const required1=document.getElementById("required")
const button1=document.getElementById("button1")

button1.addEventListener("click",function(event){
    event.preventDefault();
    create();
})

async function create(){
    try{
        const name=name1.value;
        const description=description1.value;
        const price=price1.value;
        const quantityAvailable=required1.value;
        await axios.post("/api/orphan/createe",{
            name,
            description,
            price,
            quantityAvailable
        });
        alert("createed successfully")
    }
    catch(error){
        console.error("Error processing donation:", error);
        alert("cant insert.");
    }
}

