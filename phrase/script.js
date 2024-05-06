document.addEventListener("DOMContentLoaded", function() {
    loadWordListAndGeneratePassphrase(); // Load words and generate initial passphrase on page load
});

async function loadWordListAndGeneratePassphrase() {
    const response = await fetch('https://raw.githubusercontent.com/jorgesoft/pswd-app/main/static/eff_short_wordlist_1.json'); // Ensure this path points to where your JSON file is served
    const words = await response.json();
    generatePassphrase(words);
}

function updateLengthDisplay(value) {
    document.getElementById('lengthDisplay').textContent = `${value} words`; // Reflect that the input is for words
}

function generatePassphrase(words) {
    const numWords = document.getElementById('passwordLength').value;
    let passphrase = '';
    const wordKeys = Object.keys(words);
    for (let i = 0; i < numWords; i++) {
        const randomIndex = Math.floor(Math.random() * wordKeys.length);
        passphrase += (i > 0 ? ' ' : '') + words[wordKeys[randomIndex]];
    }
    document.getElementById('generatedPassword').value = passphrase;
    analyzeStrength(passphrase); // Optional, if you want to keep passphrase strength analysis
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
