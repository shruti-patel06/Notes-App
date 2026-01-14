const noteInput=document.getElementById("noteInput");
const addBtn=document.getElementById("addBtn");
const noteslist=document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");   
//Function to save notes to localStorage
function saveNotes(){
    const notes=Array.from(noteslist.children).map(li=>li.querySelector("span").textContent);
    localStorage.setItem("notes",JSON.stringify(notes));
}
// Function to filter notes based on search input
function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const notes = noteslist.children;
    Array.from(notes).forEach(li => {
        const text = li.querySelector("span").textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}
//function to load notes from localstorage
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach(note => {
        const li = document.createElement("li");
        const textspan = document.createElement("span");
        textspan.textContent = note;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveNotes(); // Save after deletion
        });
        li.appendChild(textspan);
        li.appendChild(deleteBtn);
        noteslist.appendChild(li);
    });
}
loadNotes();

searchInput.addEventListener("input", filterNotes);

addBtn.addEventListener("click",()=>{
    const text=noteInput.value.trim();
    if(!text){
        return;
    }
    const li=document.createElement("li");
    const textspan = document.createElement("span");
    textspan.textContent=text;
    const deleteBtn= document.createElement("button");
    deleteBtn.textContent="Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click",()=>{
        li.remove();
        saveNotes();
    })
    // li.textContent=text;
    li.appendChild(textspan);
    li.appendChild(deleteBtn);
    noteslist.appendChild(li);
    noteInput.value = "";
    saveNotes();
    filterNotes();
});