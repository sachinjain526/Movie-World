import {
    movieDetailPath, apiKey, baseUrl,
} from './keysAndApiPath';

const headerJson = {
    method: 'get', 'Access-Control-Allow-Origin': '*', mode: 'cors', 'Content-Type': 'application/json',
};
const jQuery = require('jquery');

// common method
function fetchDatFromApi(url, callback, collectionName) {
    fetch(url, headerJson).then((response) => {
        // Examine the text in the response
        response.json().then((data) => {
            console.log(data);
            if (collectionName) {
                callback(data, collectionName);
            } else {
                callback(data);
            }
        });
    });
}
// movie api calls
function getMovieRecords(pagN0, callback) {
    fetchDatFromApi(`https://api.themoviedb.org/3/discover/movie${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pagN0}`, callback);
}
function getFullMovieDetails(MovieRefId, showMovieDetails, collectionName) {
    const url = movieDetailPath + MovieRefId + apiKey;
    fetchDatFromApi(url, showMovieDetails, collectionName);
}
function getCollectionTypes(callback) {
    fetchDatFromApi('https://api.themoviedb.org/3/genre/movie/list?api_key=e423c3150a1dbc6ec70f9322a432eb28&language=en-US', callback);
}
function getSearchedMovie(movieName, pageNumber, callback) {
    fetchDatFromApi(`https://api.themoviedb.org/3/search/movie?api_key=7520477c96fad381a44633a2b7596a01&language=en-US&query=${movieName}&page=${pageNumber}&include_adult=false`, callback);
}
// saving data to collection
function saveUserCollection(collectionName, passData, callback) {
    const userData = JSON.parse(localStorage.getItem('loggedUserInfo'));
    jQuery.ajax({
        headers: {
            userId: userData['_id'],
        },
        url: `${baseUrl}collection/${collectionName}`,
        method: 'POST',
        data: passData,
        dataType: 'json',
    }).done((resData) => {
        callback(resData, collectionName);
    }).fail((jqXHR, textStatus) => {
        console.log(`Request failed: ${textStatus}`);
        console.log(jqXHR);
    });
}
function getUserCollection(callback) {
    const userData = JSON.parse(localStorage.getItem('loggedUserInfo'));
    jQuery.ajax({
        headers: {
            userId: userData['_id'],
        },
        url: `${baseUrl}usercollection`,
        method: 'get',
        dataType: 'json',
    }).done((ResData) => {
        const tempArr = [];
        jQuery.each(ResData, (collectionNmae, collectionData) => {
            tempArr.push({ id: collectionNmae, data: collectionData });
        });
        callback(tempArr);
    }).fail((jqXHR) => {
        console.log(jqXHR);
    });
}
function getAndDeleteMovieCollection(method, movieId, collectionName, callback) {
    const userData = JSON.parse(localStorage.getItem('loggedUserInfo'));
    jQuery.ajax({
        headers: {
            userId: userData['_id'],
        },
        url: `${baseUrl}collection/${collectionName}/${movieId}`,
        method,
        dataType: 'json',
    }).done((ResData) => {
        ResData.collectionName = collectionName.toLowerCase();
        ResData.movieId = movieId;
        callback(ResData);
    }).fail((jqXHR, textStatus) => {
        console.log(`Request failed: ${textStatus}`);
        console.log(jqXHR);
    });
}
export {
    getMovieRecords, getFullMovieDetails, saveUserCollection,
    getUserCollection, getSearchedMovie, getAndDeleteMovieCollection,
    getCollectionTypes,
};
