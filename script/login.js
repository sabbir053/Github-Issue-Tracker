document.getElementById('login-btn').addEventListener('click', () => {
    const numberInput = document.getElementById('input-number');
    const inputNumberValue = numberInput.value.trim();

    const pinInput = document.getElementById('input-pin');
    const inputPinValue = pinInput.value.trim();

    if (inputNumberValue == 'admin' && inputPinValue == 'admin123') {
        window.location.assign('./home.html');
    } else {
        alert("Wrong | Number or Password -- Please Try a correct value.");
        return;
    }
})