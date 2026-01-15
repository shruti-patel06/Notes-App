const noteInput=document.getElementById("noteInput");
const addBtn=document.getElementById("addBtn");
const noteslist=document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");
const tagsInput = document.getElementById("tagsInput");   
//Function to save notes to localStorage
function saveNotes(){
    const notes = Array.from(noteslist.children).map(li => {
        const text = li.querySelector("span").textContent;
        const timestamp = li.dataset.timestamp;
        const pinned = li.classList.contains('pinned');
        const tags = JSON.parse(li.dataset.tags || '[]');
        return {text, timestamp, pinned, tags};
    });
    localStorage.setItem("notes", JSON.stringify(notes));
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
//function to handle editing a note
function editNote(li,textspan, editBtn){
    const currentText = textspan.textContent;
    const input = document.createElement("input");
    input.type="text";
    input.value=currentText;
    input.classList.add("edit-input");

    //Replace span with input
    li.replaceChild(input,textspan);
    editBtn.textContent="Save";

    // Focus on input
    input.focus();

    input.addEventListener("keydown",(e)=>{
        if(e.key==="Enter"){
            const newText=input.value.trim();
            if(newText){
                textspan.textContent=newText;
                li.replaceChild(textspan,input);
                editBtn.textContent= "Edit";
                saveNotes();
                filterNotes();
            }
        }else if(e.key==="Escape"){
            li.replaceChild(textspan,input);
            editBtn.textContent="Edit";
        }
    });
}



//function to load notes from localstorage
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    // Sort notes so pinned come first
    notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    notes.forEach(note => {
        let text, timestamp, pinned, tags;
        if (typeof note === 'string') {
            text = note;
            timestamp = 'Created before timestamps';
            pinned = false;
            tags = [];
        } else {
            text = note.text;
            timestamp = note.timestamp;
            pinned = note.pinned || false;
            tags = note.tags || [];
        }
        const li = document.createElement("li");
        if (pinned) li.classList.add('pinned');
        const textspan = document.createElement("span");
        textspan.textContent = text;
        const tagsDiv = document.createElement("div");
        tagsDiv.classList.add("tags");
        tags.forEach(tag => {
            const tagSpan = document.createElement("span");
            tagSpan.classList.add("tag");
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });
        const timestampSpan = document.createElement("small");
        timestampSpan.textContent = timestamp;
        timestampSpan.classList.add("timestamp");
        const pinBtn = document.createElement("button");
        pinBtn.textContent = pinned ? 'Unpin' : 'Pin';
        pinBtn.classList.add("pin-btn");
        const editBtn = document.createElement("button");
        editBtn.textContent="Edit";
        editBtn.classList.add("edit-btn");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveNotes(); // Save after deletion
        });
        pinBtn.addEventListener("click", () => {
            const isPinned = li.classList.toggle('pinned');
            pinBtn.textContent = isPinned ? 'Unpin' : 'Pin';
            saveNotes();
            // Re-sort after pinning/unpinning
            loadNotes(); // Reload to sort
        });
        editBtn.addEventListener("click",()=>{
            const input = li.querySelector("input");
            if (input) {
                // save
                const newText = input.value.trim();
                if (newText) {
                    textspan.textContent = newText;
                    li.replaceChild(textspan, input);
                    editBtn.textContent = "Edit";
                    saveNotes();
                    filterNotes();
                }
            } else {
                // edit
                editNote(li, textspan, editBtn);
            }
        });
        li.dataset.timestamp = timestamp;
        li.dataset.tags = JSON.stringify(tags);
        li.appendChild(textspan);
        li.appendChild(tagsDiv);
        li.appendChild(timestampSpan);
        li.appendChild(pinBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        noteslist.appendChild(li);
    });
}
loadNotes();

searchInput.addEventListener("input", filterNotes);

addBtn.addEventListener("click",()=>{
    const text=noteInput.value.trim();
    const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    if(!text){
        return;
    }
    const timestamp = new Date().toLocaleString();
    const li=document.createElement("li");
    const textspan = document.createElement("span");
    textspan.textContent=text;
    const tagsDiv = document.createElement("div");
    tagsDiv.classList.add("tags");
    tags.forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.classList.add("tag");
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
    });
    const timestampSpan = document.createElement("small");
    timestampSpan.textContent = timestamp;
    timestampSpan.classList.add("timestamp");
    const pinBtn = document.createElement("button");
    pinBtn.textContent = 'Pin';
    pinBtn.classList.add("pin-btn");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    const deleteBtn= document.createElement("button");
    deleteBtn.textContent="Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click",()=>{
        li.remove();
        saveNotes();
    })
    pinBtn.addEventListener("click", () => {
        const isPinned = li.classList.toggle('pinned');
        pinBtn.textContent = isPinned ? 'Unpin' : 'Pin';
        saveNotes();
        // Re-sort
        loadNotes();
    });
    editBtn.addEventListener("click",()=>{
        const input = li.querySelector("input");
        if (input) {
            // save
            const newText = input.value.trim();
            if (newText) {
                textspan.textContent = newText;
                li.replaceChild(textspan, input);
                editBtn.textContent = "Edit";
                saveNotes();
                filterNotes();
            }
        } else {
            // edit
            editNote(li, textspan, editBtn);
        }
    });
    li.dataset.timestamp = timestamp;
    li.dataset.tags = JSON.stringify(tags);
    li.appendChild(textspan);
    li.appendChild(tagsDiv);
    li.appendChild(timestampSpan);
    li.appendChild(pinBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    noteslist.appendChild(li);
    noteInput.value = "";
    tagsInput.value = "";
    saveNotes();
    filterNotes();
});