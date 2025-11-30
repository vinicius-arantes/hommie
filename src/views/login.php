<?php
// Esta view não será usada diretamente, pois o frontend está em index.html
// e faz a requisição via AJAX para o controlador.
// Em um projeto puramente PHP, esta view conteria o formulário HTML.

// Apenas um placeholder para manter a estrutura de pastas.
// O acesso ao login deve ser feito via /public/index.html

// Se o usuário tentar acessar esta view diretamente, redirecionamos para o frontend.
header('Location: ../../public/index.html');
exit;
?>
