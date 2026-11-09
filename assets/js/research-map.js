(() => {
    document.querySelectorAll('.research-map').forEach((map) => {
        const filters = map.querySelector('.research-filters');
        const buttons = [...filters.querySelectorAll('button')];
        const topics = [...map.querySelectorAll('.research-topic')];
        const areas = [...map.querySelectorAll('.research-area')];
        const status = map.querySelector('.research-map-status');
        let selected = 'all';

        const highlight = (fields) => {
            areas.forEach((area) => {
                const active = fields.includes(area.dataset.area);
                area.classList.toggle('is-muted', fields.length > 0 && !active);
                area.classList.toggle('is-highlighted', active);
            });
        };
        const restore = () => highlight(selected === 'all' ? [] : [selected]);

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                selected = button.dataset.field;
                buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
                topics.forEach((topic) => {
                    topic.hidden = selected !== 'all' && !topic.dataset.fields.split(' ').includes(selected);
                });
                const count = topics.filter((topic) => !topic.hidden).length;
                status.textContent = selected === 'all'
                    ? '7 topics across four connected fields'
                    : `${count} ${count === 1 ? 'topic' : 'topics'} related to ${button.textContent.toLowerCase()}`;
                restore();
            });
        });

        topics.forEach((topic) => {
            topic.addEventListener('pointerenter', (event) => {
                if (event.pointerType !== 'touch') highlight(topic.dataset.fields.split(' '));
            });
            topic.addEventListener('pointerleave', restore);
        });
        filters.hidden = false;

        // A brief entrance when the illustration first comes into view.
        // Content remains visible if JavaScript or IntersectionObserver is unavailable.
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    map.classList.add('is-visible');
                    observer.disconnect();
                }
            }, { threshold: 0.15 });
            observer.observe(map.querySelector('.research-map-overview'));
            areas.forEach((area) => {
                area.addEventListener('animationend', () => {
                    // Release the entrance opacity so field highlighting can take over.
                    area.style.animation = 'none';
                }, { once: true });
            });
        }
    });
})();
