$(document).ready(function() {
    const propertyFeed = $('#propertyFeed');
    const profileIcon = $('.profile-icon');
    const logoutIcon = $('.logout-icon');
    const filterModalOverlay = $('#filterModalOverlay');
    const openFilterModal = $('#openFilterModal');
    const filterForm = $('#filterForm');
    const sidebarNav = $('.sidebar-nav a');

    let allProperties = []; // Armazena todos os imóveis

    // Função para renderizar um card de imóvel
    function renderPropertyCard(property) {
        const details = property.details;
        
        // Define a classe do coração baseado no estado de favorito
        const favoriteClass = property.is_favorite ? 'favorite-active' : '';

        return `
            <div class="property-card" data-id="${property.id}">
                <div class="property-image-placeholder">
                    <!-- Imagem do Imóvel -->
                </div>
                <div class="property-info">
                    <div class="property-header">
                        <div>
                            <div class="property-price">${property.price}</div>
                            <div class="property-location">${property.location}</div>
                        </div>
                        <i class="fas fa-heart favorite-icon ${favoriteClass}" data-property-id="${property.id}"></i>
                    </div>
                    <div class="property-details">
                        <div class="property-detail-item">
                            <i class="fas fa-bed"></i> ${details.quartos} quartos
                        </div>
                        <div class="property-detail-item">
                            <i class="fas fa-car"></i> ${details.vagas} vagas
                        </div>
                        <div class="property-detail-item">
                            <i class="fas fa-ruler-combined"></i> ${details.area}m²
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Função para carregar o feed de imóveis
    function loadPropertyFeed(formdata = '') {
        propertyFeed.html('<p class="loading-message">Carregando imóveis...</p>');

        $.ajax({
            type: 'POST',
            url: '../src/controllers/DashboardController.php?action=list',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            success: function(response) {
                if (response.success) {
                    // Renderiza os imóveis
                    propertyFeed.empty();
                    arr_props = Object.values(response.properties)
                    allProperties = arr_props;
                    if (arr_props.length > 0) {
                        arr_props.forEach(function(property) {
                            propertyFeed.append(renderPropertyCard(property));
                        });
                        // Adiciona os eventos após a renderização
                        attachPropertyCardEvents();
                    } else {
                        propertyFeed.html('<p>Nenhum imóvel encontrado.</p>');
                    }
                } else {
                    // Se não estiver logado, redireciona para o login
                    alert(response.message);
                    window.location.href = 'index.html';
                }
            },
            error: function() {
                propertyFeed.html('<p class="error-message">Erro ao carregar o feed de imóveis.</p>');
            }
        });
    }

    // Função para carregar apenas os imóveis favoritos
    function loadFavoriteFeed(formData = '') {
        propertyFeed.html('<p class="loading-message">Carregando favoritos...</p>');

        $.ajax({
            type: 'POST',
            url: '../src/controllers/DashboardController.php?action=favorite_properties',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                if (response.success) {
                    // Renderiza os imóveis
                    propertyFeed.empty();
                    arr_props = Object.values(response.properties)
                    allProperties = arr_props;
                    if (arr_props.length > 0) {
                        arr_props.forEach(function(property) {
                            propertyFeed.append(renderPropertyCard(property));
                        });
                        // Adiciona os eventos após a renderização
                        attachPropertyCardEvents();
                    } else {
                        propertyFeed.html('<p>Nenhum imóvel encontrado.</p>');
                    }
                } else {
                    // Se não estiver logado, redireciona para o login
                    alert(response.message);
                    window.location.href = 'index.html';
                }
            },
            error: function() {
                propertyFeed.html('<p class="error-message">Você ainda não tem imóveis favoritos.</p>');
            }
        });
    }

    // Função para anexar eventos aos cards de imóvel
    function attachPropertyCardEvents() {
        // Evento de clique no card (navega para detalhes)
        $('.property-card').on('click', function(e) {
            // Se clicou no ícone de favorito, não navega
            if ($(e.target).hasClass('favorite-icon')) {
                return;
            }
            const propertyId = $(this).data('id');
            window.location.href = 'property.html?id=' + propertyId;
        });

        // Evento de clique no ícone de favorito
        $('.favorite-icon').on('click', function(e) {
            e.stopPropagation();
            const propertyId = $(this).data('property-id');
            const $icon = $(this);

            // Encontra o imóvel no array
            const property = allProperties.find(p => p.id === parseInt(propertyId));
            if (property) {
                // Alterna o estado de favorito
                property.is_favorite = !property.is_favorite;
                
                // Alterna a classe visual
                $icon.toggleClass('favorite-active');

                $.ajax({
                    type: 'POST',
                    url: '../src/controllers/PropertyController.php?is_favorite=' + property.is_favorite,
                    contentType: 'application/json',
                    data: JSON.stringify(property),
                    dataType: 'json',
                    success: function(response) {
                        if (!response.success) {
                            alert(response.message);
                        }
                    },
                    error: function() {
                        alert('Erro ao comunicar com o servidor.');
                    }
                });
                
                // Se estamos na aba de favoritos e o imóvel foi desfavoritado, remove da lista
                if (sidebarNav.eq(2).hasClass('active') && !property.is_favorite) {
                    // Recarrega a lista de favoritos
                    loadFavoriteFeed();
                }
            }
        });
    }

    // Lógica para abrir o modal de filtro
    openFilterModal.on('click', function() {
        filterModalOverlay.fadeIn(200);
    });

    // Lógica para fechar o modal de filtro ao clicar fora
    filterModalOverlay.on('click', function(e) {
        if (e.target.id === 'filterModalOverlay') {
            filterModalOverlay.fadeOut(200);
        }
    });

    // Lógica para fechar o modal ao pressionar ESC
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && filterModalOverlay.is(':visible')) {
            filterModalOverlay.fadeOut(200);
        }
    });

    // Lógica de submissão do formulário de filtro (simulação)
    filterForm.on('submit', function(e) {
        e.preventDefault();
        filterModalOverlay.fadeOut(200);
        const urlEncodedString = filterForm.serialize();
    
        // 2. Parse it into a useful object
        const params = new URLSearchParams(urlEncodedString);
        const filtros = Object.fromEntries(params.entries());

        loadPropertyFeed(filtros);
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

    // Gerencia a navegação entre abas
    sidebarNav.on('click', function(e) {
        e.preventDefault();
        const $this = $(this);
        const index = $this.index();
        console.log(index)

        // Remove a classe active de todos os links
        sidebarNav.removeClass('active');
        // Adiciona a classe active ao link clicado
        $this.addClass('active');

        // Carrega o conteúdo apropriado baseado no índice
        if (index === 0) {
            // Listagem
            loadPropertyFeed();
        } else if (index === 1) {
            // Favoritos
            loadFavoriteFeed();
        } else if(index === 2){
            window.location.href = 'chats.html';
        }
    });

    // Carrega o feed ao iniciar a página
    loadPropertyFeed();
});
