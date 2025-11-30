$(document).ready(function() {
    const chatMessages = $('#chatMessages');
    const messageInput = $('#messageInput');
    const sendBtn = $('#sendBtn');
    const exitChatBtn = $('#exitChatBtn');
    const hostNameElement = $('#hostName');
    const profileIcon = $('.profile-icon');
    const logoutIcon = $('.logout-icon');

    let currentChat = null;
    let chatOrigin = 'chats'; // 'chats' ou 'property'

    // Função para obter os parâmetros da URL
    function getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            chatId: urlParams.get('chat_id'),
            host: urlParams.get('host'),
            propertyId: urlParams.get('property_id')
        };
    }

    // Função para carregar o chat
    function loadChat() {
        const params = getUrlParams();
        
        // Verifica se veio de um imóvel ou da lista de chats
        if (sessionStorage.getItem('chatOrigin') === 'property') {
            chatOrigin = 'property';
            sessionStorage.removeItem('chatOrigin');
        }

        console.log(params)
        if (params.chatId) {
            // Carrega um chat existente
            loadExistingChat(params.chatId);
        } else if (params.host) {
            // Cria ou carrega um chat com um host específico
            loadOrCreateChat(params.host, params.propertyId);
        } else {
            chatMessages.html('<p class="loading-message">Parâmetros inválidos.</p>');
        }
    }

    // Função para carregar um chat existente
    function loadExistingChat(chatId) {
        $.ajax({
            type: 'GET',
            url: `../src/controllers/ChatController.php?chat_id=${chatId}`,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    currentChat = response.chat;
                    displayChat(response.chat);
                } else {
                    chatMessages.html(`<p class="loading-message">${response.message}</p>`);
                }
            },
            error: function() {
                chatMessages.html('<p class="loading-message">Erro ao carregar o chat.</p>');
            }
        });
    }

    // Função para carregar ou criar um chat com um host
    function loadOrCreateChat(hostUsername, propertyId) {
        $.ajax({
            type: 'GET',
            url: `../src/controllers/ChatController.php?host=${hostUsername}&property_id=${propertyId || ''}`,
            dataType: 'json',
            success: function(response) {

                if (response.success) {
                    currentChat = response.chat;
                    displayChat(response.chat, hostUsername);
                } else {
                    chatMessages.html(`<p class="loading-message">${response.message}</p>`);
                }
            },
            error: function() {
                chatMessages.html('<p class="loading-message">Erro ao carregar o chat.</p>');
            }
        });
    }

    // Função para exibir o chat
    function displayChat(chat, hostUsername) {
        hostNameElement.text(chat.host_name);
        chatMessages.empty();

        if (chat.messages.length === 0) {
            chatMessages.html('<p class="loading-message">Nenhuma mensagem ainda. Comece a conversa!</p>');
        } else {
            chat.messages.forEach(function(message) {
                const messageHtml = `
                    <div class="message ${message.sender}">
                        <div class="message-bubble">${escapeHtml(message.text)}</div>
                        <span class="message-timestamp">${formatTime(message.timestamp)}</span>
                    </div>
                `;
                chatMessages.append(messageHtml);
            });
        }

        // Scroll para a última mensagem
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }

    // Função para enviar uma mensagem
    function sendMessage() {
        const messageText = messageInput.val().trim();

        if (!messageText || !currentChat) {
            return;
        }

        const messageData = {
            chat_id: currentChat.id,
            message: messageText
        };

        $.ajax({
            type: 'POST',
            url: '../src/controllers/ChatController.php',
            contentType: 'application/json',
            data: JSON.stringify(messageData),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Adiciona a mensagem à lista
                    const messageHtml = `
                        <div class="message user">
                            <div class="message-bubble">${escapeHtml(messageText)}</div>
                            <span class="message-timestamp">${formatTime(response.new_message.timestamp)}</span>
                        </div>
                    `;
                    chatMessages.append(messageHtml);
                    messageInput.val('');

                    // Scroll para a última mensagem
                    chatMessages.scrollTop(chatMessages[0].scrollHeight);

                    // Atualiza o chat atual
                    currentChat.messages.push(response.new_message);
                    currentChat.last_message = messageText;
                } else {
                    alert('Erro ao enviar a mensagem: ' + response.message);
                }
            },
            error: function() {
                alert('Erro ao comunicar com o servidor.');
            }
        });
    }

    // Função para formatar o tempo
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Função para escapar HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Evento de clique no botão "Enviar"
    sendBtn.on('click', function() {
        sendMessage();
    });

    // Evento de Enter no input de mensagem
    messageInput.on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Evento de clique no botão "Sair"
    exitChatBtn.on('click', function() {
        if (chatOrigin === 'property') {
            const propertyId = sessionStorage.getItem('propertyId');
            if (propertyId) {
                window.location.href = `property.html?id=${propertyId}`;
                sessionStorage.removeItem('propertyId');
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            window.location.href = 'chats.html';
        }
    });

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

    // Carrega o chat ao iniciar a página
    loadChat();
});
