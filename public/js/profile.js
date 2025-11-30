$(document).ready(function() {
    const profileIcon = $('.profile-icon');
    const logoutIcon = $('.logout-icon');
    const editProfileBtn = $('#editProfileBtn');
    const editProfileModal = $('#editProfileModal');
    const editProfileForm = $('#editProfileForm');
    const modalCloseBtn = $('.modal-close-btn');
    const cancelBtn = $('.cancel-btn');
    const publishBtn = $('#publishBtn');
    const accommodationsGrid = $('#accommodationsGrid');

    // Função para carregar o perfil do usuário
    function loadProfile() {
        $.ajax({
            type: 'GET',
            url: '../src/controllers/ProfileController.php',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    displayProfile(response.profile);
                    loadHistory(response.profile);
                } else {
                    alert(response.message);
                    window.location.href = 'index.html';
                }
            },
            error: function() {
                alert('Erro ao carregar o perfil.');
                window.location.href = 'index.html';
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

    // Função para abrir o modal de edição
    function openEditModal() {
        editProfileModal.addClass('active');
    }

    // Função para fechar o modal de edição
    function closeEditModal() {
        editProfileModal.removeClass('active');
    }

    // Função para salvar o perfil
    function saveProfile(profileData) {
        $.ajax({
            type: 'POST',
            url: '../src/controllers/ProfileController.php',
            contentType: 'application/json',
            data: JSON.stringify(profileData),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Perfil atualizado com sucesso!');
                    displayProfile(response.profile);
                    closeEditModal();
                } else {
                    alert('Erro ao atualizar o perfil: ' + response.message);
                }
            },
            error: function() {
                alert('Erro ao comunicar com o servidor.');
            }
        });
    }

    // Evento de clique no botão "Editar Perfil"
    editProfileBtn.on('click', function() {
        openEditModal();
    });

    // Evento de clique no botão de fechar modal
    modalCloseBtn.on('click', function() {
        closeEditModal();
    });

    // Evento de clique no botão "Cancelar"
    cancelBtn.on('click', function() {
        closeEditModal();
    });

    // Evento de clique fora do modal para fechar
    editProfileModal.on('click', function(e) {
        if (e.target.id === 'editProfileModal') {
            closeEditModal();
        }
    });

    // Evento de submissão do formulário de edição
    editProfileForm.on('submit', function(e) {
        e.preventDefault();

        const profileData = {
            name: $('#editName').val(),
            city: $('#editCity').val(),
            profession: $('#editProfession').val(),
            interests: $('#editInterests').val(),
            bio: $('#editBio').val()
        };

        saveProfile(profileData);
    });

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
        $.ajax({
            type: 'GET',
            url: '../src/controllers/PropertyController.php',
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
                    <div class="accommodation-image">
                        <!-- Imagem do imóvel -->
                    </div>
                    <div class="accommodation-info">
                        <h4>${property.title}</h4>
                        <a href="edit_property.html?id=${property.id}" class="edit-accommodation-btn">
                            <i class="fas fa-edit"></i>
                        </a>
                    </div>
                </div>
            `;
            accommodationsGrid.append(accommodationCard);
        });
    }

    // Evento de clique no botão "Divulgar um anúncio"
    publishBtn.on('click', function() {
        window.location.href = 'create_property.html';
    });

    function loadHistory(user) {
        let requests_historic = user.historic.map(historic_info => `
            <div class="review-card">
                <p class="building">${historic_info.building}</p>
                <p>${historic_info.text}</p>
            </div>
        `).join('');

        if(user.historic.length === 0) {
            requests_historic = `<p>Você ainda não possui histórico.</p>`;
        }
        $('#historyGrid').html(requests_historic);
    }

    // Carrega o perfil e as acomodações ao iniciar a página
    loadProfile();
    loadAccommodations();
});
