// Get a reference to the toggle button
const toggleButtonShorts = document.getElementById('toggle-button-shorts');
const toggleButtonRecs = document.getElementById('toggle-button-recs');
const toggleButtonAll = document.getElementById('toggle-button-all');


toggleButtonShorts.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonShorts.classList.toggle('on');
});

toggleButtonRecs.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonRecs.classList.toggle('on');
});

toggleButtonAll.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonAll.classList.toggle('on');
});

