$(document).ready(function() {
    const chatsList = $('#chatsList');
    const profileIcon = $('.profile-icon');
    const logoutIcon = $('.logout-icon');

    // Função para carregar os chats do usuário
    function loadChats() {
        $.ajax({
            type: 'GET',
            url: '../src/controllers/ChatController.php',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    chats_arr = Object.values(response.chats);
                    console.log(chats_arr);
                    displayChats(chats_arr);
                } else {
                    chatsList.html('<p class="loading-message">Nenhum chat encontrado.</p>');
                }
            },
            error: function() {
                chatsList.html('<p class="loading-message">Erro ao carregar os chats.</p>');
            }
        });
    }

    // Função para exibir os chats
    function displayChats(chats) {
        chatsList.empty();
        
        if (chats.length === 0) {
            chatsList.html('<p class="loading-message">Você não tem nenhum chat ainda.</p>');
            return;
        }
        
        chats.forEach(function(chat) {
            const chatItem = `
                <a href="chat_user.html?chat_id=${chat.id}" class="chat-item">
                    <div class="chat-avatar"></div>
                    <div class="chat-info">
                        <p class="chat-host-name">${chat.host_name}</p>
                        <p class="chat-last-message">${chat.last_message || 'Nenhuma mensagem'}</p>
                    </div>
                    <div class="chat-unread-count">1</div>
                </a>
            `;
            chatsList.append(chatItem);
        });
    }

    // Evento de clique no ícone de perfil
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

    // Carrega os chats ao iniciar a página
    loadChats();
});
