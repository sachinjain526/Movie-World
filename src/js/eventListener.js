import {
    getFullMovieDetails, getMovieRecords, getUserCollection,
    saveUserCollection, getSearchedMovie, getAndDeleteMovieCollection,
} from './apiDataServices';
import {
    createMovieDetail, createTopMoviesList, CreateUserCollection,
    addMovieToCollectionHtml, removeMovieFromUserColl, openLoginModelPopup,
} from './createListAndCollection';

const jQuery = require('jquery');

// call back and basic functions

function showMovieDetailWithEnabledCollPane(data) {
    createMovieDetail(data, true, false);// movieDetailData,collection,EnableCollectionPane
}
function addCollection(data, collectionName) {
    const saveData = {
        id: data.id,
        original_language: data.original_language,
        overview: data.overview,
        poster_path: data.poster_path,
        release_date: data.release_date,
        title: data.title,
        vote_average: data.vote_average,
        faviroiteFlag: true,
    };
    saveUserCollection(collectionName, saveData, (responseData, collection) => {
        if (jQuery(`#${collection.toLowerCase()}-Container`).length) {
            addMovieToCollectionHtml(collection.toLowerCase(), responseData);
        } else {
            const resData = { id: collection, data: [responseData] };
            CreateUserCollection('userCollectionContainer', [resData], true);
        }
    });
}

function showMovieDetailsPopup(data) {
    createMovieDetail(data, true, true);
}
function displayLoggedUserInfo(userData) {
    if (userData) {
        getMovieRecords(1, (data) => {
            createTopMoviesList('topMoviesContainer', data, true);
        });
        getUserCollection((data) => {
            jQuery('#userCollection').removeClass('d-none');
            CreateUserCollection('userCollectionContainer', data);
        });
        jQuery('#rightNavBar').html(`
            <li class="nav-item">
            <a href="#" class="nav-link">
                <span class="fas fa-user"></span> ${userData.displayName}</a>
            </li>
            <li class="nav-item">
                <a href="/logout" class="nav-link" id='logoutAction'>
                    <span class="fas fa-sign-out-alt"></span> Log Out</a>
            </li>`);
    } else {
        getMovieRecords(1, (data) => {
            createTopMoviesList('topMoviesContainer', data);
        });
        jQuery('#userCollection').addClass('d-none');
        jQuery('#rightNavBar').html(`
            <li class="nav-item">
            <a href="#" class="nav-link" style="pointer-event:none">
                <span class="fas fa-user"></span> Anonymous</a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link" id='SignInAction'>
                    <span class="fas fa-sign-in-alt"></span> Sign In</a>
            </li>`);
    }
}
function checkUserLoggedIn() {
    const userData = localStorage.getItem('loggedUserInfo');
    if (userData) {
        displayLoggedUserInfo(JSON.parse(userData));
    } else {
        jQuery.ajax({
            url: '/api/current_user',
            method: 'get',
            dataType: 'json',
        }).done((resData) => {
            if (resData) {
                localStorage.setItem('loggedUserInfo', JSON.stringify(resData));
                displayLoggedUserInfo(resData);
            } else {
                openLoginModelPopup();
                displayLoggedUserInfo(null);
            }
        }).fail((jqXHR, textStatus) => {
            console.log(`Request failed: ${textStatus}`);
            console.log(jqXHR);
        });
    }
}


// scrolling function
function scrollHorizontally(containerId, moveTO, movieApiCall) {
    const sectionElem = jQuery(`#${containerId}`);
    const currentScroll = parseInt(sectionElem.scrollLeft(), 10);
    const width = Math.floor(sectionElem.outerWidth());
    const { scrollWidth } = sectionElem.get(0);
    if (moveTO === 'next') {
        sectionElem.animate({ scrollLeft: currentScroll + 800 }, 800);
        if (scrollWidth - currentScroll === width) {
            const pagenumber = parseInt(sectionElem.attr('pagenumber'), 10) + 1;
            const userDataFlag = localStorage.getItem('loggedUserInfo');
            const movieName = sectionElem.attr('moveName');
            movieApiCall(pagenumber, (data) => {
                createTopMoviesList(containerId, data, userDataFlag);
            }, movieName);
            sectionElem.attr('pagenumber', pagenumber);
        }
    } else {
        sectionElem.animate({ scrollLeft: currentScroll - 800 }, 800);
    }
}
function eventListener() {
    jQuery('body').on('click', '#logoutAction', () => {
        localStorage.removeItem('loggedUserInfo');
    });
    jQuery('body').on('click', '#SignInAction', () => {
        openLoginModelPopup();
    });
    jQuery('#topMoviesScrolltoRight').click(() => {
        scrollHorizontally('topMoviesContainer', 'next', getMovieRecords);
    });
    jQuery('#topMoviesScrolltoLeft').click(() => {
        scrollHorizontally('topMoviesContainer', 'prev');
    });
    jQuery('#searchedMoviesScrolltoRight').click(() => {
        scrollHorizontally('searchedMoviesContainer', 'next', getSearchedMovie);
    });
    jQuery('#searchedMoviesScrolltoLeft').click(() => {
        scrollHorizontally('searchedMoviesContainer', 'prev');
    });
    jQuery(document).on('click', '.collectionButton', function () {
        const movieId = jQuery(this).attr('movieId');
        getFullMovieDetails(movieId, showMovieDetailWithEnabledCollPane);
    });
    jQuery(document).on('click', '.movieImage', function () {
        const movieId = jQuery(this).parent().attr('movieListId');
        getFullMovieDetails(movieId, showMovieDetailsPopup);
    });
    jQuery(document).on('click', '.collectionMovieImage', function () {
        const movieId = jQuery(this).parent().attr('movieListId');
        const collectionName = jQuery(this).attr('collectionName');
        getAndDeleteMovieCollection('GET', movieId, collectionName, showMovieDetailsPopup);
    });

    jQuery('body').on('click', '#movieSearchButton', () => {
        const movieName = jQuery('#movieSearchInput').val();
        jQuery('#searchedMoviesContainer').html('').attr('moveName', movieName);
        getSearchedMovie(1, (data) => {
            const userDataFlag = localStorage.getItem('loggedUserInfo');
            createTopMoviesList('searchedMoviesContainer', data, userDataFlag);
        }, movieName);
        jQuery('#searchedMovies').removeClass('d-none');
    });
    jQuery(document).on('click', '#closeModal', function () {
        const modalId = jQuery(this).parents('.modal').attr('id');
        jQuery(`#${modalId}`).on('hidden.bs.modal', function () {
            jQuery(this).remove();
        });
    });
    jQuery(document).on('click', '#collButton', () => {
        const movieId = jQuery('#CollSelection').attr('movieId');
        const collectionName = jQuery('#CollSelection').val();
        getFullMovieDetails(movieId, addCollection, collectionName);
        jQuery('#closeModal').trigger('click');
    });
    jQuery(document).on('click', '#addToCollectionBtn', () => {
        const userData = localStorage.getItem('loggedUserInfo');
        if (userData) {
            jQuery('#addToCollectionSection').removeClass('d-none');
        } else {
            openLoginModelPopup();
        }
    });
    jQuery(document).on('click', '#removeTOCollectionBtn', function () {
        const modalId = jQuery(this).parents('.modal').attr('id');
        const movieId = modalId.split('-')[0];
        const collectionName = jQuery(this).attr('collectionName');
        getAndDeleteMovieCollection('DELETE', movieId, collectionName, (deleteData) => {
            removeMovieFromUserColl('userCollectionContainer', deleteData);
        });
        jQuery('#closeModal').trigger('click');
    });
}

export { eventListener, checkUserLoggedIn };
