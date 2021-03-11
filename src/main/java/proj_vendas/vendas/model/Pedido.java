package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "PEDIDO", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "data_index", columnList = "data"),
		@Index(name = "status_index", columnList = "status"),
		@Index(name = "nome_index", columnList = "nome"),
		@Index(name = "envio_index", columnList = "envio"),
		@Index(name = "celular_index", columnList = "celular"),
})
public class Pedido extends AbstractEntity<Long> {

	@Column(nullable=false)
	private int codEmpresa;
	
	@Column(nullable=false)
	private Long comanda;
	private Long celular;
	
	@Column(nullable=false)
	private String nome;
	private String endereco;
	private String referencia;
	
	@Lob
	private String pizzas;
	@Lob
	private String produtos;
	
	private String motoboy;
	private String ac;
	private String garcon;
	
	@Column(nullable=false)
	private String status;
	
	@Column(nullable=false)
	private String envio;
	private String obs;
	private String horaPedido;
	private String data;
	private String cupom;
	private String modoPagamento;
	private boolean pago;
	
	private float taxa = 0;
	private float total = 0;
	private float troco = 0;
	private float servico = 0;
}
