function sendMail() {
    let params = {
        name: document.getElementById("name").value,
        mail: document.getElementById("mail").value,
        message: document.getElementById("message").value,
    };

    emailjs.send("service_dzgm7ng", "template_20anflh", params)
        .then(function (res) {
            console.log(res);
            alert("Your message has been sent successfully!");
            document.getElementById("contact-form").reset();
        })
        .catch(function (err) {
            console.error("Failed to send email:", err);
            alert("Oops! Something went wrong. Please try again later.");
        });

    return false;
}
