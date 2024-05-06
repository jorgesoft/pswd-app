let globalWords = {}; // Global variable to store the words dictionary

document.addEventListener("DOMContentLoaded", function() {
    loadWordListAndGeneratePassphrase(); // Load words and generate initial passphrase on page load
});

async function loadWordListAndGeneratePassphrase() {
    const response = await fetch('https://raw.githubusercontent.com/jorgesoft/pswd-app/main/static/eff_short_wordlist_1.json');
    globalWords = await response.json();
    generatePassphrase(); // Call this function without passing 'words' as it now uses the global variable
}

function updateLengthDisplay(value) {
    document.getElementById('lengthDisplay').textContent = value + ' words';
}

function generatePassphrase() {
    const numWords = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    let passphrase = '';
    const wordKeys = Object.keys(globalWords);
    for (let i = 0; i < numWords; i++) {
        let word = globalWords[wordKeys[Math.floor(Math.random() * wordKeys.length)]];
        if (includeUppercase) {
            word = word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter of each word
        }
        passphrase += (i > 0 ? ' ' : '') + word;
    }

    // Append a random number at the end of the passphrase if checked
    if (includeNumbers) {
        passphrase += Math.floor(Math.random() * 10); // Append a random number (0-9)
    }

    // Append a random symbol at the end of the passphrase if checked
    if (includeSymbols) {
        const symbols = "!@#$%^&*()";
        passphrase += symbols.charAt(Math.floor(Math.random() * symbols.length)); // Append a random symbol
    }

    document.getElementById('generatedPassword').value = passphrase;
    analyzeStrength(passphrase);
}

function analyzeStrength(passphrase) {
    const result = zxcvbn(passphrase);
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

    strengthDisplay.innerHTML = `<span class="${strengthClass}">${strengthText}</span><br>Time to guess this passphrase: ${crackTimes}`;
}

function copyPassword() {
    const passphraseInput = document.getElementById('generatedPassword');
    const copyBtn = document.getElementById('copyBtn');
    passphraseInput.select();
    passphraseInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');

    copyBtn.textContent = 'Passphrase Copied!';
    setTimeout(function() {
        copyBtn.textContent = 'Copy Passphrase';
    }, 2000);
}
