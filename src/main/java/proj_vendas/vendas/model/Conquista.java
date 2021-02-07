package proj_vendas.vendas.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "CONQUISTAS")
public class Conquista extends AbstractEntity<Long> {

	private int codEmpresa;
	
	//Categoria: Vendas
	private boolean V1000; //Iniciante: vender 1.000 reais.
	private boolean V5000; //Intermediário: vender 5.000 reais.
	private boolean V10000; //Pro: vender 10.000 reais.
	private boolean V20000; //Expert: vender 20.000 reais.
	
	//Categoria: Sistema
	private boolean cadEmpresa; //Cadastre sua empresa.
	private boolean cadProduto; //Cadastre seu primeiro produto.
	private boolean cadFuncionario; //Cadastre seu primeiro funcionário.
	private boolean cadPedido; //Lançar o primeiro pedido.
	
	//Categoria: Entregas
	private boolean E100; //Iniciante: Faça 100 entregas.
	private boolean E5000; //Intermediário: Faça 5000 entregas.
	private boolean E100000; //Pró: Faça 100.000 entregas.
	private boolean E500000; //Expert: Faça 500.000 entregas.
	
	//Categoria: Cadastro
	private boolean C100; //Iniciantes: Cadastre 100 clientes
	private boolean C1000; //Intermediário: Cadastre 1000 clientes
	private boolean C5000; //Pró: Cadastre 5000 clientes.
	private boolean C10000; //Expert: Cadastre 10000 clientes.
	
	//Categoria: Trabalho
	private boolean T30; //Iniciante: Trabalhe 30 dias.
	private boolean T180; //Intermediário: Trabalhe 180 dias.
	private boolean T365; //Pro: Trabalhe 365 dias.
	private boolean T730; //Expert: Trabalhe 730 dias.
}
