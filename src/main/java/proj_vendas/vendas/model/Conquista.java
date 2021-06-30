package proj_vendas.vendas.model;

import javax.persistence.Column;
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
	
	@Column(nullable = false)
	private float totalVendas = 0;
	
	@Column(nullable = false)
	private boolean V1; //Iniciante: vender 1.000 reais.
	
	@Column(nullable = false)
	private boolean V2; //Intermediário: vender 5.000 reais.
	
	@Column(nullable = false)
	private boolean V3; //Pro: vender 10.000 reais.
	
	@Column(nullable = false)
	private boolean V4; //Expert: vender 20.000 reais.
	
	//Categoria: Entregas
	@Column(nullable = false)
	private int totalEntregas = 0;
	
	@Column(nullable = false)
	private boolean E1; //Iniciante: Faça 100 entregas.
	
	@Column(nullable = false)
	private boolean E2; //Intermediário: Faça 5.000 entregas.
	
	@Column(nullable = false)
	private boolean E3; //Pró: Faça 100.000 entregas.
	
	@Column(nullable = false)
	private boolean E4; //Expert: Faça 500.000 entregas.
	
	//Categoria: Cadastro
	
	@Column(nullable = false)
	private int totalClientes = 0;
	
	@Column(nullable = false)
	private boolean C1; //Iniciantes: Cadastre 100 clientes
	
	@Column(nullable = false)
	private boolean C2; //Intermediário: Cadastre 1.000 clientes
	
	@Column(nullable = false)
	private boolean C3; //Pró: Cadastre 5.000 clientes.
	
	@Column(nullable = false)
	private boolean C4; //Expert: Cadastre 10.000 clientes.
	
	//Categoria: Trabalho
	
	@Column(nullable = false)
	private int totalDias = 0;
	
	@Column(nullable = false)
	private boolean T1; //Iniciante: Trabalhe 30 dias.
	
	@Column(nullable = false)
	private boolean T2; //Intermediário: Trabalhe 180 dias.
	
	@Column(nullable = false)
	private boolean T3; //Pro: Trabalhe 365 dias.
	
	@Column(nullable = false)
	private boolean T4; //Expert: Trabalhe 730 dias.

	//Categoria: Sistema
	@Column(nullable = false)
	private boolean cadEmpresa; //Cadastre sua empresa.
	
	@Column(nullable = false)
	private boolean cadProduto; //Cadastre seu primeiro produto.
	
	@Column(nullable = false)
	private boolean cadFuncionario; //Cadastre seu primeiro funcionário.
	
	@Column(nullable = false)
	private boolean cadPedido; //Lançar o primeiro pedido.
}
