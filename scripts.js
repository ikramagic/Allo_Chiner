$.get("config.php", function(la_kley) {
  const la_kley = data.API_KEY;

  $(document).ready(function() {
      // Gestion de la soumission du formulaire de recherche
      $('#searchForm').on('submit', function(e) {
          e.preventDefault();
          const searchText = $('#searchText').val();
          fetchMovies(searchText);
      });

      // Récupération des films depuis l'API OMDb
      function fetchMovies(searchText) {
          $.ajax({
              method: 'GET',
              url: `http://www.omdbapi.com/?s=${searchText}&apikey=${la_kley}`,
              dataType: 'json',
              success: function(data) {
                  if (data.Response === 'True') {
                      updateGallery(data.Search);
                  } else {
                      $('#movieGallery').html('<div class="col">Film non trouvé.</div>');
                  }
              },
              error: function() {
                  alert('Erreur lors de la récupération des données.');
              },
          });
      }

      // Mise à jour de la galerie de films
      function updateGallery(movies) {
          let galleryHtml = '';
          movies.forEach(function(movie) {
              galleryHtml += `
                  <div class="col-xl-3 col-lg-4 col-md-6">
                      <div class="gallery-item h-100">
                          <img src="${movie.Poster}" class="img-fluid" alt="${movie.Title}">
                          <div class="gallery-links d-flex align-items-center justify-content-center">
                              <a href="${movie.Poster}" title="${movie.Title}" class="glightbox preview-link"><i class="bi bi-arrows-angle-expand"></i></a>
                              <a href="#" class="details-link read-more" data-id="${movie.imdbID}"><i class="bi bi-link-45deg"></i> En savoir plus</a>
                          </div>
                      </div>
                  </div>`;
          });
          $('#movieGallery').html(galleryHtml);
      }

      // Gestion des clics sur "En savoir plus" pour récupérer plus de détails
      $(document).on('click', '.read-more', function() {
          const movieId = $(this).data('id');
          fetchMovieDetails(movieId);
      });

      // Récupération des détails d'un film spécifique
      function fetchMovieDetails(movieId) {
          $.ajax({
              method: 'GET',
              url: `http://www.omdbapi.com/?i=${movieId}&apikey=${la_kley}`,
              dataType: 'json',
              success: function(response) {
                  displayMovieDetails(response);
              },
              error: function() {
                  alert('Erreur lors de la récupération des détails du film.');
              },
          });
      }

      // Affichage des détails d'un film
      function displayMovieDetails(details) {
          const detailsHtml = `
              <strong>Date de sortie:</strong> ${details.Released}<br>
              <strong>Genre:</strong> ${details.Genre}<br>
              <strong>Scénario:</strong> ${details.Plot}`;
          $('.modal-body').html(detailsHtml);
          $('#movieModal').modal('show');
      }

      // Fermeture de la modale avec le bouton
      $(document).on('click', '.close[data-dismiss="modal"]', function() {
          $('#movieModal').modal('hide');
      });
  });
});