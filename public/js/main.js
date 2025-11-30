$(document).ready(function() {

    // Lógica para o formulário de LOGIN
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        var formData = $(this).serialize();
        var messageBox = $('#message');

        messageBox.hide().removeClass('success error').text('');

        $.ajax({
            type: 'POST',
            url: '../src/controllers/LoginController.php',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    messageBox.text(response.message).removeClass('error').addClass('success').show();
                    if (response.redirect) {
                        // Redirecionamento real para a página principal
                        setTimeout(function() {
                            window.location.href = response.redirect;
                        }, 1000); // Redireciona após 1 segundo
                    }
                } else {
                    messageBox.text(response.message).removeClass('success').addClass('error').show();
                }
            },
            error: function() {
                messageBox.text('Ocorreu um erro ao processar a solicitação de login.').removeClass('success').addClass('error').show();
            }
        });
    });

    // Lógica para o formulário de CADASTRO
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();

        var formData = $(this).serialize();
        var messageBox = $('#message');
        var password = $('#password').val();
        var confirmPassword = $('#confirm_password').val();

        messageBox.hide().removeClass('success error').text('');

        if (password !== confirmPassword) {
            messageBox.text('As senhas não coincidem.').addClass('error').show();
            return;
        }

        $.ajax({
            type: 'POST',
            url: '../src/controllers/RegisterController.php',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    messageBox.text(response.message).removeClass('error').addClass('success').show();
                    // Limpar o formulário após o cadastro bem-sucedido
                    $('#registerForm')[0].reset();

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    messageBox.text(response.message).removeClass('success').addClass('error').show();
                }
            },
            error: function() {
                messageBox.text('Ocorreu um erro ao processar a solicitação de cadastro.').removeClass('success').addClass('error').show();
            }
        });
    });
});
