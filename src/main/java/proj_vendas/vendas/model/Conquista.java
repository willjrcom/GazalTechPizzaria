package proj_vendas.vendas.model;

import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
public class Conquista extends AbstractEntity<Long> {
	
	//Categoria: Vendas
	private float totalVendas = 0;
	private boolean V1; //Iniciante: vender 1.000 reais.
	private boolean V2; //Intermediário: vender 5.000 reais.
	private boolean V3; //Pro: vender 10.000 reais.
	private boolean V4; //Expert: vender 20.000 reais.
	
	//Categoria: Entregas
	private int totalEntregas = 0;
	private boolean E1; //Iniciante: Faça 100 entregas.
	private boolean E2; //Intermediário: Faça 5.000 entregas.
	private boolean E3; //Pró: Faça 100.000 entregas.
	private boolean E4; //Expert: Faça 500.000 entregas.
	
	//Categoria: Cadastro
	private int totalClientes = 0;
	private boolean C1; //Iniciantes: Cadastre 100 clientes
	private boolean C2; //Intermediário: Cadastre 1.000 clientes
	private boolean C3; //Pró: Cadastre 5.000 clientes.
	private boolean C4; //Expert: Cadastre 10.000 clientes.
	
	//Categoria: Trabalho
	private int totalDias = 0;
	private boolean T1; //Iniciante: Trabalhe 30 dias.
	private boolean T2; //Intermediário: Trabalhe 180 dias.
	private boolean T3; //Pro: Trabalhe 365 dias.
	private boolean T4; //Expert: Trabalhe 730 dias.

	//Categoria: Sistema
	private boolean cadEmpresa; //Cadastre sua empresa.
	private boolean cadProduto; //Cadastre seu primeiro produto.
	private boolean cadFuncionario; //Cadastre seu primeiro funcionário.
	private boolean cadPedido; //Lançar o primeiro pedido.
}
