const noteInput=document.getElementById("noteInput");
const addBtn=document.getElementById("addBtn");
const noteslist=document.getElementById("notesList");
addBtn.addEventListener("click",()=>{
    const text=noteInput.value.trim();
    if(!text){
        return;
    }
    const li=document.createElement("li");
    li.textContent=text;
    noteslist.appendChild(li);
    noteInput.value=" ";
});