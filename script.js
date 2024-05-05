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
    document.getElementById('passwordStrength').textContent = analyzeStrength(password);
}

function createPassword(length, upper, numbers, symbols) {
    const charset = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    let validChars = charset.lower; // Always include lowercase letters
    if (upper) validChars += charset.upper;
    if (numbers) validChars += charset.numbers;
    if (symbols) validChars += charset.symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += validChars[Math.floor(Math.random() * validChars.length)];
    }
    return password;
}

function analyzeStrength(password) {
    const result = zxcvbn(password);
    switch (result.score) {
        case 0:
        case 1:
            return 'Weak';
        case 2:
            return 'Fair';
        case 3:
            return 'Good';
        case 4:
            return 'Strong';
        default:
            return 'Weak';
    }
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
