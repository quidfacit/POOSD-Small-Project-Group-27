const modals = Array.from(document.getElementsByClassName('modal'));
const showModalBtn = document.getElementById('showModalBtn');
const mainContainer = document.getElementsByClassName('mainContainer')[0];
Array.from(document.getElementsByClassName('close'))
    .forEach((c) => (c.onclick = closeModal));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Opens modal that called this function
function showModal(modal) {
    modal.style.display = 'block';
    mainContainer.classList.add('haze');
}

// Closes all modals
function closeModal() {
    modals.forEach((modal) => (modal.style.display = 'none'));
    mainContainer.classList.remove('haze');

    addResult = document.getElementById('addResult');
    addResult.style.display = 'none';

    Array.from(document.getElementsByClassName('incorrectLabel')).forEach((e) =>
        e.classList.add('hidden')
    );
}