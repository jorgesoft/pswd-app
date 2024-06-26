document.addEventListener("DOMContentLoaded", function() {
    generatePassword(); // Generate initial password on page load
});

function updateLengthDisplay(value) {
    document.getElementById('lengthDisplay').textContent = value;
}

function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const password = createPassword(length, includeUppercase, includeNumbers, includeSymbols);
    document.getElementById('generatedPassword').value = password;
    analyzeStrength(password);
}

function createPassword(length, upper, numbers, symbols) {
    const charset = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{};:,.<>?'
    };
    let validChars = charset.lower; // Always include lowercase letters
    if (upper) validChars += charset.upper;
    if (numbers) validChars += charset.numbers;
    if (symbols) validChars += charset.symbols;

    let password = '';
    const crypto = window.crypto || window.msCrypto;

    for (let i = 0; i < length; i++) {
        const randomValue = new Uint32Array(1);
        crypto.getRandomValues(randomValue);
        password += validChars[randomValue[0] % validChars.length];
    }
    return password;
}

function analyzeStrength(password) {
    const result = zxcvbn(password);
    const strengthDisplay = document.getElementById('passwordStrength');
    let strengthText = '';
    let strengthClass = '';
    let crackTimes = `
        <ul>
            <li>Online (10 times / second): ${result.crack_times_display.online_no_throttling_10_per_second}</li>
            <li>Offline (10k times / second): ${result.crack_times_display.offline_slow_hashing_1e4_per_second}</li>
        </ul>
    `;

    switch (result.score) {
        case 0:
            strengthText = 'Very Weak';
            strengthClass = 'text-danger';
            break;
        case 1:
            strengthText = 'Weak';
            strengthClass = 'text-danger';
            break;
        case 2:
            strengthText = 'Fair';
            strengthClass = 'text-warning';
            break;
        case 3:
            strengthText = 'Good';
            strengthClass = 'text-primary';
            break;
        case 4:
            strengthText = 'Strong';
            strengthClass = 'text-success';
            break;
        default:
            strengthText = 'Very Weak';
            strengthClass = 'text-danger';
    }

    strengthDisplay.innerHTML = `<span class="${strengthClass}">${strengthText}</span><br>Time to guess this password: ${crackTimes}`;
}

function copyPassword() {
    const passwordInput = document.getElementById('generatedPassword');
    const copyBtn = document.getElementById('copyBtn');
    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');

    copyBtn.textContent = 'Password Copied!';
    setTimeout(function() {
        copyBtn.textContent = 'Copy Password';
    }, 2000);
}
