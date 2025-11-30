$(document).ready(function() {
    const createPropertyForm = $('#createPropertyForm');
    const typeButtons = $('.type-btn');
    const profileIcon = $('.profile-icon');
    const logoutIcon = $('.logout-icon');
    const cancelBtn = $('#cancelBtn');
    const deleteBtn = $('#deleteBtn');
    const amenityPopup = $('#amenityPopup');
    const petCheckbox = $('#pet');
    const petPopupCheckbox = $('#pet-popup');
    const requestsGrid = $('#requestsGrid');

    let selectedType = 'Aluguel';

    // Evento de clique nos botões de tipo de imóvel
    typeButtons.on('click', function(e) {
        e.preventDefault();
        const $this = $(this);
        
        // Remove a classe active de todos os botões
        typeButtons.removeClass('active');
        // Adiciona a classe active ao botão clicado
        $this.addClass('active');
        
        // Atualiza o tipo selecionado
        selectedType = $this.data('type');
    });

    // Evento de clique no checkbox de pet para exibir/ocultar o popup
    petCheckbox.on('change', function() {
        if ($(this).is(':checked')) {
            amenityPopup.addClass('active');
        } else {
            amenityPopup.removeClass('active');
        }
    });

    // Sincroniza os checkboxes de pet
    petPopupCheckbox.on('change', function() {
        petCheckbox.prop('checked', $(this).is(':checked'));
    });

    // Evento de submissão do formulário
    createPropertyForm.on('submit', function(e) {
        e.preventDefault();

        getUrlParams = new URLSearchParams(window.location.search);
        const id = getUrlParams.get('id');

        const propertyData = {
            id: id,
            title: $('#location').val() + ' - ' + selectedType,
            location: $('#location').val(),
            price: $('#price').val(),
            type: selectedType,
            description: $('#description').val(),
            nearby: $('#nearby').val(),
            area: $('#area').val(),
            vagas: parseInt($('#vagas').val()),
            quartos: parseInt($('#quartos').val()),
            banheiros: parseInt($('#banheiros').val()),
            pet: $('#pet-popup').is(':checked'),
            elevador: $('#elevador').is(':checked'),
            portaria: $('#portaria').is(':checked'),
            host_name: 'Anfitrião'
        };

        // Valida os campos obrigatórios
        if (!propertyData.location || !propertyData.price) {
            alert('Por favor, preencha os campos obrigatórios: Localização e Valor.');
            return;
        }

        // Submete o formulário via AJAX
        submitProperty(propertyData);
    });

    // Função para submeter o imóvel
    function submitProperty(propertyData) {
        $.ajax({
            type: 'POST',
            url: '../src/controllers/PropertyController.php?action=edit_property',
            contentType: 'application/json',
            data: JSON.stringify(propertyData),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Imóvel editado com sucesso!');
                    window.location.href = 'profile.html';
                } else {
                    alert('Erro ao editar o imóvel: ' + response.message);
                }
            },
            error: function() {
                alert('Erro ao comunicar com o servidor.');
            }
        });
    }

    function loadImovelData() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            alert('ID do imóvel não fornecido.');
            return;
        }

        $.ajax({
            type: 'GET',
            url: `../src/controllers/PropertyController.php?id=${id}`,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    const property = response.property;
                    $('#location').val(property.location);
                    $('#price').val(property.price);
                    $('#description').val(property.description);
                    $('#nearby').val(property.nearby);
                    $('#area').val(property.details.area);
                    $('#vagas').val(property.details.vagas);
                    $('#quartos').val(property.details.quartos);
                    $('#banheiros').val(property.details.banheiros);
                    if (property.details.pet) {
                        petCheckbox.prop('checked', true);
                        petPopupCheckbox.prop('checked', true);
                        amenityPopup.addClass('active');
                    }
                    if (property.details.elevador) {
                        $('#elevador').prop('checked', true);
                    }
                    if (property.details.portaria) {
                        $('#portaria').prop('checked', true);
                    }
                    selectedType = property.type;
                    typeButtons.removeClass('active');
                    typeButtons.each(function() {
                        if ($(this).data('type') === selectedType) {
                            $(this).addClass('active');
                        }
                    });

                    displayRequests(property.requests);
                    attachApproveRejectHandlers();
                } else {
                    alert('Erro ao carregar os dados do imóvel: ' + response.message);
                }
            },
            error: function() {
                alert('Erro ao comunicar com o servidor.');
            }
        });
    }

    // Evento de clique no botão "Cancelar"
    cancelBtn.on('click', function(e) {
        e.preventDefault();
        if (confirm('Deseja cancelar a criação do imóvel?')) {
            window.location.href = 'profile.html';
        }
    });

    // Evento de clique no botão "Cancelar"
    deleteBtn.on('click', function(e) {
        e.preventDefault();
        if (confirm('Deseja excluir o imóvel?')) {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');

            $.ajax({
                type: 'POST',
                url: `../src/controllers/PropertyController.php?action=delete_property`,
                contentType: 'application/json',
                data: JSON.stringify({ id: id }),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        alert('Imóvel excluído com sucesso!');
                        window.location.href = 'profile.html';
                    } else {
                        alert('Erro ao excluir o imóvel: ' + response.message);
                    }
                },
                error: function() {
                    alert('Erro ao comunicar com o servidor.');
                }
            }); 
        }
    });

    // Evento de clique no ícone de perfil (redireciona para a página de perfil)
    profileIcon.on('click', function() {
        window.location.href = 'profile.html';
    });

    // Evento de clique no ícone de logout
    logoutIcon.on('click', function() {
        if (confirm('Deseja sair?')) {
            alert('Logout realizado com sucesso!');
            window.location.href = 'index.html';
        }
    });

    // Evento de clique no botão de upload (simulação)
    $('#uploadBtn').on('click', function(e) {
        e.preventDefault();
        alert('Funcionalidade de upload de fotos em desenvolvimento.');
    });

    // Função para exibir as acomodações
    function displayRequests(requests) {
        requestsGrid.empty();
        
        if (requests.length === 0) {
            requestsGrid.html('<p>Esse imóvel ainda não tem solicitações.</p>');
            return;
        }
        
        requests.forEach(function(request) {
            approve_and_reject_buttons = null;
            if(request.status == 0){
                approve_and_reject_buttons = `
                    <button class="approve-request-btn">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="reject-request-btn">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            }
            const requestCard = `
                <div class="request-card" data-request-id="${request.id}">
                    <div class="request-info">
                        <h4>${request.requester} - ${request.request_type}</h4>
                        ${approve_and_reject_buttons || ''}
                        <div class="request-status-${request.status_label}">
                            ${request.status_label}
                        </div>
                    </div>
                </div>
            `;
            requestsGrid.append(requestCard);
        });
    }

    function attachApproveRejectHandlers() {
        $('.approve-request-btn').on('click', function() {
            const requestId = $(this).closest('.request-card').data('request-id');
            approveRequest(requestId);
        });

        $('.reject-request-btn').on('click', function() {
            const requestId = $(this).closest('.request-card').data('request-id');
            rejectRequest(requestId);
        });
    }

    function approveRequest(requestId) {
        console.log(requestId)
        // Lógica para aprovar a solicitação
        $.ajax({
            type: 'POST',
            url: `../src/controllers/PropertyController.php?action=approve_request`,
            contentType: 'application/json',
            data: JSON.stringify({ id: requestId }),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Solicitação aprovada.');
                    loadImovelData(); // Recarrega os dados do imóvel para atualizar a lista de solicitações
                } else {
                    alert('Erro ao aprovar a solicitação');
                }
            },
            error: function() {
                alert('Erro ao comunicar com o servidor.');
            }
        });
    }

    function rejectRequest(requestId) {
        // Lógica para rejeitar a solicitação
        $.ajax({
            type: 'POST',
            url: `../src/controllers/PropertyController.php?action=reject_request`,
            contentType: 'application/json',
            data: JSON.stringify({ id: requestId }),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Solicitação rejeitada.');
                    loadImovelData(); // Recarrega os dados do imóvel para atualizar a lista de solicitações
                } else {
                    alert('Erro ao rejeitar a solicitação');
                }
            },
            error: function() {
                alert('Erro ao comunicar com o servidor.');
            }
        });
    }

    loadImovelData();
});
