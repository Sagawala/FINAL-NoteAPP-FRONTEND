const noteForm = document.getElementById('noteForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const noteList = document.getElementById('noteList');


noteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (title !== '' && content !== '') {
    
    const note = {
      title: title,
      content: content
    };

    
    fetch('http://localhost:8081/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    })
      .then(response => response.json())
      .then(data => {
        
        titleInput.value = '';
        contentInput.value = '';

        
        addNoteToList(data);
      })
      .catch(error => console.error('Error:', error));
  }
});


window.addEventListener('load', () => {
  fetch('http://localhost:8081/notes')
    .then(response => response.json())
    .then(data => {
      // Display notes in the note list
      data.forEach(note => addNoteToList(note));
    })
    .catch(error => console.error('Error:', error));
});


function addNoteToList(note) {
  const noteItem = document.createElement('div');
  noteItem.classList.add('note');
  noteItem.innerHTML = `
    <h3>${note.title}</h3>
    <p>${note.content}</p>
    <button onclick="updateNote(${note.id})">Update</button>
    <button onclick="deleteNote(${note.id})">Delete</button>
  `;
  noteList.appendChild(noteItem);
}


function updateNote(id) {
  const updatedNote = prompt('Enter updated note content:');

  if (updatedNote !== null) {
    const note = {
      content: updatedNote
    };

    
    fetch(`http://localhost:8081/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    })
      .then(response => response.json())
      .then(data => {
        
        noteList.innerHTML = '';

        
        fetch('http://localhost:8081/notes')
          .then(response => response.json())
          .then(data => {
            
            data.forEach(note => addNoteToList(note));
          })
          .catch(error => console.error('Error:', error));
      })
      .catch(error => console.error('Error:', error));
  }
}


function deleteNote(id) {
  
  fetch(`http://localhost:8081/notes/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      
      noteList.innerHTML = '';

      
      fetch('http://localhost:8081/notes')
        .then(response => response.json())
        .then(data => {
          
          data.forEach(note => addNoteToList(note));
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
}
