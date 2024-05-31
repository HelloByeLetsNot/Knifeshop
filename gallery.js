document.addEventListener('DOMContentLoaded', () => {
    fetch('data/services.json')
        .then(response => response.json())
        .then(data => {
            const galleryContainer = document.getElementById('gallery-container');
            const galleryText = document.getElementById('gallery-text');
            let currentSlide = 0;

            data.services.forEach((service, index) => {
                const slideBefore = document.createElement('div');
                slideBefore.className = 'gallery-slide';
                slideBefore.dataset.text = `Before: ${service.name}`;
                slideBefore.innerHTML = `<img src="${service.beforeImage}" alt="Before ${service.name}">`;

                const slideAfter = document.createElement('div');
                slideAfter.className = 'gallery-slide';
                slideAfter.dataset.text = `After: ${service.name}`;
                slideAfter.innerHTML = `<img src="${service.afterImage}" alt="After ${service.name}">`;

                galleryContainer.appendChild(slideBefore);
                galleryContainer.appendChild(slideAfter);
            });

            const slides = document.querySelectorAll('.gallery-slide');

            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                galleryText.textContent = slides[index].dataset.text;
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }

            showSlide(currentSlide);
            setInterval(nextSlide, 3000); // Change slide every 3 seconds
        })
        .catch(error => {
            console.error('Error fetching gallery data:', error);
        });
});