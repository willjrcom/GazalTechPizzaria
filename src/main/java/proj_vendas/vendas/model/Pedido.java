package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "PEDIDOS")
public class Pedido extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private Long comanda;
	
	@Column(nullable=false)
	private String nome;
	private String celular;
	private String endereco;
	@Lob
	private String pizzas;
	@Lob
	private String produtos;
	
	private String motoboy;
	private String ac;
	
	@Column(nullable=false)
	private String status;
	
	@Column(nullable=false)
	private String envio;
	private String pagamento;
	private String taxa;
	private double total;
	private double troco;

	private String obs;
	private String horaPedido;
	private String data;
	
	@Column(nullable=false)
	private int codEmpresa;
}
