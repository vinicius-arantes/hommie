<?php

final class Connection {
	private function __construct() {}
	public static function connect() {
		/** Conexão (Container do Docker) */
		$host = 'postgres';
        $port = 5432;
        $dbname = 'hommie';
        $user = 'admin';
        $password = 'password';

		$conexao = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;options='--client_encoding=UTF8'", $user, $password);
		$conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		return $conexao;
	}

	public static function search($sql){
		try {
			include_once __DIR__ . '/Transaction.class.php';
            $conection = Transaction::get();

            // $sql = self::remove_accent($sql);

            $resultado = $conection->Query(($sql));
            if($resultado->rowCount()==0) {
                $retorno["error"] = true;
                $retorno["msg"] = "Nenhum valor encontrado!";
            } else {
				while($dados = $resultado->fetchObject()) {
					foreach ($dados as $key => $value) {
						$dados->$key = $value;
					}
					$tabela[] = $dados;
				}
                
                $retorno["msg"] = $tabela;
                $retorno["error"] = false;
                $retorno["title"] = "Sucesso";
            }

        } catch(Exception $e) {
            $retorno["error"] = true;
            $retorno["msg"] = "Ocorreu um erro entre em contato com o Administrador ";

            if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
                $retorno["msg"] .= $e->getMessage();
            }
        }
		return $retorno;
	}
	public static function execute($sql, $showError = false, $use_exception = false){
		try {
			$conexao = Transaction::get();

			$resultado = $conexao->Query($sql);
			if(empty($resultado)) {
				$retorno["error"] = true;
				$retorno["title"] = "Erro";
				$retorno["msg"] = "Nenhum valor inserido!";
				$retorno["debug"] = "Nenhum valor inserido! ".$resultado;

				if ($use_exception) {
					throw new Exception($retorno["msg"], 500);
				}
			}
			else {
				$retorno["error"] = false;
				$retorno["title"] = "Sucesso";
				$retorno["msg"] = "Operação Realizada com Sucesso";
			}
		}
		catch(Exception $e) {
			$retorno["error"] = true;
			$msgERROR = ($showError)?$e->getMessage():"";
			$retorno["msg"] = "Ocorreu um erro entre em contato com o Administrador.{$msgERROR} {$e->getMessage()}";

			if ($use_exception) {
				throw new Exception($retorno["msg"], 500);
			}
		}
		return $retorno;
	}
	public static function insert_data($tabela, $dados,$debug = FALSE, $show_errors = false){
		try {
			$conexao = Transaction::get();
			$arr_campos = array();
			$arr_valores = array();
			foreach ($dados as $key => $value) {
				$arr_campos[] = $key;
				$arr_valores[] = $value;
			}
			$campos = implode(" ,", $arr_campos);
			$valores = implode(" ,", $arr_valores);

			$sql = "INSERT INTO {$tabela} ($campos) VALUES ({$valores})";

			if ($debug){ echo "<pre>"; die(print_r($sql));}
			$resultado = $conexao->Query($sql);

			if(empty($resultado)) {
				$retorno["error"] = true;
				$retorno["title"] = "Erro";
				$retorno["msg"] = "Nenhum valor inserido!";
				$retorno["debug"] = "Nenhum valor inserido! ".$resultado;
			}
			else {
				$retorno["error"] = false;
				$retorno["title"] = "Sucesso";
				$retorno["msg"] = "Operação Realizada com Sucesso";
				$last_id = $conexao->Query("SELECT lastval() as cod");
				$last_id = $last_id->fetchObject();
				$retorno["id"] = $last_id->cod;
			}
		}
		catch(Exception $e) {
			$retorno["error"] = true;
			$retorno["msg"] = "Ocorreu um erro entre em contato com o Administrador. Erro: ";
			if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false or $show_errors) {
				$retorno["msg"] .= $e->getMessage();
			}

			$exception_message = strpos($e->getMessage(), " [INSERT") !== false ? explode(" [INSERT", $e->getMessage())[0] : $e->getMessage();
			$explode_tabela = explode(".", $tabela);
			$exception_table_name = end($explode_tabela);
			$retorno["exception"] = "Falha no INSERT da tabela {$exception_table_name}. {$exception_message}";
		}
		return $retorno;
	}
	public static function insert_data_multi($tabela, $dados,$debug = false, $returnSQL = false){
		try {
			$conexao = Transaction::get();
			$arr_campos = array();
			$arr_valores = array();
			foreach ($dados as $key => $value) {
				$arr_campos = array();
				foreach ($value as $chave => $valor) {
					$arr_campos[] = $chave;
					$arr_valores[$key][] = $valor;
				}
				$campos = implode(" ,", $arr_campos);
				$valores_aux[$key] = "(".implode(" ,", $arr_valores[$key]).")";
			}
			$valores = implode(" ,",$valores_aux);

			$sql = "INSERT INTO {$tabela} ($campos) VALUES {$valores}";

			if ($debug){ echo "<pre>"; die(print_r($sql));}
			if ($returnSQL) return $sql;

			$resultado = $conexao->Query($sql);

			if(empty($resultado)) {
				$retorno["error"] = true;
				$retorno["title"] = "Erro";
				$retorno["msg"] = "Nenhum valor inserido!";
				$retorno["debug"] = "Nenhum valor inserido! ".$resultado;
			}
			else {

				$retorno["error"] = false;
				$retorno["title"] = "Sucesso";
				$retorno["msg"] = "Operação Realizada com Sucesso";
				$last_id = $conexao->Query("SELECT lastval() as cod");
				$last_id = $last_id->fetchObject();
				$retorno["id"] = $last_id->cod;
			}
			
		} catch(Exception $e) {					
			$retorno["error"] = true;
			$retorno["msg"] = "Ocorreu um erro entre em contato com o Administrador";

			$exception_message = strpos($e->getMessage(), " [INSERT") !== false ? explode(" [INSERT", $e->getMessage())[0] : $e->getMessage();
			$exception_table_name = explode(".", $tabela);
			$exception_table_name = end($exception_table_name);
			$retorno["exception"] = "Falha no INSERT multi da tabela {$exception_table_name}. {$exception_message}";
			// use o exception_complete para debugar
			$retorno["exception_complete"] = $e->getMessage();
		}
		return $retorno;
	}
	public static function edit_data($tabela, $dados, $debug = FALSE){
		try {
			$conexao = Transaction::get();
			$arr_campos = array();

			foreach ($dados as $key => $value) {
				if ($key!="id") {
					$arr_campos[] = "{$key} = {$value}";
				}
			}
			$campos = implode(" ,", $arr_campos);
			$id = $dados["id"];
			$sql = "UPDATE {$tabela} SET {$campos} WHERE id = {$id}";

			if ($debug){ echo "<pre>"; die(print_r($sql)); }
			$resultado = $conexao->Query($sql);
			if(empty($resultado)) {
				$retorno["error"] = true;
				$retorno["title"] = "Erro";
				$retorno["msg"] = "Nenhum valor Alterado!";
				$retorno["debug"] = "Nenhum valor inserido! ".$resultado;
			}
			else {
				$retorno["error"] = false;
				$retorno["title"] = "Sucesso";
				$retorno["msg"] = "Operação Realizada com Sucesso";
			}
		}
		catch(Exception $e) {
			$retorno["error"] = true;
			$retorno["msg"] = "Ocorreu um erro entre em contato com o Administrador.";

			$exception_message = strpos($e->getMessage(), " [UPDATE") !== false ? explode(" [UPDATE", $e->getMessage())[0] : $e->getMessage();
			$exception_table_name = explode(".", $tabela);
			$exception_table_name = end($exception_table_name);
			$retorno["exception"] = "Falha no UPDATE da tabela {$exception_table_name}. {$exception_message}";
		}
		return $retorno;
	}
	public static function remove_accent($string) {
		$string = str_replace(
			array('á','à','ã','â','ä','é','è','ê','ë','í','ì','î','ï','ó','ò','õ','ô','ö','ú','ù','û','ü','ç'),
			array('a','a','a','a','a','e','e','e','e','i','i','i','i','o','o','o','o','o','u','u','u','u','c'),
			$string
		);
		$string = str_replace(
			array('Á','À','Ã','Â','Ä','É','È','Ê','Ë','Í','Ì','Î','Ï','Ó','Ò','Õ','Ô','Ö','Ú','Ù','Û','Ü','Ç'),
			array('A','A','A','A','A','E','E','E','E','I','I','I','I','O','O','O','O','O','U','U','U','U','C'),
			$string
		);
		return $string;
	}
}
?>
