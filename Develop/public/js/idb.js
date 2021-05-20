let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {

    const db = event.target.result;
    db.createObjectStore('budget_item', { autoIncrement: true });

  };

  request.onsuccess = function(event) {
    
    db = event.target.result;
    // check if app is online, if yes run updateBudget() function to send all local db data to api
    if (navigator.onLine) {

      updateBudget();
    }

  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

function saveRecord(record) {
    
    const transaction = db.transaction(['budget_item'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('budget_item');
    budgetObjectStore.add(record);

  }

  function updateBudget() {
   
    const transaction = db.transaction(['budget_item'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('budget_item');
    const getAll = budgetObjectStore.getAll();
  
    
    etAll.onsuccess = function() {

    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
         
          const transaction = db.transaction(['budget_item'], 'readwrite');
         
          const budgetObjectStore = transaction.objectStore('budget_item');
        
          budgetObjectStore.clear();

          alert('All items have been ssubmitted');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  }

  // listen for app coming back online
window.addEventListener('online', updateBudget);
