import { posterPath, collectionType } from './keysAndApiPath';

const jQuery = require('jquery');

function createTopMoviesList(containerId, movieData, authenticatedUser) {
    let showTopMoviesHtml = '';
    if (movieData.results) {
        jQuery.each(movieData.results, (index, movieRecod) => {
            showTopMoviesHtml += `
            <div class=" col-md-2 p-1 movieContainer" id= ${movieRecod.id} movieListId="${movieRecod.id}">
                <img src="${posterPath + movieRecod.poster_path}" alt="${movieRecod.original_title}" class="img-thumbnail rounded movieImage">
                <div class="buttom-panel text-center mt-1">`;
            if (authenticatedUser) {
                showTopMoviesHtml += `<button type="button" class="collectionButton btn btn-success" movieId="${movieRecod.id}">Add To Collection</button></div></div>`;
            } else {
                showTopMoviesHtml += '</div></div>';
            }
        });
    }
    jQuery(`#${containerId}`).append(showTopMoviesHtml);
}
function openModelPopup(data) {
    jQuery('body').append(
        `<div class="modal fade modalDetailContainer" id="${data.id}-popup" tabindex="-1" role="dialog" aria-labelledby="dataModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content bg-danger">
                    <div class="modal-header">
                        <span>
                        ${data.modalHeader}
                        </span>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closeModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body ">
                        ${data.modalBody}
                    </div>
                </div>
            </div>
        </div>`,
    );
    jQuery(`#${data.id}-popup`).modal('show');
}
function createMovieDetail(movieDetailData, openPopup, EnableCollectionPane) {
    let collectionList = '';
    jQuery.each(collectionType, (index, value) => {
        collectionList += `<option value="${value}">${value}</option>`;
    });
    const modalHeader = `<a href="/movie/363088-ant-man-and-the-wasp">
                    <h2 class="d-inline-block">${movieDetailData.title}</h2>
                </a>
                <span class="release_date font-weight-bold">${movieDetailData.release_date.split('-')[0]}</span>`;
    const modalBody = ` <div class="d-flex">
    <div class="col-4 poster-wraper">
        <img src="${posterPath + movieDetailData.poster_path}" alt="${movieDetailData.title}" class="img-thumbnail rounded">
    </div>
  <div class="col-8">
     <ul class="nav text-center small">
        <li class="chart">
           <div class="d-inline-block text-dark font-weight-bold">
              <cite id="movieRating">${movieDetailData.vote_average}</cite>
              <span class="fas fa-star"></span>
              <span class="d-block">User Score</span>
           </div>
        </li>
        <li class="nav-item ${EnableCollectionPane ? '' : 'd-none'}" title="Add To Collection" data-role="tooltip">
           <a id="addToCollectionBtn" class="nav-link" href="#">Add To Collection</a>
        </li>
        <li class="nav-item ${movieDetailData.faviroiteFlag ? '' : 'd-none'}" title="Add To Collection" data-role="tooltip">
           <a id="removeTOCollectionBtn" class="nav-link" href="#" collectionName="${movieDetailData.collectionName}">Remove From Collection</a>
        </li>
        <li class="video nav-item ">
           <a class="nav-link play_trailer" href="#" data-id="8_rTIAOohas">
           <span>
           <i class="fas fa-play"></i>
           Play Trailer</span>
           </a>
        </li>
     </ul>
     <div class="mt-2">
        <h3  class="text-success font-weight-bold">Overview</h3>
        <div class="overview lead" id="movieOverview">
           <p class="text-white small">${movieDetailData.overview}"</p>

           <div id="addToCollectionSection" class="text-center p-2 ${!EnableCollectionPane ? '' : 'd-none'}">
                <h5 class="text-dark p-2 ">Select collection name to add this movie</h5>
                <div class="input-group mb-3">
                    <select class="custom-select" id="CollSelection" movieId="${movieDetailData.id}">
                         ${collectionList}
                     </select>
                    <div class="input-group-append">
                        <button class="btn btn-secondary"  id="collButton">Add To Collection</button>
                    </div>
                </div>
            </div>
        </div>
     </div>`;
    if (openPopup) {
        openModelPopup({ id: movieDetailData.id, modalHeader, modalBody });
    }
}
function CreateUserCollection(container, response, appendFlag) {
    let userCollectionHtml = '';
    jQuery.each(response, (ind, resData) => {
        const containerId = resData.id;
        if (resData.data && resData.data.length) {
            userCollectionHtml += `<div class="col-md-2 p-1">
            <div id="${containerId.toLowerCase()}-Container" class="text-center carousel slide carousel-fade" data-ride="carousel">
                <div class="carousel-inner">`;
            jQuery.each(resData.data, (index, value) => {
                userCollectionHtml += `<div class="carousel-item ${index ? '' : 'active'}" id="${value.id}-${containerId}" movieListId="${value.id}">
                <img src="${posterPath + value.poster_path}" alt="${value.original_title}" class="img-thumbnail rounded collectionMovieImage" collectionName="${containerId}">
                </div>`;
            });
            userCollectionHtml += `</div>
            <a class="carousel-control-prev" href="#${containerId}-Container" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#${containerId}-Container" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <button class="btn btn-danger px-5 userColloctionBtn" type="button" id="user${containerId}Btn"> ${containerId}</button>
        </div>
        `;
        }
    });
    if (userCollectionHtml) {
        if (appendFlag) {
            jQuery('#noRecoredFound').remove();
            jQuery(`#${container}`).append(userCollectionHtml);
        } else {
            jQuery(`#${container}`).html(userCollectionHtml);
        }
    }
}
function addMovieToCollectionHtml(collectionName, value) {
    jQuery(`#${collectionName}-Container`).find('.carousel-inner').prepend(
        ` <div class="carousel-item" id="${value.id}-${collectionName}" movieListId="${value.id}">
                <img src="${posterPath + value.poster_path}" alt="${value.original_title}" class="img-thumbnail rounded collectionMovieImage" collectionName="${collectionName}">
                </div>`,
    );
}
function removeMovieFromUserColl(contianerId, data) {
    const collectionContianer = jQuery(`#${data.collectionName}-Container`);
    if (collectionContianer.find('.carousel-item').length === 1) {
        collectionContianer.parent().remove();
        if (!jQuery(`#${contianerId}`).children().length) {
            jQuery(`#${contianerId}`).html('<h4 class="text-dark font-weight-bold p-5 text-center w-100" id="noRecoredFound">No User Collection</h4>');
        }
    } else {
        const thisElm = jQuery(`#${data.movieId}-${data.collectionName}`);
        if (thisElm.next().length) {
            thisElm.next().addClass('active');
        } else {
            thisElm.prev().addClass('active');
        }
        thisElm.remove();
    }
}
function openLoginModelPopup() {
    jQuery('body').append(
        `<div class="modal fade" id="login-popup" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog w-50" role="document">
                <div class="modal-content bg-white text-dark text-center">
                    <div class="modal-header">
                        <h4>
                        Pardon the interruption.
                        </h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closeModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body w-75 mx-auto">
                       <h5>
                       We’ve glad to see you here. Let’s make things official.
                       </h5>
                       <ul class="login-link mt-3 w-75 mx-auto list-unstyled">
                            <li>
                                <a href='/auth/facebook'>
                                <i class="fab fa-facebook-f mr-1"></i> Sign in With Facebook
                               </a>
                            </li>
                            <li>
                                <a href='/auth/twitter'>
                                    <i class="fab fa-twitter mr-1"></i> Sign in With Twitter
                                </a>
                            </li>
                            <li>
                                <a href='/auth/google'>
                                    <i class="fab fa-google-plus-g mr-1"></i> Sign in With Google
                            </a>
                            </li>
                            
                        </ul>
                        <p class='w-75 mx-auto my-1'>
                            we log user data and dont share it with any service providers. Click "Sign In" above to access
                            <p class='font-weight-bold my-1'> Movie-World</p>
                        </p> 
                        <p><abbr class='font-italic' style='text-decoration:underline'> Terms of Service</span> & Privacy Policy.</abbr>                     
                    </div>
                </div>
            </div>
        </div>`,
    );
    jQuery('#login-popup').modal('show');
}
export {
    createTopMoviesList, createMovieDetail,
    CreateUserCollection, addMovieToCollectionHtml,
    removeMovieFromUserColl, openLoginModelPopup,
};
