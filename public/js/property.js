$(document).ready(function() {
    const propertyDetails = $('#propertyDetails');
    const propertyTitle = $('#propertyTitle');
    const RequestModalOverlay = $('#requestModalOverlay');
    const RequestForm = $('#requestForm');
    let currentProperty = null;

    // Função para obter o parâmetro 'id' da URL
    function getPropertyIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Função para renderizar os detalhes do imóvel
    function renderPropertyDetails(property) {
        // Mapeamento de ícones para os detalhes
        const detailIcons = {
            'vagas': { icon: 'fas fa-car', label: 'vagas' },
            'quartos': { icon: 'fas fa-bed', label: 'quartos' },
            'banheiros': { icon: 'fas fa-bath', label: 'banheiros' },
            'pet': { icon: 'fas fa-paw', label: 'Permitido pet' },
            'elevador': { icon: 'fas fa-elevator', label: 'Elevador' },
            'portaria': { icon: 'fas fa-user-tie', label: 'Porteiro 24h' },
            'area': { icon: 'fas fa-ruler-combined', label: 'm²' }
        };

        let detailsHtml = '';
        for (const key in property.details) {
            const value = property.details[key];
            const detail = detailIcons[key];

            if (detail) {
                let label = detail.label;
                let displayValue = value;

                if (key === 'area') {
                    label = `${value}m²`;
                    displayValue = '';
                } else if (key === 'pet' || key === 'elevador' || key === 'portaria') {
                    if (!value) continue; // Não exibe se for falso
                    displayValue = '';
                } else {
                    label = `${value} ${label}`;
                    displayValue = '';
                }

                detailsHtml += `
                    <div class="detail-item">
                        <i class="${detail.icon}"></i>
                        <p>${label}</p>
                    </div>
                `;
            }
        }

        let users_historic = property.historic.map(historic_info => `
            <div class="review-card">
                <p class="author">${historic_info.author}</p>
                <p>${historic_info.text}</p>
            </div>
        `).join('');

        return `
            <div class="image-gallery">
                <div class="main-image-placeholder"></div>
                <div class="side-image-placeholder"></div>
                <div class="image-controls">
                    <span>1</span> 2 3 4 5 6 7 8
                    <a href="#">Ver todas as Fotos</a>
                </div>
            </div>

            <div class="info-section">
                <div class="price-rating">
                    <div class="price">${property.price}</div>
                    <div class="rating">${property.rating} <i class="fas fa-star"></i></div>
                </div>
            </div>

            <div class="description-section">
                <h3>Sobre este lugar:</h3>
                <p>${property.description}</p>
            </div>

            <div class="details-section">
                <h3>Detalhes:</h3>
                <div class="details-grid">
                    ${detailsHtml}
                </div>
            </div>

            <div class="location-section">
                <h3>Localização:</h3>
                <div class="map-placeholder">
                    <!-- Simulação de Mapa -->
                </div>
            </div>

            <div class="reviews-section">
                <h3>Histórico:</h3>
                ${users_historic || '<p>Esse imóvel ainda não possui histórico.</p>'}
            </div>

            <div class="host-section">
                <h3>Sobre o anfitrião:</h3>
                <div class="host-details">
                    <div class="host-avatar"></div>
                    <div class="host-info">
                        <p class="name">${property.host.name}</p>
                        <p>${property.host.city}</p>
                        <p>${property.host.reviews_count} avaliações | ${property.host.listings_count} anúncios</p>
                        <p>${property.host.host_rating} <i class="fas fa-star"></i></p>
                    </div>
                </div>
                <button class="contact-button">Entrar em contato</button>
                <button class="open-request-button" id="openRequestModal">Abrir Solicitação</button>
            </div>
        `;
    }

    // Função para anexar evento ao botão de contato
    function attachContactButtonEvent() {
        const contactButton = $('.contact-button');
        contactButton.on('click', function() {
            if (currentProperty) {
                // Armazena a página de origem na sessionStorage
                sessionStorage.setItem('chatOrigin', 'property');
                sessionStorage.setItem('propertyId', currentProperty.id);
                
                // Redireciona para o chat com o host
                const hostUsername = currentProperty.owner;
                window.location.href = `chat_user.html?host=${hostUsername}&property_id=${currentProperty.id}`;
            }
        });
    }

    // Função para anexar evento ao botão de abrir solicitação
    $(document).on('click', '.host-details', function() {
        window.location.href = 'user.html?username=' + currentProperty.owner;
    });

    // Função para anexar evento ao botão de abrir solicitação
    $(document).on('click', '#openRequestModal', function() {
        RequestModalOverlay.fadeIn(200);
    });

    // Lógica para fechar o modal de solicitação ao clicar fora
    RequestModalOverlay.on('click', function(e) {
        if (e.target.id === 'requestModalOverlay') {
            RequestModalOverlay.fadeOut(200);
        }
    });

    // Lógica para fechar o modal ao pressionar ESC
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && RequestModalOverlay.is(':visible')) {
            RequestModalOverlay.fadeOut(200);
        }
    });

    // Lógica de submissão do formulário de solicitação (simulação)
    RequestForm.on('submit', function(e) {
        e.preventDefault();
        RequestModalOverlay.fadeOut(200);

        const urlEncodedString = RequestForm.serialize();

        const params = new URLSearchParams(urlEncodedString);
        const request_type = Object.fromEntries(params.entries());

        if (currentProperty) {
            $.ajax({
                type: 'POST',
                url: '../src/controllers/PropertyController.php?action=create_request',
                contentType: 'application/json',
                data: JSON.stringify({
                    property_id: currentProperty.id
                    ,request_type: request_type.type_select
                }),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        alert('Solicitação aberta com sucesso!');
                    } else {
                        alert(`Erro ao abrir solicitação: ${response.message}`);
                    }
                },
                error: function() {
                    alert('Erro ao abrir solicitação. Tente novamente mais tarde.');
                }
            });
        }
    });

    // Função principal para carregar os dados
    function loadProperty() {
        const id = getPropertyIdFromUrl();

        if (!id) {
            propertyDetails.html('<p class="error-message">ID do imóvel não fornecido.</p>');
            return;
        }

        $.ajax({
            type: 'GET',
            url: `../src/controllers/PropertyController.php?id=${id}`,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    currentProperty = response.property;
                    console.log(currentProperty)
                    propertyTitle.text(response.property.title);
                    propertyDetails.html(renderPropertyDetails(response.property));
                    
                    // Adiciona evento ao botão "Entrar em contato"
                    attachContactButtonEvent();
                } else {
                    propertyDetails.html(`<p class="error-message">${response.message}</p>`);
                }
            },
            error: function() {
                propertyDetails.html('<p class="error-message">Erro ao carregar os detalhes do imóvel.</p>');
            }
        });
    }

    // Evento de clique no ícone de perfil (redireciona para a página de perfil)
    const profileIcon = $('.profile-icon');
    profileIcon.on('click', function() {
        window.location.href = 'profile.html';
    });

    // Evento de clique no ícone de logout
    const logoutIcon = $('.logout-icon');
    logoutIcon.on('click', function() {
        if (confirm('Deseja sair?')) {
            alert('Logout realizado com sucesso!');
            window.location.href = 'index.html';
        }
    });

    // Evento de clique na aba Chats da sidebar
    $('a').filter(function() {
        return $(this).find('i.fa-comments').length > 0;
    }).on('click', function(e) {
        e.preventDefault();
        window.location.href = 'chats.html';
    });

    loadProperty();
});
