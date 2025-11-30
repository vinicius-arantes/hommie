$(document).ready(function() {
    const createPropertyForm = $('#createPropertyForm');
    const typeButtons = $('.type-btn');
    const profileIcon = $('.profile-icon');
    const logoutIcon = $('.logout-icon');
    const cancelBtn = $('#cancelBtn');
    const amenityPopup = $('#amenityPopup');
    const petCheckbox = $('#pet');
    const petPopupCheckbox = $('#pet-popup');

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

        const propertyData = {
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
            portaria: $('#portaria').is(':checked')
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
            url: '../src/controllers/PropertyController.php',
            contentType: 'application/json',
            data: JSON.stringify(propertyData),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Imóvel criado com sucesso!');
                    window.location.href = 'profile.html';
                } else {
                    alert('Erro ao criar o imóvel: ' + response.message);
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
});
