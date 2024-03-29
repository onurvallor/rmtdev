const bookmarksBtnEl = document.querySelector('.bookmarks-btn');
const errorEl = document.querySelector('.error');
const errorTextEl = document.querySelector('.error__text');
const jobDetailsEl = document.querySelector('.job-details');
const jobDetailsContentEl = document.querySelector(".job-details__content");
const jobListBookmarksEl = document.querySelector('.job-list--bookmarks');
const jobListSearchEl = document.querySelector(".job-list--search");
const numberEl = document.querySelector(".count__number");
const paginationEl = document.querySelector(".pagination");
const paginationBtnNextEl = document.querySelector(".pagination__button--next");
const paginationBtnBackEl = document.querySelector(".pagination__button--back");
const paginationNumberNextEl = document.querySelector(".pagination__number--next");
const paginationNumberBackEl = document.querySelector(".pagination__number--back");
const searchFormEl = document.querySelector(".search");
const searchInputEl = document.querySelector(".search__input");
const sortingEl = document.querySelector(".sorting");
const sortingBtnRelevantEl = document.querySelector(".sorting__button--relevant");
const sortingBtnRecentEl = document.querySelector(".sorting__button--recent");
const spinnerSearchEl = document.querySelector(".spinner--search");
const spinnerJobDetailsEl = document.querySelector(".spinner--job-details");

// SEARCH COMPONENT
const submitHandler = (event) => {

    event.preventDefault();

    const searchText = searchInputEl.value;

    const forbiddenPattern = /[0-9]/;

    const patternMatch = forbiddenPattern.test(searchText);

    if(patternMatch){
        errorTextEl.textContent = "Your search may not contain numbers";
        errorEl.classList.add('error--visible');
        setTimeout(() => {
            errorEl.classList.remove('error--visible');
        }, 3500);
        return;
    }

    searchInputEl.blur();

    jobListSearchEl.innerHTML = '';

    spinnerSearchEl.classList.add('spinner--visible');

    fetch(`https://bytegrad.com/course-assets/js/2/api/jobs?search=${searchText}`)
        .then(res => {
            if(!res.ok){
                console.log('Something went wrong');
                return;
            }

            return res.json();
        })
        .then((data) => {
            const {jobItems} = data;

            //console.log(jobItems);

            spinnerSearchEl.classList.remove('spinner--visible');

            numberEl.textContent = jobItems.length;

            jobItems.slice(0, 7).forEach(jobItem => { 
                const newJobItemHTML = `
                    <li class="job-item">
                        <a class="job-item__link" href="${jobItem.id}">
                            <div class="job-item__badge">${jobItem.badgeLetters}</div>
                            <div class="job-item__middle">
                                <h3 class="third-heading">${jobItem.title}</h3>
                                <p class="job-item__company">${jobItem.company}</p>
                                <div class="job-item__extras">
                                    <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i> ${jobItem.duration}</p>
                                    <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i> ${jobItem.salary}</p>
                                    <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i> ${jobItem.location}</p>
                                </div>
                            </div>
                            <div class="job-item__right">
                                <i class="fa-solid fa-bookmark job-item__bookmark-icon"></i>
                                <time class="job-item__time">${jobItem.daysAgo}d</time>
                            </div>
                        </a>
                    </li>
                `;
                jobListSearchEl.insertAdjacentHTML('beforeend', newJobItemHTML);
            });



        })
        .catch(error => console.log(error));
};

searchFormEl.addEventListener('submit', submitHandler);


// JOB LIST COMPONENT

const clickHandler = (event) => {
    event.preventDefault();
    
    const jobItemEl = event.target.closest('.job-item');

    const activeJobItemEl = document.querySelector('.job-item--active');

    activeJobItemEl?.classList.remove('job-item--active');

    jobItemEl.classList.add('job-item--active');

    jobDetailsContentEl.innerHTML = '';

    spinnerJobDetailsEl.classList.add('spinner--visible');

    const id = jobItemEl.children[0].getAttribute('href');

    fetch(`https://bytegrad.com/course-assets/js/2/api/jobs/${id}`)
    .then((res) => {
        if(!res.ok){
            console.log('Error')
            return;
        }
        return res.json();
    })
    .then(data => {
        const {jobItem} = data;

        spinnerJobDetailsEl.classList.remove('spinner--visible');

        const jobDetailsHTML = `
            <img src="${jobItem.coverImgURL}" alt="#" class="job-details__cover-img">

            <a class="apply-btn" href="${jobItem.companyURL}" target="_blank">Apply <i class="fa-solid fa-square-arrow-up-right apply-btn__icon"></i></a>

            <section class="job-info">
                <div class="job-info__left">
                    <div class="job-info__badge">${jobItem.badgeLetters}</div>
                    <div class="job-info__below-badge">
                        <time class="job-info__time">${jobItem.daysAgo}d</time>
                        <button class="job-info__bookmark-btn">
                            <i class="fa-solid fa-bookmark job-info__bookmark-icon"></i>
                        </button>
                    </div>
                </div>
                <div class="job-info__right">
                    <h2 class="second-heading">${jobItem.title}</h2>
                    <p class="job-info__company">${jobItem.company}</p>
                    <p class="job-info__description">${jobItem.description}</p>
                    <div class="job-info__extras">
                        <p class="job-info__extra"><i class="fa-solid fa-clock job-info__extra-icon"></i>${jobItem.duration}</p>
                        <p class="job-info__extra"><i class="fa-solid fa-money-bill job-info__extra-icon"></i> ${jobItem.salary}</p>
                        <p class="job-info__extra"><i class="fa-solid fa-location-dot job-info__extra-icon"></i> ${jobItem.location}</p>
                    </div>
                </div>
            </section>

            <div class="job-details__other">
                <section class="qualifications">
                    <div class="qualifications__left">
                        <h4 class="fourth-heading">Qualifications</h4>
                        <p class="qualifications__sub-text">Other qualifications may apply</p>
                    </div>
                    <ul class="qualifications__list">
                        ${jobItem.qualifications.map(qualificationsText => `<i class="qualifications__item">${qualificationsText}</i>`).join(' ')}
                    </ul>
                </section>

                <section class="reviews">
                    <div class="reviews__left">
                        <h4 class="fourth-heading">Company reviews</h4>
                        <p class="reviews__sub-text">Recent things people are saying</p>
                    </div>
                    <ul class="reviews__list">
                        ${jobItem.reviews.map(reviewsText => `<i class="reviews__item">${reviewsText}</i>`).join(' ')}
                    </ul>
                </section>
            </div>

            <footer class="job-details__footer">
                <p class="job-details__footer-text">If possible, please reference that you found the job on <span class="u-bold">rmtDev</span>, we would really appreciate it!</p>
            </footer>
        `;

        jobDetailsContentEl.innerHTML = jobDetailsHTML;
    })
    .catch(error => console.log(error));
};

jobListSearchEl.addEventListener('click', clickHandler);