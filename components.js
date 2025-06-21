document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.createElement('header');
    const footerPlaceholder = document.createElement('footer');
    
    document.body.prepend(headerPlaceholder);
    document.body.append(footerPlaceholder);

    // Load Header
    fetch('header.html')
        .then(res => res.text())
        .then(data => {
            headerPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    fetch('footer.html')
        .then(res => res.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});
