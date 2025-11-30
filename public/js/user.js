$(document).ready(function() {
    const profileIcon = $('.profile-icon');
    const logoutIcon = $('.logout-icon');
    const accommodationsGrid = $('#accommodationsGrid');

    // Função para carregar o perfil do usuário
    function loadProfile() {
        getUrlParams = new URLSearchParams(window.location.search);
        username = getUrlParams.get('username');

        $.ajax({
            type: 'POST',
            url: '../src/controllers/ProfileController.php?action=get_user_profile',
            dataType: 'json',
            data: JSON.stringify({ username: username }),
            contentType: 'application/json',
            success: function(response) {
                if (response.success) {
                    displayProfile(response.profile);
                    loadHistory(response.profile);
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Erro ao carregar o perfil.');
                // window.location.href = 'index.html';
            }
        });
    }

    // Função para exibir o perfil
    function displayProfile(profile) {
        $('#profileName').text(profile.name);
        $('#profileCity').text(profile.city || '-');
        $('#profileProfession').text(profile.profession || '-');
        $('#profileInterests').text(profile.interests || '-');
        $('#profileBio').text(profile.bio || '-');

        // Preenche o formulário de edição com os dados atuais
        $('#editName').val(profile.name);
        $('#editCity').val(profile.city);
        $('#editProfession').val(profile.profession);
        $('#editInterests').val(profile.interests);
        $('#editBio').val(profile.bio);
    }

    // Evento de clique no ícone de perfil (redireciona para a página de perfil)
    profileIcon.on('click', function() {
        window.location.href = 'profile.html';
    });

    // Evento de clique no ícone de logout
    logoutIcon.on('click', function() {
        if (confirm('Deseja sair?')) {
            // Em um projeto real, você faria uma requisição AJAX para destruir a sessão no backend
            alert('Logout realizado com sucesso!');
            window.location.href = 'index.html';
        }
    });

    // Função para carregar as acomodações do usuário
    function loadAccommodations() {
        getUrlParams = new URLSearchParams(window.location.search);
        username = getUrlParams.get('username');

        $.ajax({
            type: 'GET',
            url: '../src/controllers/PropertyController.php?username=' + username,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    displayAccommodations(response.properties);
                } else {
                    accommodationsGrid.html('<p>Nenhuma acomodação encontrada.</p>');
                }
            },
            error: function() {
                accommodationsGrid.html('<p>Erro ao carregar acomodações.</p>');
            }
        });
    }

    function loadHistory(user) {
        let requests_historic = user.historic.map(historic_info => `
            <div class="review-card">
                <p class="building">${historic_info.building}</p>
                <p>${historic_info.text}</p>
            </div>
        `).join('');

        if(user.historic.length === 0) {
            requests_historic = `<p>${user.name} ainda não possui histórico.</p>`;
        }
        $('#historyGrid').html(requests_historic);
    }

    // Função para exibir as acomodações
    function displayAccommodations(properties) {
        accommodationsGrid.empty();
        
        if (properties.length === 0) {
            accommodationsGrid.html('<p>Você ainda não tem acomodações.</p>');
            return;
        }
        
        properties.forEach(function(property) {
            const accommodationCard = `
                <div class="accommodation-card">
                    <a href="property.html?id=${property.id}">
                        <div class="accommodation-image">
                            <!-- Imagem do imóvel -->
                        </div>
                        <div class="accommodation-info">
                            <h4>${property.title}</h4>
                        </div>
                    </a>
                </div>
            `;
            accommodationsGrid.append(accommodationCard);
        });
    }

    // Carrega o perfil e as acomodações ao iniciar a página
    loadProfile();
    loadAccommodations();
});
