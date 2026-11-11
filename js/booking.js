// Newsletter Form Handler
document.getElementById('newsletterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const btn = this.querySelector('.newsletter-btn');
    
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUjf138_lhnyKQYAGH8xMRa9aYDHBAZliDpDF16HzqOIwkvVg2NPfqZtvYIfc23Iw5/exec';
    
    try {
        btn.textContent = 'Wird angemeldet...';
        btn.disabled = true;
        
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams({
                type: 'newsletter',
                email: email
            })
        });
        
        alert('✓ Danke für deine Anmeldung!');
        this.reset();
        btn.textContent = 'Anmelden';
        btn.disabled = false;
    } catch (error) {
        console.error('Fehler:', error);
        alert('Es gab einen Fehler. Bitte versuche es später erneut.');
        btn.textContent = 'Anmelden';
        btn.disabled = false;
    }
});

// Contact Form Handler mit WebStorage (localStorage) Entwurfsspeicherung
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Zu sichernde Formularfelder definieren
    const formFields = ['name', 'email', 'phone', 'subject', 'message'];

    // 1. Entwurf beim Laden der Seite aus localStorage wiederherstellen (getItem)
    formFields.forEach(fieldId => {
        const inputEl = document.getElementById(fieldId);
        const savedValue = localStorage.getItem(`booking_draft_${fieldId}`);
        
        if (inputEl && savedValue !== null) {
            inputEl.value = savedValue;
        }
    });

    // 2. Bei jeder Texteingabe den aktuellen Wert im localStorage speichern (setItem)
    formFields.forEach(fieldId => {
        const inputEl = document.getElementById(fieldId);
        if (inputEl) {
            inputEl.addEventListener('input', () => {
                localStorage.setItem(`booking_draft_${fieldId}`, inputEl.value);
            });
        }
    });

    // 3. Formular-Submit ausführen und Entwurf nach Erfolg löschen (removeItem)
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUjf138_lhnyKQYAGH8xMRa9aYDHBAZliDpDF16HzqOIwkvVg2NPfqZtvYIfc23Iw5/exec';
        const btn = document.querySelector('.submit-btn');
        
        try {
            btn.textContent = 'Wird gesendet...';
            btn.disabled = true;
            
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: new URLSearchParams({
                    type: 'contact',
                    name: name,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: message
                })
            });
            
            // Erfolgs-Nachricht anzeigen & Formular zurücksetzen
            document.getElementById('successMessage').classList.add('show');
            this.reset();

            // WebStorage bereinigen: gespeicherte Entwürfe nach dem Absenden entfernen
            formFields.forEach(fieldId => {
                localStorage.removeItem(`booking_draft_${fieldId}`);
            });

            btn.textContent = 'Nachricht Senden';
            btn.disabled = false;
            
            // Nachricht nach 5 Sekunden ausblenden
            setTimeout(() => {
                document.getElementById('successMessage').classList.remove('show');
            }, 5000);
        } catch (error) {
            console.error('Fehler:', error);
            alert('Es gab einen Fehler beim Senden. Bitte versuche es später erneut.');
            btn.textContent = 'Nachricht Senden';
            btn.disabled = false;
        }
    });
});
